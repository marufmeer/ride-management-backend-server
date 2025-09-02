import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";


const getRideStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getRideStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: stats,
    });
});



const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

const getDriverStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getDriverStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
});

export const StatsController = {
    getRideStats,
   getDriverStats,
    getUserStats,

}