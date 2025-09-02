import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import http from "http-status-codes"
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../modules/user/user.interface";
export const checkAuth=(...authRoles:string[])=>async (req:Request,res:Response,next:NextFunction) => {
  try{
const token=req.headers.authorization
if(!token){
    throw new AppError(http.NOT_FOUND,"Token is not found")
}
const verifiedToken=verifyToken(token,envVars.JWT.JWT_SECRET) as JwtPayload
const isUserExist=await User.findOne({email:verifiedToken.email})
if(!isUserExist){
        throw new AppError(http.NOT_FOUND,"User  not found")
}
if(!isUserExist.isVerified){
   throw new AppError(http.BAD_REQUEST,"User  email is not verified")
}
if(isUserExist?.isActive===IsActive.BLOCKED||isUserExist?.isActive===IsActive.INACTIVE){
  throw new AppError(http.BAD_REQUEST,`User is ${isUserExist.isActive}`)
}
if(isUserExist?.isDeleted){
    throw new AppError(http.BAD_REQUEST,"User is deleted")
}
if(!authRoles.includes(verifiedToken.role)){
    throw new AppError(http.FORBIDDEN,"You are not permitted in this route")
}
req.user=verifiedToken
next()
  } 
  catch(error) {
    next(error)
  }
}