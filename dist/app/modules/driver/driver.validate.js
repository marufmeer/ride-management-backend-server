"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverZodSchema = exports.updateDriverStatusZodSchema = exports.applyDriverZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const driver_interface_1 = require("./driver.interface");
const ride_validate_1 = require("../ride/ride.validate");
exports.applyDriverZodSchema = zod_1.default.object({
    user: zod_1.default.string({ error: "user must be a string" }),
    vehicleDetails: zod_1.default.object({
        vehicleType: zod_1.default.enum([...Object.values(driver_interface_1.VehicleTypes)]),
        model: zod_1.default.string({ error: "model must be a string" }),
        plate: zod_1.default.string({ error: "model must be a string" })
    }),
    licenseNumber: zod_1.default.string({ error: "licenseNumber must be a string" }).min(10, { error: "license number should be 11 length format" }).max(10, { error: "license number should be 11 length format" }),
    location: ride_validate_1.geoLocationZodSchema
});
exports.updateDriverStatusZodSchema = zod_1.default.object({
    driverStatus: zod_1.default.enum([...Object.values(driver_interface_1.DriverStatus)])
});
exports.updateDriverZodSchema = zod_1.default.object({
    vehicleDetails: zod_1.default.object({
        vehicleType: zod_1.default.enum([...Object.values(driver_interface_1.VehicleTypes)]).optional(),
        model: zod_1.default.string({ error: "model must be a string" }).optional(),
        plate: zod_1.default.string({ error: "model must be a string" }),
    }).optional(),
    licenseNumber: zod_1.default.string({ error: "licenseNumber must be a string" }).min(10, { error: "license number should be 11 length format" }).max(10, { error: "license number should be 11 length format" }).optional(),
    availability: zod_1.default.enum([...Object.values(driver_interface_1.Availability)]).optional()
});
