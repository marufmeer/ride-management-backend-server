"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDurationInMinutes = void 0;
const getDurationInMinutes = (distanceKm, avgSpeedKmh = 40) => {
    return Math.ceil((distanceKm / avgSpeedKmh) * 60);
};
exports.getDurationInMinutes = getDurationInMinutes;
