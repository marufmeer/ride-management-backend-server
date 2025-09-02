import { Request, Response } from "express";
import http from "http-status-codes"
export const notFound=(req:Request,res:Response)=>{
 res.status(http.NOT_FOUND).json({
    success:false,
    message:"Route not found"
 })  
}