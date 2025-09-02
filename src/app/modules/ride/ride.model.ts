import  { model, Schema } from "mongoose";
import { IRide, PAYMENT, PAYMENT_METHOD, Status } from "./ride.interface";
import { locationSchema } from "../driver/driver.model";

const RideSchema = new Schema<IRide>(
  {
    user: {
      type:Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type:Schema.Types.ObjectId,
      ref: "Driver",
      default:null
},
 address:{
  type:String,
 },
    pickupLocation: {
      type:locationSchema,
      required: true,
    },
    dropoffLocation: {
      type: locationSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT),
      default:PAYMENT.UNPAID,
      required: true,
    },
    estimatedFare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
     requestedAt:{
  type: Date
     },
    cancelledAt: {
      type: Date

    },
    acceptedAt: {
      type: Date
    
    },
    rejectedAt: {
      type: Date

    },
    startTime: {
      type: Date
   },
    endTime: {
      type: Date

    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
    },
    candidateDrivers:{
      type:[Schema.Types.ObjectId],
      default:[]
    }
  },
  {
    timestamps: true, 
  }
);
RideSchema.index({pickupLocation:"2dsphere"})
RideSchema.index({dropoffLocation:"2dsphere"})
export const Ride = model<IRide>("Ride", RideSchema);