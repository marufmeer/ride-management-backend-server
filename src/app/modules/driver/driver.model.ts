import { model, Schema } from "mongoose";
import { Availability, DriverStatus, IDriver, IGeolocation, VehicleTypes } from "./driver.interface";



const vehicleDetailsSchema= new Schema({
vehicleType:{
    type:String,
    required:true,
    enum:Object.values(VehicleTypes)
 },
 model:{
    type:String,
    required:true,
 },
 plate:{
    type:String,
    required:true,
 },
  images:{
    type:[String]
  }
 
},{
    _id:false,
    versionKey:false
})
export const locationSchema=new Schema<IGeolocation>({
  type:{
    type:String,
    enum:["Point"],
    default:"Point"
  },
  coordinates:[Number]
},{
    versionKey:false,
    _id:false
})

export const driverSchema= new Schema({
  user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
vehicleDetails:vehicleDetailsSchema,
      licenseNumber:{
        type:String,
        required:true,
        unique:true
    },
    location:locationSchema,
      availability:{
        type:String,
      enum:Object.values(Availability),
       default:Availability.ONLINE
    },
      driverStatus:{
        type:String,
        enum:Object.values(DriverStatus),
       default:DriverStatus.PENDING
     },
      driverRating:{
        type:Number
    },
      earnings:{
        type:Number,
        default:0
    },
    
},{
  timestamps:true,
  versionKey:false
})
driverSchema.index({location:"2dsphere"})
export const Driver= model<IDriver>("Driver",driverSchema)