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
exports.driverServices = void 0;
const driver_interface_1 = require("./driver.interface");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const user_interface_1 = require("../user/user.interface");
const queryBuilder_1 = require("../../utils/queryBuilder");
const driver_constant_1 = require("./driver.constant");
const applyForDriver = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.user !== decodedToken.userId) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User id does not match");
    }
    const user = yield user_model_1.User.findOne({ email: decodedToken.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "You have to be login first then apply for driver");
    }
    if (!user.phone) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please provide a  phone number to apply for a guide");
    }
    const isDriverApply = yield driver_model_1.Driver.findOne({ user: payload.user });
    if ((isDriverApply === null || isDriverApply === void 0 ? void 0 : isDriverApply.driverStatus) === driver_interface_1.DriverStatus.SUSPEND) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are suspended.please contact with support team");
    }
    if (isDriverApply) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "This user application is in pending");
    }
    const createDriverApply = yield driver_model_1.Driver.create(payload);
    return createDriverApply;
});
const approveDriverStatus = (payload, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield driver_model_1.Driver.startSession();
    session.startTransaction();
    try {
        const driver = yield driver_model_1.Driver.findById(driverId);
        if (!driver) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "driver application not found");
        }
        if (driver.driverStatus === driver_interface_1.DriverStatus.APPROVED || driver.driverStatus === driver_interface_1.DriverStatus.REJECTED || driver.driverStatus === driver_interface_1.DriverStatus.SUSPEND) {
            throw new appError_1.default(http_status_codes_1.default.CONFLICT, `Your application already has been ${driver.driverStatus}`);
        }
        const updatedDriverStatus = yield driver_model_1.Driver.findByIdAndUpdate(driverId, payload, {
            runValidators: true, new: true, session
        });
        if ((updatedDriverStatus === null || updatedDriverStatus === void 0 ? void 0 : updatedDriverStatus.driverStatus) === driver_interface_1.DriverStatus.APPROVED) {
            yield user_model_1.User.findOneAndUpdate(driver.user, {
                role: user_interface_1.Role.DRIVER,
                driver: driver._id
            }, { runValidators: true, new: true, session });
        }
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateOneDriver = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "driver application not found");
    }
    const user = yield user_model_1.User.findById(driver.user);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Associated user not found");
    }
    if (("driverStatus" in payload || "driverRating" in payload || "earnings" in payload) && ((user === null || user === void 0 ? void 0 : user.role) === user_interface_1.Role.DRIVER || (user === null || user === void 0 ? void 0 : user.role) === user_interface_1.Role.USER)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not permitted to this route");
    }
    yield driver_model_1.Driver.findByIdAndUpdate(driverId, payload, {
        runValidators: true, new: true
    });
});
const getAllDrivers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const drivers = queryBuilder.search(driver_constant_1.searcableDriverFields).filter().sort().paginate().fields();
    const [data, meta] = yield Promise.all([
        drivers.build().populate("user", "-password"),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getOneDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId).populate("user", "-password");
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return driver;
});
exports.driverServices = {
    applyForDriver,
    approveDriverStatus,
    updateOneDriver,
    getAllDrivers,
    getOneDriver
};
