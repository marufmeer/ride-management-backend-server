import z from "zod";
import { PAYMENT, PAYMENT_METHOD, Status } from "./ride.interface";
export const geoLocationZodSchema=z.object({
type:z.literal("Point"),
coordinates:z.tuple([z.number(),z.number()])
.refine(([lng])=>lng >= -180 && lng <= 180 ,{
     message: "Longitude must be between -180 and 180",
    path: ["coordinates",0],
})
.refine(([lat])=>lat >= -90 && lat <= 90 ,{
     message: "Latitude must be between -90 and 90",
    path: ["coordinates",1],
})
})
export const reqRideZodSchema = z.object({
  user: z.string({error:"user must be a string"}), 
  pickupLocation: geoLocationZodSchema,
  dropoffLocation: geoLocationZodSchema,
  paymentMethod: z.enum([...Object.values(PAYMENT_METHOD)]),
});
 
export const updateRideStatusZodSchema = z.object({
  status:z.enum([...Object.values(Status)]),
});
export const updatePaymentStatusZodSchema = z.object({
paymentStatus:z.enum([...Object.values(PAYMENT)])
});