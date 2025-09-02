import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcrypt from "bcrypt"
import passport from "passport";
import { User } from "../modules/user/user.model";
import {  IsActive, Role } from "../modules/user/user.interface";
import { envVars } from "./env";


passport.use(new LocalStrategy(
    {
    usernameField:"email",
    passwordField:"password"
},
async(email:string,password:string,done)=>{
    try{
const isUserExist=await User.findOne({email})
if(!isUserExist){
   return done(null,false,{message:"User not found"})
}
if(!isUserExist?.isVerified){
    return done(null,false,{message:"User is not verified"})
}
if(isUserExist?.isActive===IsActive.BLOCKED||isUserExist?.isActive===IsActive.INACTIVE){
  return done(null,false,{message:`User is ${isUserExist.isActive}`})
}
if(isUserExist?.isDeleted){
  return done(null,false,{message:`User is deleted`})  
}
const isGoogleAuthenticated=isUserExist?.auths?.some(providerObj=>providerObj.provider==="google")
if(isGoogleAuthenticated&&!isUserExist?.password){
 return done(null,false,{message:`You email had been authenticated with google login.Please try  google login to continue `})     
}

const isPasswordMatch=await bcrypt.compare(password,isUserExist.password as string)
if(!isPasswordMatch){
   return done(null,false,{message:"Password does not match"})
}
return done(null,isUserExist)
    }
catch(error){
    done(error)
}
}
))

passport.use(new GoogleStrategy(
    {
        clientID:envVars.GOOGLE.GOOGLE_CLIENT_ID,
clientSecret:envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
callbackURL:envVars.GOOGLE.GOOGLE_CALLBACK_URL
    },
    async(accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback)=>{
        try{
const email=profile.emails?.[0].value
if(!email){
return done(null,false,{message:"No email found"})
}
let isUserExist=await User.findOne({email})
if(isUserExist && !isUserExist.isVerified){
      return done(null,false,{message:"User is not verified"})
   }
   if(isUserExist&&(isUserExist.isActive===IsActive.BLOCKED||isUserExist.isActive===IsActive.INACTIVE)){
   return done(null,false,{message:`User is ${isUserExist?.isActive}`})
}
if(isUserExist&&isUserExist.isDeleted){
    return done(null,false,{message:"User is deleted"})
}
const hasCredintialsLogin=isUserExist?.auths?.some(obj=>obj.provider==="credintials")

if(isUserExist&&isUserExist.isVerified&&hasCredintialsLogin){
    isUserExist=await User.findOneAndUpdate({email:email},{
      $addToSet:{auths:{provider:"google",providerId:profile.id},}  
    },{new:true,runValidators:true})
}
if(!isUserExist){
    isUserExist=await User.create({
    email,
    name:profile.displayName,
    picture:profile.photos?.[0].value,
    role:Role.USER,
    isVerified:true,
    auths:[
        {
            provider:"google",
            providerId:profile.id
        }
    ]
 })
}

return done(null,isUserExist)
        }
        catch(error){
            done(error)
        }

    }
))

passport.serializeUser((user:any,done:(err:any,id?:unknown)=>void)=>{
done(null,user._id)
})
passport.deserializeUser(async(id:string,done:any)=>{
    try{
const user= await User.findById(id)
done(null,user)
    }
    catch(error){
        done(error)
    }

})