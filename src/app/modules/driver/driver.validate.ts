import z from "zod";
import { Availability, DriverStatus, VehicleTypes } from "./driver.interface";
import { geoLocationZodSchema } from "../ride/ride.validate";

export const applyDriverZodSchema= z.object({
    user:z.string({error:"user must be a string"}),
    vehicleDetails:z.object({
 vehicleType:z.enum([...Object.values(VehicleTypes)]),
model:z.string({error:"model must be a string"}),
plate:z.string({error:"model must be a string"}) 
}),
licenseNumber:z.string({error:"licenseNumber must be a string"}).min(10,{error:"license number should be 11 length format"}).max(10,{error:"license number should be 11 length format"}) , 
location:geoLocationZodSchema
})

export const updateDriverStatusZodSchema= z.object({
driverStatus:z.enum([...Object.values(DriverStatus)])
})

export const updateDriverZodSchema=z.object({
   vehicleDetails:z.object({
 vehicleType:z.enum([...Object.values(VehicleTypes)]).optional(),
model:z.string({error:"model must be a string"}).optional(),
plate:z.string({error:"model must be a string"}),
}).optional(),
licenseNumber:z.string({error:"licenseNumber must be a string"}).min(10,{error:"license number should be 11 length format"}).max(10,{error:"license number should be 11 length format"}).optional() ,
availability:z.enum([...Object.values(Availability)]).optional() 
})
