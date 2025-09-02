"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideServices = void 0;
const ride_interface_1 = require("./ride.interface");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getDistanceInKm_1 = require("../../utils/getDistanceInKm");
const getDurationInMin_1 = require("../../utils/getDurationInMin");
const getCalculateEstimatedFare_1 = require("../../utils/getCalculateEstimatedFare");
const ride_model_1 = require("./ride.model");
const driver_model_1 = require("../driver/driver.model");
const driver_interface_1 = require("../driver/driver.interface");
const user_interface_1 = require("../user/user.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const queryBuilder_1 = require("../../utils/queryBuilder");
const ride_constant_1 = require("./ride.constant");
const findRide = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    const today = new Date();
    const cancelledRides = yield ride_model_1.Ride.find({
        user: decodedToken.userId,
        status: ride_interface_1.Status.CANCELLED,
        createdAt: {
            $gte: (0, date_fns_1.startOfDay)(today),
            $lte: (0, date_fns_1.endOfDay)(today)
        }
    });
    if (cancelledRides.length > 10) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cancelled 10 rides today and can't request another ride until tomorrow");
    }
    const lon1 = payload.pickupLocation.coordinates[0];
    const lat1 = payload.pickupLocation.coordinates[1];
    const lon2 = payload.dropoffLocation.coordinates[0];
    const lat2 = payload.dropoffLocation.coordinates[1];
    const distance = (0, getDistanceInKm_1.getDistanceInKm)(lon1, lat1, lon2, lat2);
    const durationInMin = (0, getDurationInMin_1.getDurationInMinutes)(distance);
    const totalFare = (0, getCalculateEstimatedFare_1.getCalculateEstimatedFare)(distance, durationInMin);
    const newPayload = Object.assign(Object.assign({}, payload), { distance: distance, duration: durationInMin, estimatedFare: totalFare, paymentStatus: ride_interface_1.PAYMENT.UNPAID, requestedAt: new Date(), status: ride_interface_1.Status.REQUESTED });
    const nearByDriverFind = yield driver_model_1.Driver.find({
        availability: driver_interface_1.Availability.ONLINE,
        driverStatus: driver_interface_1.DriverStatus.APPROVED,
        location: {
            $near: {
                $geometry: payload.pickupLocation,
                $maxDistance: 5000
            }
        }
    }).limit(5);
    if (!nearByDriverFind.length) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "No nearbydrivers found");
    }
    const candidateDrivers = nearByDriverFind.map(d => d._id);
    let assignedDriver = null;
    for (const driver of nearByDriverFind) {
        const activeRide = yield ride_model_1.Ride.findOne({ driver: driver._id, status: { $in: [ride_interface_1.Status.ACCEPTED, ride_interface_1.Status.PICKED_UP, ride_interface_1.Status.IN_TRANSIT] } });
        if (!activeRide) {
            assignedDriver = driver._id;
            break;
        }
    }
    if (!assignedDriver) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "All nearby drivers are busy");
    }
    newPayload.driver = assignedDriver._id;
    newPayload.candidateDrivers = candidateDrivers;
    const ride = yield ride_model_1.Ride.create(newPayload);
    return ride;
});
const paymentStatusUpdate = (rideId, paymentStatus, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride is not found");
        }
        const driver = yield driver_model_1.Driver.findById(ride.driver);
        if (!driver) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver is not found");
        }
        if (driver.user.toString() !== decodedToken.userId) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User id does not match");
        }
        if (ride.status !== ride_interface_1.Status.COMPLETED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "First complete the ride please");
        }
        ride.paymentStatus = paymentStatus;
        yield ride.save({ session });
        if (ride.paymentStatus === ride_interface_1.PAYMENT.PAID) {
            yield driver_model_1.Driver.updateOne({ _id: ride.driver }, {
                $inc: { earnings: ride.estimatedFare }
            }, { session });
        }
        yield session.commitTransaction();
        session.endSession();
        return ride;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const rideStatusUpdate = (rideId, status, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.status === ride_interface_1.Status.COMPLETED) {
        throw new appError_1.default(http_status_codes_1.default.CONFLICT, "Ride is already completed");
    }
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role === user_interface_1.Role.USER) {
        if (ride.user.toString() !== decodedToken.userId) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not the owner of this ride");
        }
        if (status !== ride_interface_1.Status.CANCELLED) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Users can only cancel their own ride");
        }
    }
    if (user.role === user_interface_1.Role.DRIVER) {
        const findDriver = yield driver_model_1.Driver.findById(ride.driver);
        if (!findDriver) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
        }
        if (findDriver.user.toString() !== decodedToken.userId) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not assigned to this ride");
        }
        if (status === ride_interface_1.Status.REQUESTED || status === ride_interface_1.Status.CANCELLED) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Driver cannot set ride to requested/cancelled");
        }
    }
    if (!ride_interface_1.allowedDriverTransitions[ride.status].includes(status)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `Cannot change ride status from ${ride.status} to ${status}`);
    }
    switch (status) {
        case ride_interface_1.Status.CANCELLED:
            ride.status = ride_interface_1.Status.CANCELLED;
            ride.cancelledAt = new Date();
            break;
        case ride_interface_1.Status.REJECTED:
            ride.status = ride_interface_1.Status.REJECTED;
            ride.rejectedAt = new Date();
            ride.candidateDrivers = ride.candidateDrivers.filter(id => { var _a; return id.toString() !== ((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()); });
            if (ride.candidateDrivers.length > 0) {
                ride.driver = ride.candidateDrivers[0];
                ride.status = ride_interface_1.Status.REQUESTED;
            }
            else {
                ride.status = ride_interface_1.Status.REJECTED;
                ride.driver = null;
            }
            break;
        case ride_interface_1.Status.ACCEPTED:
            ride.status = ride_interface_1.Status.ACCEPTED;
            ride.acceptedAt = new Date();
            ride.candidateDrivers = ride.candidateDrivers.filter(d => { var _a; return d._id.toString() === ((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()); });
            break;
        case ride_interface_1.Status.IN_TRANSIT:
            ride.status = ride_interface_1.Status.IN_TRANSIT;
            break;
        case ride_interface_1.Status.PICKED_UP:
            ride.status = ride_interface_1.Status.PICKED_UP;
            ride.startTime = new Date();
            break;
        case ride_interface_1.Status.COMPLETED:
            ride.status = ride_interface_1.Status.COMPLETED;
            ride.endTime = new Date();
            break;
        default:
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid status transition");
    }
    yield ride.save();
    if (ride.status === ride_interface_1.Status.REJECTED) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "No driver available for this area");
    }
    return ride;
});
const getMyRides = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (decodedToken.role === user_interface_1.Role.USER) {
        filter = { user: decodedToken.userId };
    }
    if (decodedToken.role === user_interface_1.Role.DRIVER) {
        const driver = yield driver_model_1.Driver.findOne({ user: decodedToken.userId });
        if (!driver) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
        }
        filter = { driver: driver._id };
    }
    const rides = yield ride_model_1.Ride.find(filter);
    if (!rides || rides.length === 0) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Rides not found");
    }
    return rides;
});
const getSingleRide = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId).populate("driver").populate("user", "-password");
    if (!ride) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    return ride;
});
const getAllRides = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const allRiders = queryBuilder.search(ride_constant_1.rideSearchableFields).filter().sort().paginate().fields();
    const [data, meta] = yield Promise.all([
        allRiders.build().populate("user", "-password").populate("driver"),
        queryBuilder.getMeta()
    ]);
    return {
        data, meta
    };
});
exports.rideServices = {
    findRide,
    rideStatusUpdate,
    paymentStatusUpdate,
    getAllRides,
    getMyRides,
    getSingleRide
};
