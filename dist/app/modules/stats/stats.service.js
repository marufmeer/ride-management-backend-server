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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const driver_interface_1 = require("../driver/driver.interface");
const driver_model_1 = require("../driver/driver.model");
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getRideStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalRidePromise = ride_model_1.Ride.countDocuments();
    const totalRideByStatusPromise = ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: "$status",
                rideCount: { $sum: 1 }
            }
        }
    ]);
    const RidesLast7DaysPromise = ride_model_1.Ride.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const RidesLast30DaysPromise = ride_model_1.Ride.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const totalRideByUniqueUserPromise = ride_model_1.Ride.distinct("user").then((user) => user.length);
    const totalRideByUniqueDriverPromise = ride_model_1.Ride.distinct("driver").then((driver) => driver.length);
    const filter = {
        $match: {
            status: ride_interface_1.Status.COMPLETED
        }
    };
    const totalRideByOneUserPromise = ride_model_1.Ride.aggregate([
        filter,
        {
            $group: {
                _id: "$user",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRideByOneDriverPromise = ride_model_1.Ride.aggregate([
        filter,
        {
            $group: {
                _id: "$driver",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenewPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                paymentStatus: ride_interface_1.PAYMENT.PAID
            }
        },
        {
            $group: {
                _id: "null",
                totalRevenew: { $sum: "$estimatedFare" }
            }
        }
    ]);
    const avgPaymentAmountPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                paymentStatus: ride_interface_1.PAYMENT.PAID
            }
        },
        {
            $group: {
                _id: "null",
                avgPaymentAmount: { $avg: "$estimatedFare" }
            }
        }
    ]);
    const totalEarningsByEachDriversPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                paymentStatus: ride_interface_1.PAYMENT.PAID
            }
        },
        {
            $group: {
                _id: "$driver",
                totalEarnings: { $sum: "$estimatedFare" }
            }
        },
        {
            $lookup: {
                from: "drivers",
                localField: "_id",
                foreignField: "_id",
                as: "driver"
            }
        },
        {
            $unwind: "$driver"
        },
        {
            $lookup: {
                from: "users",
                localField: "driver.user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                totalEarnings: 1,
                driverName: "$user.name",
                userRole: "$user.role"
            }
        }
    ]);
    const [totalRide, totalRideByUniqueUser, totalRideByUniqueDriver, totalRideByStatus, totalRideByOneUser, totalRideByOneDriver, totalRevenew, totalEarningsByEachDrivers, avgPaymentAmount, RidesLast7Days, RidesLast30Days] = yield Promise.all([
        totalRidePromise, totalRideByUniqueUserPromise, totalRideByUniqueDriverPromise, totalRideByStatusPromise, totalRideByOneUserPromise, totalRideByOneDriverPromise, totalRevenewPromise, totalEarningsByEachDriversPromise, avgPaymentAmountPromise, RidesLast7DaysPromise, RidesLast30DaysPromise
    ]);
    return {
        totalRide, totalRideByUniqueUser, totalRideByUniqueDriver, totalRideByStatus, totalRideByOneUser, totalRideByOneDriver, totalRevenew, totalEarningsByEachDrivers, avgPaymentAmount, RidesLast7Days, RidesLast30Days
    };
});
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUserPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const usersByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = yield Promise.all([
        totalUserPromise, totalActiveUsersPromise, totalInActiveUsersPromise, totalBlockedUsersPromise, newUsersInLast7DaysPromise, newUsersInLast30DaysPromise, usersByRolePromise
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
});
const getDriverStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalDriverPromise = driver_model_1.Driver.countDocuments();
    const totalApprovedDriverPromise = driver_model_1.Driver.countDocuments({ driverStatus: driver_interface_1.DriverStatus.APPROVED });
    const totalPendingDriverPromise = driver_model_1.Driver.countDocuments({ driverStatus: driver_interface_1.DriverStatus.PENDING });
    const totalRejectDriverPromise = driver_model_1.Driver.countDocuments({ driverStatus: driver_interface_1.DriverStatus.REJECTED });
    const totalSuspendDriverPromise = driver_model_1.Driver.countDocuments({ driverStatus: driver_interface_1.DriverStatus.SUSPEND });
    const newDriversInLast7DaysPromise = driver_model_1.Driver.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newDriversInLast30DaysPromise = driver_model_1.Driver.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const [totalDriver, totalApprovedDriver, totalPendingDriver, totalRejectDriver, totalSuspendDriver, newDriversInLast7Days, newDriversInLast30Days] = yield Promise.all([
        totalDriverPromise, totalApprovedDriverPromise,
        totalPendingDriverPromise,
        totalRejectDriverPromise,
        totalSuspendDriverPromise,
        newDriversInLast7DaysPromise,
        newDriversInLast30DaysPromise
    ]);
    return {
        totalDriver, totalApprovedDriver,
        totalPendingDriver, totalRejectDriver, totalSuspendDriver, newDriversInLast7Days, newDriversInLast30Days
    };
});
exports.StatsService = {
    getRideStats,
    getUserStats,
    getDriverStats
};
