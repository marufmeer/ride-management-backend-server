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
exports.driverControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const applyForDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const result = yield driver_service_1.driverServices.applyForDriver(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User apply for a driver sucsessfully",
        data: result
    });
}));
const approveDriverStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const payload = req.body;
    yield driver_service_1.driverServices.approveDriverStatus(payload, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User sucsessfully approved as a driver",
        data: null
    });
}));
const updateOneDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const payload = req.body;
    yield driver_service_1.driverServices.updateOneDriver(driverId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver profile update sucsessfully",
        data: null
    });
}));
const getOneDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.driverServices.getOneDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Single driver retrive successfully",
        data: result
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.driverServices.getAllDrivers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All drivers retrive sucsessfully",
        data: result.data,
        meta: result.meta
    });
}));
exports.driverControllers = {
    applyForDriver,
    approveDriverStatus,
    updateOneDriver,
    getAllDrivers,
    getOneDriver
};
