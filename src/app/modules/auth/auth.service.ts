import { JwtPayload } from "jsonwebtoken"
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/appError"
import http from "http-status-codes"
import bcrypt from "bcrypt"
import { envVars } from "../../config/env"
import { IAuthProvider, IsActive } from "../user/user.interface"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"
const changePassword=async(oldPassword:string,newPassword:string,decodeToken:JwtPayload)=>{
 const user=await User.findOne({email:decodeToken.email}) 
 if(!user){
    throw new AppError(http.NOT_FOUND,"User not found")
 }
 const isOldPasswordMatched=await bcrypt.compare(oldPassword,user?.password as string)
 if(!isOldPasswordMatched){
        throw new AppError(http.BAD_REQUEST,"User old password does not match")
 }
const typeOldPassword=await bcrypt.compare(newPassword,user?.password as string)
if(typeOldPassword){
   throw new AppError(http.BAD_REQUEST,"You are entered the old password")  
}
const hashedNewPassword=await bcrypt.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))
user.password=hashedNewPassword
await user.save()
}
const setPassword=async(password:string,decodeToken:JwtPayload)=>{
const user=await User.findOne({email:decodeToken.email})
if(!user){
      throw new AppError(http.NOT_FOUND,"User not found")
}
if(user.password){
     throw new AppError(http.BAD_REQUEST,"Password already set instead use change password")
}

const hashedPassword=await bcrypt.hash(password,Number(envVars.BCRYPT_SALT_ROUND))

const credintialProvider:IAuthProvider={
    provider:"credintials",
    providerId:user.email
}
const authcredintials=user.auths?.some(providerObj=>providerObj.provider==="credintials")
if(!authcredintials){
    user.auths=[...user.auths||[],credintialProvider]
}

user.password=hashedPassword

await user.save()
}
const forgotPassword=async(email:string)=>{
const user=await User.findOne({email:email})
if(!user){
      throw new AppError(http.NOT_FOUND,"User not found")
}
if(!user.isVerified){
  throw new AppError(http.BAD_REQUEST,"User is not verified")
}
if(user.isActive===IsActive.BLOCKED || user.isActive===IsActive.INACTIVE){
  throw new AppError(http.BAD_REQUEST,`User is ${user.isActive}`)
}
if(user.isDeleted){
  throw new AppError(http.BAD_REQUEST,`User is deleted`)
}
const payload={
    userId:user._id,
    email:user.email,
    role:user.role
}
const resetToken=jwt.sign(payload,envVars.JWT.JWT_SECRET,{
    expiresIn:"10m"
})
const resetUILink=`${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`
await sendEmail({
    to:user.email,
    subject:"Forgot password",
    templateName:"forgotPassword",
    templateData:{
        name:user.name,
        resetUILink
    }
})
}
const resetPassword=async(payload:Record<string,any>,decodeToken:JwtPayload)=>{
if(payload.id!==decodeToken.userId){
  throw new AppError(http.BAD_REQUEST,`User can't reset his password `)
}
const user= await User.findById(decodeToken.userId)
if(!user){
      throw new AppError(http.NOT_FOUND,"User not found")
}
const hashedPassword=await bcrypt.hash(payload.newPassword,Number(envVars.BCRYPT_SALT_ROUND))
user.password=hashedPassword
await user.save()
}
const getRefreshToken=async(refreshToken:string)=>{
const newAccessToken=await createNewAccessTokenWithRefreshToken(refreshToken)
return{
   accessToken:newAccessToken
}
}

export const authServices={
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    getRefreshToken,
  
}