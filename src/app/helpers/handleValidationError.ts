import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type";

export const handleValidationError=(err:any):TGenericErrorResponse=>{
   const errorSources:TErrorSources[]=[]
    const errors=Object.values(err.errors)
    errors.forEach((obj:any)=>{
        errorSources.push({
            path:obj.path,
            message:obj.message
        })
    })
return{
    statusCode:400,
    message:err.message,
    errorSources
}
}