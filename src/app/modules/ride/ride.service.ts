import { JwtPayload } from "jsonwebtoken"
import { allowedDriverTransitions, IRide, PAYMENT, Status } from "./ride.interface"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/appError"
import http from "http-status-codes"
import { getDistanceInKm } from "../../utils/getDistanceInKm"
import { getDurationInMinutes } from "../../utils/getDurationInMin"
import { getCalculateEstimatedFare } from "../../utils/getCalculateEstimatedFare"
import { Ride } from "./ride.model"
import { Driver } from "../driver/driver.model"
import { Availability, DriverStatus } from "../driver/driver.interface"
import { Role } from "../user/user.interface"
import mongoose from "mongoose"
import {startOfDay,endOfDay} from "date-fns"
import { QueryBuilder } from "../../utils/queryBuilder"
import { rideSearchableFields } from "./ride.constant"
const findRide=async(payload:IRide,decodedToken:JwtPayload)=>{
const user=await User.findById(decodedToken.userId)
if(!user){
    throw new AppError(http.BAD_REQUEST,"User not found")
}
const today=new Date()
const cancelledRides=await Ride.find({
   user:decodedToken.userId,
   status:Status.CANCELLED,
   createdAt:{
      $gte:startOfDay(today),
      $lte:endOfDay(today)
   }
})
if( cancelledRides.length>10){
  throw new AppError(
    http.BAD_REQUEST,
    "You cancelled 10 rides today and can't request another ride until tomorrow"
  );
}
const lon1=payload.pickupLocation.coordinates[0]
const lat1=payload.pickupLocation.coordinates[1]
const lon2=payload.dropoffLocation.coordinates[0]
const lat2=payload.dropoffLocation.coordinates[1]
const distance=getDistanceInKm(lon1,lat1,lon2,lat2)
const durationInMin=getDurationInMinutes(distance)
const totalFare=getCalculateEstimatedFare(distance,durationInMin)
const newPayload:IRide={
 ...payload,
   distance:distance,
   duration:durationInMin,
   estimatedFare:totalFare,
   paymentStatus:PAYMENT.UNPAID,
   requestedAt:new Date(),
   status:Status.REQUESTED
}
const nearByDriverFind=await Driver.find({
   availability:Availability.ONLINE,
   driverStatus:DriverStatus.APPROVED,
   location:{
      $near:{
         $geometry:payload.pickupLocation,
         $maxDistance:5000
      }
   }
}).limit(5)
if(!nearByDriverFind.length){
throw new AppError(http.NOT_FOUND,"No nearbydrivers found")
}
const candidateDrivers=nearByDriverFind.map(d=>d._id)
let assignedDriver=null
for(const driver of nearByDriverFind){
   const activeRide=await Ride.findOne({driver:driver._id,status:{$in:[Status.ACCEPTED,Status.PICKED_UP,Status.IN_TRANSIT]}})
   if(!activeRide){
     assignedDriver=driver._id 
     break; 
   } 
}
if(!assignedDriver){
    throw new AppError(http.BAD_REQUEST, "All nearby drivers are busy");
}
newPayload.driver=assignedDriver._id
newPayload.candidateDrivers=candidateDrivers
const ride=await Ride.create(newPayload)
return ride  
}

