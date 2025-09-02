import z from "zod"
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema=z.object({

name:z.string({error:"firstName must be string"}).min(2,{message:"Name must be at least 2 characters"}).max(50,{message:"Name must be at most 50 characters long"}),

email: z.string({error:"email must be string"}).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{
message:"Invalid email address format"
}),
phone:z.string({error:"number must be string"}).regex(/^(?:\+88|88)?01[3-9]\d{8}$/,{
    message:"Invalid number format"
}).optional(), 
password: z.string({error:"password must be string"}).min(8,{message:"Password must be at least 8 characters long"}).max(100,{message:"Password must be at most 100 characters long"})
.regex(/(?=.*[a-z])/,{
    message:"Password must contain at least one lowercase letter"
})
.regex(/(?=.*[A-Z])/,{
    message:"Password must contain at least one uppercase letter"
})
.regex(/(?=.*\d)/,{
    message:"Password must contain at least 1 number"
})
.regex(/(?=.*[@$!%*?&])/,{
    message:"Password must contain at least 1 special character"
})
,
address: z.string({error:"Address must be string"}).optional(),
})


export const updateUserZosSchema=z.object({
name:z.string({error:"firstName must be string"}).min(2,{message:"Name must be at least 2 characters"}).max(50,{message:"Name must be at most 50 characters long"}).optional(),
picture:z.string({error:"picture url must be type string"}).optional(),
role:z.enum(Object.values(Role) as [string]).optional(),
isDeleted: z.boolean().optional(),
isActive:z.enum(Object.values(IsActive) as [string]).optional(),
isVerified: z.boolean().optional(),
phone: z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/,{
    message:"Please enter a valid phone number"
}).optional(),
address: z.string().optional(),
})