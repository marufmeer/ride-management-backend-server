import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema=new Schema<IAuthProvider>({
    provider:{
        type:String,
        required:true
    },
    providerId:{
        type:String,
      required:true
    }
},{
    versionKey:false,
    _id:false
})

export const UserSchema=new Schema<IUser>({
    name:{
  type:String,
 required:true
    },
    email: {
    type:String,
    unique:true,
    required:true,
    } ,
    password:{
    type:String,
   },
    role:{
     type:String,
     required:true,
     enum:Object.values(Role),
     default:Role.USER
    },
    phone: {
    type:String,
      },

    picture: {
       type:String
},
    address: {
       type:String
},

    isDeleted: {
       type:Boolean,
       default:false
},
    isActive: {
      type:String,
      enum:Object.values(IsActive),
       default:IsActive.ACTIVE
 },
    isVerified:{
       type:Boolean,
       default:false
},
 auths:[AuthProviderSchema] ,
 driver:{
    type:Schema.Types.ObjectId,
    ref:"Driver"
 }
},{
    timestamps:true,
    versionKey:false
})

export const User=model<IUser>("User",UserSchema)