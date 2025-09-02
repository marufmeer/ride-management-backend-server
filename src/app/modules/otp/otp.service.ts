import { redisClient } from "../../config/redis.config"
import AppError from "../../errorHelpers/appError"
import { otpGenerate } from "../../utils/otpGenerate"
import { sendEmail } from "../../utils/sendEmail"
import { User } from "../user/user.model"
import http from "http-status-codes"
const otp_expiration=5*60
const otpSend=async(email:string,name:string)=>{
const isUserExist=await User.findOne({email:email})
if(!isUserExist){
    throw new AppError(http.NOT_FOUND,"User not found")
}
if(isUserExist.isVerified){
 throw new AppError(http.NOT_FOUND,"You already verified your email")
}
const otp=otpGenerate()
const redisKey=`otp:${email}`
await redisClient.set(redisKey,otp,{
    expiration:{
        type:"EX",
        value:otp_expiration
    }
})
await sendEmail({
    to:email,
    subject:"Your otp code",
    templateName:"otp",
    templateData:{
        name:name,
        otp:otp,
        expiry:otp_expiration
    }
})
}
const otpVerify=async(email:string,otp:string)=>{
const isUserExist=await User.findOne({email:email})
if(!isUserExist){
    throw new AppError(http.NOT_FOUND,"User not found")
}
if(isUserExist.isVerified){
     throw new AppError(http.CONFLICT,"User email is already verified")  
}
const redisKey=`otp:${email}`
const savedOtp=await redisClient.get(redisKey)
if(!savedOtp){
   throw new AppError(http.BAD_REQUEST,"Invalid otp")  
}
if(savedOtp!==otp){
   throw new AppError(http.BAD_REQUEST,"Invalid otp")  
}
await Promise.all([
 User.updateOne({email},{isVerified:true},{runValidators:true}),
 redisClient.del(redisKey)
])
}
const otpResend=async(email:string,name:string)=>{
const isUserExist=await User.findOne({email:email})
if(!isUserExist){
    throw new AppError(http.NOT_FOUND,"User not found")
}
if(isUserExist.isVerified){
 throw new AppError(http.NOT_FOUND,"You already verified your email")
}

const otp=otpGenerate()
const redisKey=`otp:${email}`
const oldOtp=await redisClient.get(redisKey)
if(oldOtp){
    await redisClient.del(redisKey)
}
await redisClient.set(redisKey,otp,{
    expiration:{
        type:"EX",
        value:otp_expiration
    }
})
await sendEmail({
    to:email,
    subject:"Your otp code",
    templateName:"otp",
    templateData:{
        name:name,
        otp:otp,
        expiry:otp_expiration
    }
})
}
export const otpServices={
    otpSend,
    otpVerify,
    otpResend
}