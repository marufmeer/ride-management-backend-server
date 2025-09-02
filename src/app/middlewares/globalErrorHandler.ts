import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/env";
import { TErrorSources } from "../interfaces/error.type";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";



export const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    let statusCode=500
    let message=err.message
    let errSources:TErrorSources[]=[]
   if(err.code===11000){
   const duplicateError=handleDuplicateError(err)
    statusCode=duplicateError.statusCode
    message=duplicateError.message
}
else if(err.name==="CastError"){
   const castError= handleCastError(err)
    statusCode=castError.statusCode
    message=castError.message
}
   else if(err.name==="ZodError"){
   const zodError=handleZodError(err)
   statusCode=zodError.statusCode
   message=zodError.message
   errSources=zodError.errorSources as TErrorSources[]
    }
    else if(err.name==="ValidationError"){
   const validationError=handleValidationError(err)
   statusCode=validationError.statusCode
   message=validationError.message
   errSources=validationError.errorSources as TErrorSources[]
    }
  else if(err instanceof AppError){
        statusCode=err.statusCode,
        message=err.message
    }
   else if(err instanceof Error){
        statusCode=500
        message=err.message
    }
  
    res.status(statusCode).json({
        success:false,
        message,
        errSources,
        err:envVars.NODE_ENV==="development"?err:null,
        stack:envVars.NODE_ENV==="development"?err.stack:null
    })
}