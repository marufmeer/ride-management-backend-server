import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { rideServices } from "./ride.service"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import http from "http-status-codes"
const findRide=catchAsync(async(req:Request,res:Response)=>{
  const payload=req.body
  const decodedToken=req.user as JwtPayload
 const result= await rideServices.findRide(payload,decodedToken)
 sendResponse(res,{
  success:true,
  statusCode:http.CREATED,
  message:"Ride request made successfully."  ,
  data:result
})
})
const paymentStatusUpdate=catchAsync(async(req:Request,res:Response)=>{
 const rideId=req.params.rideId 
 const {paymentStatus}=req.body
 const decodedToken=req.user as JwtPayload
const updatePaymentRequest=await rideServices.paymentStatusUpdate(rideId,paymentStatus,decodedToken)
sendResponse(res,{
  success:true,
  statusCode:http.CREATED,
  message:"Payment status updated successfully."  ,
  data:updatePaymentRequest
})
})
const rideStatusUpdate=catchAsync(async(req:Request,res:Response)=>{
 const rideId=req.params.rideId 
 const {status}=req.body
 const decodedToken=req.user as JwtPayload
const updateRideRequest=await rideServices.rideStatusUpdate(rideId,status,decodedToken)
sendResponse(res,{
  success:true,
  statusCode:http.CREATED,
  message:"Ride request update successfully."  ,
  data:updateRideRequest
})
})
const getMyRides=catchAsync(async(req:Request,res:Response)=>{
const decodedToken=req.user as JwtPayload
const result=await rideServices.getMyRides(decodedToken)
sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"My rides retrive successfully",
    data:result
   }) 

})
const getSingleRide=catchAsync(async(req:Request,res:Response)=>{
const rideId=req.params.id 
const result=await rideServices.getSingleRide(rideId)
sendResponse(res,{
    success:true,
    statusCode:http.OK,
    message:"Single ride retrive successfully",
    data:result
   }) 

})
const getAllRides=catchAsync(async(req:Request,res:Response)=>{
 const query=req.query as Record<string,string>
  const allRides=await rideServices.getAllRides(query)
sendResponse(res,{
  success:true,
  statusCode:http.CREATED,
  message:"All rides retrive successfully."  ,
  data:allRides.data,
  meta:allRides.meta
})
})



export const rideControllers={
   findRide,
   paymentStatusUpdate,
   rideStatusUpdate,
   getAllRides,
   getSingleRide,
   getMyRides
}
