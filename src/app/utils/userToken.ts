import { JwtPayload } from "jsonwebtoken";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config/env";
import http from "http-status-codes"
import AppError from "../errorHelpers/appError";
import { User } from "../modules/user/user.model";


export const createUserToken=(user:Partial<IUser>)=>{
const jwtPayload={
    userId:user._id,
    email:user.email,
    role:user.role
}
const accessToken=generateToken(jwtPayload,envVars.JWT.JWT_SECRET,envVars.JWT.JWT_ACCESS_EXPIRES)
const refreshToken=generateToken(jwtPayload,envVars.JWT.JWT_REFRESH_SECRET,envVars.JWT.JWT_REFRESH_SECRET_EXPIRES)
return{
    accessToken,
    refreshToken
}
}

export const createNewAccessTokenWithRefreshToken=async(refreshToken:string)=>{
const verifiedToken=verifyToken(refreshToken,envVars.JWT.JWT_REFRESH_SECRET) as JwtPayload
if(!verifyToken){
    throw new AppError(http.BAD_REQUEST,"Refresh token is not valid")
}
const isUserExist=await User.findOne({email:verifiedToken.email})
if(!isUserExist){
    throw new AppError(http.BAD_REQUEST,"User not found")
}
if(!isUserExist?.isVerified){
   throw new AppError(http.BAD_REQUEST,"User is not verified")
}
if(isUserExist?.isActive===IsActive.BLOCKED||isUserExist?.isActive===IsActive.INACTIVE){
  throw new AppError(http.BAD_REQUEST,`User is ${isUserExist.isActive}`)
}
if(isUserExist?.isDeleted){
    throw new AppError(http.BAD_REQUEST,"User is deleted")
}
const jwtPayload={
    userId:isUserExist._id,
    email:isUserExist.email,
    role:isUserExist.role
}
const newAccessToken= generateToken(jwtPayload,envVars.JWT.JWT_SECRET,envVars.JWT.JWT_ACCESS_EXPIRES)
return newAccessToken
}