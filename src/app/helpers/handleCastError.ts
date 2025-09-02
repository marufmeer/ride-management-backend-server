import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type"

export const handleCastError=(err:any):TGenericErrorResponse=>{
  const errorSources:TErrorSources[]=[]
  errorSources.push({
    path:err.path,
    message:err.message
  })
    return {
        statusCode:400,
        message:`Invalid value ${err.value} for field ${err.path}`,
        errorSources
}

}