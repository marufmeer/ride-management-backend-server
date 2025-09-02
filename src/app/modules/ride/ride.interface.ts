import { Types } from "mongoose";
import { IGeolocation } from "../driver/driver.interface";

export enum PAYMENT_METHOD{
   CASH="CASH" 
}


export enum Status{
REQUESTED="REQUESTED",
CANCELLED="CANCELLED",
REJECTED="REJECTED",
ACCEPTED="ACCEPTED",
PICKED_UP="PICKED_UP",
IN_TRANSIT="IN_TRANSIT",
COMPLETED="COMPLETED",
}
export const allowedDriverTransitions:Record<Status,Status[]>={
  [Status.REQUESTED]:[Status.ACCEPTED,Status.REJECTED],
  [Status.ACCEPTED]: [Status.PICKED_UP, Status.IN_TRANSIT],
  [Status.PICKED_UP]: [Status.IN_TRANSIT, Status.COMPLETED],
  [Status.IN_TRANSIT]: [Status.COMPLETED],
  [Status.COMPLETED]: [],
  [Status.REJECTED]: [],
  [Status.CANCELLED]: [],
}
export enum PAYMENT{
    PAID="PAID",
    UNPAID="UNPAID"
}
type DriverT=Types.ObjectId | null
export interface IRide {
  user: Types.ObjectId;      
  driver?:DriverT;
  address:string,     
  pickupLocation: IGeolocation;
  dropoffLocation: IGeolocation;
  paymentMethod:PAYMENT_METHOD
  estimatedFare: number;
  paymentStatus:PAYMENT;
  distance: number;
  duration: number;
  requestedAt?:Date;
  cancelledAt?:Date;
  acceptedAt?:Date;
  rejectedAt?:Date;
  startTime?: Date;
  endTime?: Date;
  status: Status;
  candidateDrivers:Types.ObjectId[]
}