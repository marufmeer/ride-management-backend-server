import { Types } from "mongoose";

export enum Availability {
  ONLINE="ONLINE",
  OFFLINE="OFFLINE"
}

export enum DriverStatus {
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED",
  SUSPEND="SUSPEND"
}
export enum VehicleTypes{
CAR="CAR",
BIKE="BIKE"
}
export interface IGeolocation{
    type:"Point",
    coordinates:[number,number]
}
export interface IVehicle{
 vehicleType:VehicleTypes
    model: string
    plate: string
    images?:[string]
}

export interface IDriver {
  user: Types.ObjectId
  vehicleDetails:IVehicle 
  licenseNumber:string
  availability:Availability
  location:IGeolocation
  driverStatus:DriverStatus
  driverRating:number
  earnings:number
}