import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { driverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status-codes"

const applyForDriver=catchAsync(async(req:Request,res:Response)=>{
   const payload=req.body 
   const decodedToken=req.user as JwtPayload
   const result=await driverServices.applyForDriver(payload,decodedToken)
   sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"User apply for a driver sucsessfully",
    data:result
   }) 
})
const approveDriverStatus=catchAsync(async(req:Request,res:Response)=>{
    const driverId=req.params.id
const payload=req.body
await driverServices.approveDriverStatus(payload,driverId)
 sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"User sucsessfully approved as a driver",
    data:null
   }) 
})
const updateOneDriver=catchAsync(async(req:Request,res:Response)=>{
const driverId=req.params.id
const payload=req.body 
await driverServices.updateOneDriver(driverId,payload)
sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"Driver profile update sucsessfully",
    data:null
   }) 
})


const getOneDriver=catchAsync(async(req:Request,res:Response)=>{
const driverId=req.params.id 
const result=await driverServices.getOneDriver(driverId)
sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"Single driver retrive successfully",
    data:result
   }) 
})
const getAllDrivers=catchAsync(async(req:Request,res:Response)=>{
const query=req.query as Record<string,any>
const result=await driverServices.getAllDrivers(query)
sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"All drivers retrive sucsessfully",
    data:result.data,
    meta:result.meta
   }) 
})

export const driverControllers={
    applyForDriver,
    approveDriverStatus,
    updateOneDriver,
    getAllDrivers,
    getOneDriver
}