const paymentStatusUpdate=async(rideId:string,paymentStatus:PAYMENT,decodedToken:JwtPayload)=>{
   const session=await mongoose.startSession()
   session.startTransaction()
   try{
const ride=await Ride.findById(rideId)
if(!ride){
   throw new AppError(http.NOT_FOUND,"Ride is not found")
}
const driver=await Driver.findById(ride.driver)
if(!driver){
   throw new AppError(http.NOT_FOUND,"Driver is not found")
}
if(driver.user.toString()!==decodedToken.userId){
     throw new AppError(http.BAD_REQUEST,"User id does not match") 
}
if(ride.status!==Status.COMPLETED){
        throw new AppError(http.BAD_REQUEST,"First complete the ride please") 
}
ride.paymentStatus=paymentStatus
await ride.save({session})
if(ride.paymentStatus===PAYMENT.PAID){

await Driver.updateOne({_id:ride.driver},{
   $inc:{earnings:ride.estimatedFare}
},{session})
}
await session.commitTransaction()
session.endSession()
return ride
   }
catch(error){
   await session.abortTransaction();
   session.endSession()
   throw error
}
}
const rideStatusUpdate=async(rideId:string,status:Status,decodedToken:JwtPayload)=>{
    const ride=await Ride.findById(rideId)
    if(!ride){
      throw new AppError(http.NOT_FOUND,"Ride not found")
    }
      if(ride.status===Status.COMPLETED){
         throw new AppError(http.CONFLICT,"Ride is already completed")    
      }
 const user=await User.findById(decodedToken.userId)
 if(!user){
        throw new AppError(http.NOT_FOUND,"User not found")
 }
if(user.role===Role.USER){
   if(ride.user.toString()!==decodedToken.userId){
        throw new AppError(http.FORBIDDEN, "You are not the owner of this ride");
   }

if(status!==Status.CANCELLED){
      throw new AppError(http.FORBIDDEN,    "Users can only cancel their own ride")
}
}
if(user.role===Role.DRIVER){
   const findDriver=await Driver.findById(ride.driver)
if(!findDriver){
       throw new AppError(http.NOT_FOUND,"Driver not found")
}

   if(findDriver.user.toString()!==decodedToken.userId){
        throw new AppError(http.FORBIDDEN, "You are not assigned to this ride");
   }
if(status===Status.REQUESTED||status===Status.CANCELLED){
      throw new AppError(http.FORBIDDEN,"Driver cannot set ride to requested/cancelled")
}

}

if(!allowedDriverTransitions[ride.status].includes(status)){
throw new AppError(http.FORBIDDEN,
    `Cannot change ride status from ${ride.status} to ${status}`
  )
}
switch(status){
   case Status.CANCELLED:
   ride.status= Status.CANCELLED;
   ride.cancelledAt=new Date();
   break;
   case Status.REJECTED:
   ride.status= Status.REJECTED;
   ride.rejectedAt=new Date();
ride.candidateDrivers=ride.candidateDrivers.filter(id=>id.toString()!==ride.driver?.toString())
   if(ride.candidateDrivers.length>0){
      ride.driver=ride.candidateDrivers[0]
      ride.status=Status.REQUESTED
   }
   else{
      ride.status=Status.REJECTED
    ride.driver=null 
   }
  
   break;
   case Status.ACCEPTED:
   ride.status= Status.ACCEPTED;
   ride.acceptedAt=new Date();   ride.candidateDrivers=ride.candidateDrivers.filter(d=>d._id.toString()===ride.driver?.toString())
   break;
   case Status.IN_TRANSIT:
   ride.status= Status.IN_TRANSIT;
   break;
   case Status.PICKED_UP:
   ride.status= Status.PICKED_UP;
   ride.startTime=new Date();
   break;
   case Status.COMPLETED:
   ride.status= Status.COMPLETED;
   ride.endTime=new Date();
   break;
   default:
      throw new AppError(http.BAD_REQUEST, "Invalid status transition")
}
await ride.save()
if(ride.status===Status.REJECTED){
   throw new AppError(http.NOT_FOUND,"No driver available for this area")
}
return ride
}
const getMyRides=async(decodedToken:JwtPayload)=>{
let filter:Record<string,any>={}
if(decodedToken.role===Role.USER){
  filter={user:decodedToken.userId}
}
if(decodedToken.role===Role.DRIVER){
   const driver=await Driver.findOne({user:decodedToken.userId})
   if(!driver){
      throw new AppError(http.NOT_FOUND,"Driver not found")

   }
   filter={driver:driver._id}
}
const rides=await Ride.find(filter)
if(!rides||rides.length===0){
     throw new AppError(http.NOT_FOUND,"Rides not found") 
}
return rides
}
const getSingleRide=async(rideId:string)=>{
 const ride=await Ride.findById(rideId).populate("driver").populate("user","-password")
if(!ride){
  throw new AppError(http.NOT_FOUND,"Ride not found")
}
return ride
}
 

const getAllRides=async(query:Record<string,string>)=>{
const queryBuilder=new QueryBuilder(Ride.find(),query)
const allRiders=queryBuilder.search(rideSearchableFields).filter().sort().paginate().fields()
const [data,meta]=await Promise.all([
   allRiders.build().populate("user","-password").populate("driver"),
   queryBuilder.getMeta()
])
return {
   data,meta
}
}



export const rideServices={
   findRide,
  rideStatusUpdate,
 paymentStatusUpdate,
   getAllRides,
   getMyRides,
   getSingleRide
}