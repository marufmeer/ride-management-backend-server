import {  Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { IUser } from "./user.interface"
import { userServices } from "./user.service"
import { sendResponse } from "../../utils/sendResponse"
import http from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
const createUser=catchAsync(async(req:Request,res:Response)=>{
const payload:IUser=req.body
await userServices.createUser(payload)
sendResponse(res,{
  success:true,
  statusCode:http.CREATED,
  message:"User created sucsessfully."  ,
  data:null
})
})

const getMe=catchAsync(async(req:Request,res:Response)=>{
const decodedToken=req.user as JwtPayload 
const result=await userServices.getMe(decodedToken)
sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"User retrive sucsessfully",
  data:result
})
})

const getAllUsers=catchAsync(async(req:Request,res:Response)=>{
const query=req.query as Record<string,string>
const result=await userServices.getAllUsers(query)
sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"All user retrive sucsessfully",
  data:result.newData,
  meta:result.meta
})
})
const getOneUser=catchAsync(async(req:Request,res:Response)=>{
  const userId=req.params.id
  const result=await userServices.getOneUser(userId)
  sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"Single user retrive sucsessfully",
  data:result,
})
})
const updateOneUser=catchAsync(async(req:Request,res:Response)=>{
  const userId=req.params.id 
  const decodedToken=req.user as JwtPayload
  const payload=req.body
 await userServices.updateOneUser(userId,decodedToken,payload)
  sendResponse(res,{
  success:true,
  statusCode:http.OK,
  message:"sucsessfully update ypur profile",
  data:null
})
})
export const userControllers={
createUser,
getMe,

getAllUsers,
getOneUser,
updateOneUser
}