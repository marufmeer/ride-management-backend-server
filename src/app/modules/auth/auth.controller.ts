import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/appError";
import http from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { authServices } from "./auth.service";
import { envVars } from "../../config/env";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { JwtPayload } from "jsonwebtoken";

const credintialsLogin=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  passport.authenticate("local",async(err:any,user:any,info:any)=>{
if(err){
    return next(new AppError(http.BAD_REQUEST,err))
}
if(!user){
     return next(new AppError(http.BAD_REQUEST,info.message))
}
const tokenInfo=createUserToken(user)
const userObject=user.toObject()
delete userObject.password
setAuthCookie(res,tokenInfo)
sendResponse(res,{
   success:true,
   statusCode:http.OK,
   message:"User login sucsessfully",
   data:{
    accessToken:tokenInfo.accessToken,
    refreshToken:tokenInfo.refreshToken,
    user:userObject
},
   
})
  })(req,res,next)  
})
const     googleCallback=catchAsync(async(req:Request,res:Response)=>{
  let redirectTo=req.query.state?req.query.state as string : ""
  if(redirectTo.startsWith("/")){
    redirectTo=redirectTo.slice(1)
  }
  const user=req.user
  if(!user){
    throw new AppError(http.NOT_FOUND,"User not found")
  }
  const tokenInfo= createUserToken(user)
  setAuthCookie(res,tokenInfo)
 res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})
const changePassword=catchAsync(async(req:Request,res:Response)=>{
const {oldPassword,newPassword}=req.body
const decodeToken=req.user as JwtPayload
await authServices.changePassword(oldPassword,newPassword,decodeToken)
sendResponse(res,{
    success:true,
   statusCode:http.OK,
   message:"Password changed sucsessfully",
   data:null
})
})
const setPassword=catchAsync(async(req:Request,res:Response)=>{
const {password}=req.body
const decodeToken=req.user as JwtPayload 
await authServices.setPassword(password,decodeToken)
sendResponse(res,{
    success:true,
   statusCode:http.OK,
   message:"Password set sucsessfully",
   data:null
})
})
const forgotPassword=catchAsync(async(req:Request,res:Response)=>{
const {email}=req.body 
await authServices.forgotPassword(email)
sendResponse(res,{
    success:true,
   statusCode:http.OK,
   message:"Password reset link sent to your gmail",
   data:null
})

})
const  resetPassword=catchAsync(async(req:Request,res:Response)=>{
const payload=req.body
const decodeToken=req.user as JwtPayload 
await authServices.resetPassword(payload,decodeToken)
sendResponse(res,{
    success:true,
   statusCode:http.OK,
   message:"Password reset sucsessfully",
   data:null
})
})

const getRefreshToken=catchAsync(async(req:Request,res:Response)=>{
const refreshToken=req.cookies.refreshToken
const tokenInfo=await authServices.getRefreshToken(refreshToken)
setAuthCookie(res,tokenInfo)
sendResponse(res,{
    success:true,
   statusCode:http.CONTINUE,
   message:"New access token get sucsessfully",
   data:{
    newAccessToken:tokenInfo.accessToken,
} 
})
})

const logOut=catchAsync(async(req:Request,res:Response)=>{
 res.clearCookie("accessToken",{
  httpOnly:true,
  secure:false,
  sameSite:"none"
 })
 res.clearCookie("refreshToken",{
  httpOnly:true,
  secure:false,
  sameSite:"none"
 })
 sendResponse(res,{
    success:true,
   statusCode:http.CONTINUE,
   message:"User logged out successfully",
   data:null
})
})
export const authControllers={
    credintialsLogin,
    googleCallback,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    getRefreshToken,
    logOut
}