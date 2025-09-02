"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTypes = exports.DriverStatus = exports.Availability = void 0;
var Availability;
(function (Availability) {
    Availability["ONLINE"] = "ONLINE";
    Availability["OFFLINE"] = "OFFLINE";
})(Availability || (exports.Availability = Availability = {}));
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["PENDING"] = "PENDING";
    DriverStatus["APPROVED"] = "APPROVED";
    DriverStatus["REJECTED"] = "REJECTED";
    DriverStatus["SUSPEND"] = "SUSPEND";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var VehicleTypes;
(function (VehicleTypes) {
    VehicleTypes["CAR"] = "CAR";
    VehicleTypes["BIKE"] = "BIKE";
})(VehicleTypes || (exports.VehicleTypes = VehicleTypes = {}));
