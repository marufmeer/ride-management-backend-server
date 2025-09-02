import AppError from "../../errorHelpers/appError"
import { IAuthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"
import http from "http-status-codes"
import bcrypt from "bcrypt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { QueryBuilder } from "../../utils/queryBuilder"
import { userSearchableFields } from "./user.constant"
const createUser=async(payload:IUser)=>{
  const isUserExist=await User.findOne({email:payload.email})  
  if(isUserExist){
    throw new AppError(http.CONFLICT,"This email is already registered")
  }
  if(!payload.password){
        throw new AppError(http.BAD_REQUEST,"Password is required")
  }
  const {name,email,password,...rest}=payload
  const hasedPassword=await bcrypt.hash(password,Number(envVars.BCRYPT_SALT_ROUND))
  const authProvider:IAuthProvider={
  providerId:email as string,
  provider:"credintials"
  }
const newPayload:IUser={
name,
email,
password:hasedPassword,
auths:[authProvider],
...rest
}
 await User.create(newPayload)
}


const getMe=async(decodedToken:JwtPayload)=>{

const isUserExist=await User.findOne({email:decodedToken.email}).populate("driver")
if(!isUserExist){
  throw new AppError(http.NOT_FOUND,"User not found")
}
if(!isUserExist.isVerified){
    throw new AppError(http.BAD_REQUEST,"User email is not verified")
}
const user=isUserExist.toObject()
delete user.password
return user
}

const getAllUsers=async(query:Record<string,string>)=>{
const queryBuilder=new QueryBuilder(User.find(),query)
const users=queryBuilder.search(userSearchableFields).filter().sort().paginate().fields()
const [data,meta]=await Promise.all([
  users.build(),
  queryBuilder.getMeta()
])
const newData=data.map(user=>{
  const userObj=user.toObject()
  delete userObj.password
  return userObj
})

return{
  newData,meta
}
}
const getOneUser=async(userId:string)=>{
const isUserExist=await User.findById(userId).select("-password")
if(!isUserExist){
   throw new AppError(http.NOT_FOUND,"User not found")
}
return isUserExist
}
const updateOneUser=async(userId:string,decodedToken:JwtPayload,payload:Partial<IUser>)=>{
  if(decodedToken.role===Role.USER || decodedToken.role===Role.DRIVER){
    if(decodedToken.userId!==userId){
      throw new AppError(http.FORBIDDEN,"You are not authorized")
    }
  }
const isUserExist=await User.findById(userId)
if(!isUserExist){
  throw new AppError(http.NOT_FOUND,"User not found")
}

if(decodedToken.role===Role.ADMIN&&payload.role===Role.SUPER_ADMIN){
  throw new AppError(http.FORBIDDEN,"You are not permitted to give super admin role")
}
if(decodedToken.role===Role.ADMIN&&payload.role===Role.ADMIN){
  throw new AppError(http.FORBIDDEN,"Only super admin can create a role admin")
}
if(payload.role){
 if(decodedToken.role===Role.USER||decodedToken.role===Role.DRIVER){
   throw new AppError(http.FORBIDDEN,"You are not authorized")
  }
}
if(payload.isActive||payload.isVerified || payload.isDeleted){
  if(decodedToken.role===Role.USER||decodedToken.role===Role.DRIVER){
    throw new AppError(http.FORBIDDEN,"You are not authorized")
  }
}
await User.findByIdAndUpdate(userId,payload,{runValidators:true,new:true})
}


 
export const userServices={
createUser,
getMe,

getAllUsers,
getOneUser,
updateOneUser
}