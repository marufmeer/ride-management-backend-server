"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const driver_model_1 = require("../driver/driver.model");
const RideSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        default: null
    },
    address: {
        type: String,
    },
    pickupLocation: {
        type: driver_model_1.locationSchema,
        required: true,
    },
    dropoffLocation: {
        type: driver_model_1.locationSchema,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(ride_interface_1.PAYMENT_METHOD),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(ride_interface_1.PAYMENT),
        default: ride_interface_1.PAYMENT.UNPAID,
        required: true,
    },
    estimatedFare: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    requestedAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },
    acceptedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.Status),
        default: ride_interface_1.Status.REQUESTED,
    },
    candidateDrivers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: []
    }
}, {
    timestamps: true,
});
RideSchema.index({ pickupLocation: "2dsphere" });
RideSchema.index({ dropoffLocation: "2dsphere" });
exports.Ride = (0, mongoose_1.model)("Ride", RideSchema);
