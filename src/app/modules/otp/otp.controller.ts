import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { otpServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status-codes"

const otpSend=catchAsync(async(req:Request,res:Response)=>{
 const {email,name}=req.body
await otpServices.otpSend(email,name)
sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"Otp send sucsessfully to your gmail",
  data:null
})
})
const otpVerify=catchAsync(async(req:Request,res:Response)=>{
 const {email,otp}=req.body 
await otpServices.otpVerify(email,otp)
sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"User verified sucsessfully",
  data:null
})
})
const otpResend=catchAsync(async(req:Request,res:Response)=>{
 const {email,name}=req.body 
await otpServices.otpResend(email,name)
sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"Otp resend successfully",
  data:null
})
})

export const otpControllers={
    otpSend,
    otpVerify,
    otpResend
}