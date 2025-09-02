import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type";

export const handleZodError=(err:any):TGenericErrorResponse=>{
const errSources:TErrorSources[]=[]
 const parseArrayOfZodErr=JSON.parse(err.message)
    const zodErrArray=parseArrayOfZodErr.map((obj:any)=>({
        path:obj.path[0],
        message:obj.message
    }))  
      errSources.push(zodErrArray)
      return{
        statusCode:400,
        message:"Zod Error",
        errorSources:errSources
      }
}