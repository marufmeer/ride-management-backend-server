import { envVars } from "../config/env"
import bcrypt from "bcrypt"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
export const seedSuperAdmin=async()=>{
    try{
const isSuperAdminExists=await User.findOne({email:envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL})
if(isSuperAdminExists){
   console.log("Super admin already exists")
   return;
}
const hashedPassword=await bcrypt.hash(envVars.SUPER_ADMIN.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND))
   const authProvider:IAuthProvider={
    provider:"credintials",
    providerId:envVars.SUPER_ADMIN.SUPER_ADMIN_PASSWORD
   }
const payload:IUser={
    name:"Super Admin",
    email:envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
    password:hashedPassword,
    role:Role.SUPER_ADMIN,
    isVerified:true,
    auths:[authProvider]
}
await User.create(payload)
console.log("Super admin created sucsessfully")
    }
catch(error){
    console.log(error)
}
}