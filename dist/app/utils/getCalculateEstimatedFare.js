"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalculateEstimatedFare = void 0;
const getCalculateEstimatedFare = (distance, durationMin, baseFare = 50, perKmRate = 10, perMinRate = 10) => {
    const totalFare = Math.ceil(baseFare + distance * perKmRate + durationMin * perMinRate);
    return totalFare;
};
exports.getCalculateEstimatedFare = getCalculateEstimatedFare;
