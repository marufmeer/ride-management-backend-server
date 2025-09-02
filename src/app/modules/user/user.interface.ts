import { Types } from "mongoose";

export enum Role{
SUPER_ADMIN="SUPER_ADMIN",
ADMIN="ADMIN",
USER="USER",
DRIVER="DRIVER"
}
export enum IsActive{
ACTIVE="ACTIVE",
INACTIVE="INACTIVE",
BLOCKED="BLOCKED"
}
export interface IAuthProvider{
    providerId:string;
    provider:"google"|"credintials";
}


export interface IUser{
_id?:Types.ObjectId
name: string
email: string 
password?:string
role: Role
phone?: string
picture?: string
address?: string
isDeleted?: boolean
isActive?: IsActive
isVerified?: boolean
auths?:IAuthProvider[]
driver?:Types.ObjectId
}