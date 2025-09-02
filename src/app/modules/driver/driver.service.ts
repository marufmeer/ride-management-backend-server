import { JwtPayload } from "jsonwebtoken"
import { DriverStatus, IDriver } from "./driver.interface"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/appError"
import http from "http-status-codes"
import { Driver } from "./driver.model"
import { Role } from "../user/user.interface"
import { QueryBuilder } from "../../utils/queryBuilder"
import { searcableDriverFields } from "./driver.constant"

const applyForDriver=async(payload:IDriver,decodedToken:JwtPayload)=>{
    if(payload.user!== decodedToken.userId){   
    throw new AppError(http.NOT_FOUND,"User id does not match")
    }
   const user=await User.findOne({email:decodedToken.email}) 
   if(!user){
    throw new AppError(http.NOT_FOUND,"You have to be login first then apply for driver")
   }
   if(!user.phone){
       throw new AppError(http.BAD_REQUEST,"Please provide a  phone number to apply for a guide")  
   }
   const isDriverApply=await Driver.findOne({user:payload.user})
if(isDriverApply?.driverStatus===DriverStatus.SUSPEND){
  throw new AppError(http.BAD_REQUEST,"You are suspended.please contact with support team")  
   }
    if(isDriverApply){
       throw new AppError(http.BAD_REQUEST,"This user application is in pending")  
   }
   
 const createDriverApply=await Driver.create(payload)  
 return createDriverApply
}
const  approveDriverStatus=async(payload:Partial<IDriver>,driverId:string)=>{
 
  const session=await Driver.startSession()
   session.startTransaction()

   try{
const driver= await Driver.findById(driverId)
if(!driver){
     throw new AppError(http.NOT_FOUND,"driver application not found")
}
if(driver.driverStatus===DriverStatus.APPROVED||driver.driverStatus===DriverStatus.REJECTED||driver.driverStatus===DriverStatus.SUSPEND){
       throw new AppError(http.CONFLICT,`Your application already has been ${driver.driverStatus}`)
}
const updatedDriverStatus=await Driver.findByIdAndUpdate(driverId,payload,{
  runValidators:true,new:true,session
})
if(updatedDriverStatus?.driverStatus===DriverStatus.APPROVED){
 await User.findOneAndUpdate(driver.user,{
  role:Role.DRIVER,
  driver:driver._id
 },{runValidators:true,new:true,session}) 
}
await session.commitTransaction()
session.endSession()
   }
catch(error:any){
  await session.abortTransaction()
  session.endSession()
  throw error
}
}


const updateOneDriver=async(driverId:string,payload:Partial<IDriver>)=>{
const driver= await Driver.findById(driverId)
if(!driver){
     throw new AppError(http.NOT_FOUND,"driver application not found")
}
const user=await User.findById(driver.user)
if (!user) {
    throw new AppError(http.NOT_FOUND, "Associated user not found");
  }
if(("driverStatus" in payload||"driverRating" in payload||"earnings" in payload)&&(user?.role===Role.DRIVER||user?.role===Role.USER)){
   throw new AppError(http.FORBIDDEN,"you are not permitted to this route")
}

await Driver.findByIdAndUpdate(driverId,payload,{
  runValidators:true,new:true
})
}
const getAllDrivers=async(query:Record<string,any>)=>{
const queryBuilder=new QueryBuilder(Driver.find(),query)
const drivers=queryBuilder.search(searcableDriverFields).filter().sort().paginate().fields()
const [data,meta]=await Promise.all([
  drivers.build().populate("user","-password"),
  queryBuilder.getMeta()
])
return {
  data,
  meta
}
}
const getOneDriver=async(driverId:string)=>{
 
const driver=await Driver.findById(driverId).populate("user","-password")
if(!driver){
  throw new AppError(http.NOT_FOUND,"Driver not found")
}
return driver
}




export const driverServices={
    applyForDriver,
approveDriverStatus,
    updateOneDriver,
    getAllDrivers,
    getOneDriver
}
