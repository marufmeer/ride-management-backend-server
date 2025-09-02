"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusZodSchema = exports.updateRideStatusZodSchema = exports.reqRideZodSchema = exports.geoLocationZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("./ride.interface");
exports.geoLocationZodSchema = zod_1.default.object({
    type: zod_1.default.literal("Point"),
    coordinates: zod_1.default.tuple([zod_1.default.number(), zod_1.default.number()])
        .refine(([lng]) => lng >= -180 && lng <= 180, {
        message: "Longitude must be between -180 and 180",
        path: ["coordinates", 0],
    })
        .refine(([lat]) => lat >= -90 && lat <= 90, {
        message: "Latitude must be between -90 and 90",
        path: ["coordinates", 1],
    })
});
exports.reqRideZodSchema = zod_1.default.object({
    user: zod_1.default.string({ error: "user must be a string" }),
    pickupLocation: exports.geoLocationZodSchema,
    dropoffLocation: exports.geoLocationZodSchema,
    paymentMethod: zod_1.default.enum([...Object.values(ride_interface_1.PAYMENT_METHOD)]),
});
exports.updateRideStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum([...Object.values(ride_interface_1.Status)]),
});
exports.updatePaymentStatusZodSchema = zod_1.default.object({
    paymentStatus: zod_1.default.enum([...Object.values(ride_interface_1.PAYMENT)])
});
