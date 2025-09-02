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
exports.rideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ride_service_1 = require("./ride.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const findRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const result = yield ride_service_1.rideServices.findRide(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride request made successfully.",
        data: result
    });
}));
const paymentStatusUpdate = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.rideId;
    const { paymentStatus } = req.body;
    const decodedToken = req.user;
    const updatePaymentRequest = yield ride_service_1.rideServices.paymentStatusUpdate(rideId, paymentStatus, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment status updated successfully.",
        data: updatePaymentRequest
    });
}));
const rideStatusUpdate = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.rideId;
    const { status } = req.body;
    const decodedToken = req.user;
    const updateRideRequest = yield ride_service_1.rideServices.rideStatusUpdate(rideId, status, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride request update successfully.",
        data: updateRideRequest
    });
}));
const getMyRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield ride_service_1.rideServices.getMyRides(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My rides retrive successfully",
        data: result
    });
}));
const getSingleRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const result = yield ride_service_1.rideServices.getSingleRide(rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Single ride retrive successfully",
        data: result
    });
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allRides = yield ride_service_1.rideServices.getAllRides(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All rides retrive successfully.",
        data: allRides.data,
        meta: allRides.meta
    });
}));
exports.rideControllers = {
    findRide,
    paymentStatusUpdate,
    rideStatusUpdate,
    getAllRides,
    getSingleRide,
    getMyRides
};
