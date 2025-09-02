"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = exports.driverSchema = exports.locationSchema = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const vehicleDetailsSchema = new mongoose_1.Schema({
    vehicleType: {
        type: String,
        required: true,
        enum: Object.values(driver_interface_1.VehicleTypes)
    },
    model: {
        type: String,
        required: true,
    },
    plate: {
        type: String,
        required: true,
    },
    images: {
        type: [String]
    }
}, {
    _id: false,
    versionKey: false
});
exports.locationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: [Number]
}, {
    versionKey: false,
    _id: false
});
exports.driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleDetails: vehicleDetailsSchema,
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    location: exports.locationSchema,
    availability: {
        type: String,
        enum: Object.values(driver_interface_1.Availability),
        default: driver_interface_1.Availability.ONLINE
    },
    driverStatus: {
        type: String,
        enum: Object.values(driver_interface_1.DriverStatus),
        default: driver_interface_1.DriverStatus.PENDING
    },
    driverRating: {
        type: Number
    },
    earnings: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.driverSchema.index({ location: "2dsphere" });
exports.Driver = (0, mongoose_1.model)("Driver", exports.driverSchema);
