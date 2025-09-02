import z from "zod";

export const setpasswordZodSchema=z.object({
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
})
export const changePasswordZodSchema=z.object({
  oldPassword:z.string({error:"password must be string"}),
    newPassword: z.string({error:"password must be string"}).min(8,{message:"Password must be at least 8 characters long"}).max(100,{message:"Password must be at most 100 characters long"})
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
})
export const resetPasswordZodSchema=z.object({
  id:z.string({error:"id must be string"}),
 newPassword: z.string({error:"password must be string"}).min(8,{message:"Password must be at least 8 characters long"}).max(100,{message:"Password must be at most 100 characters long"})
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
})