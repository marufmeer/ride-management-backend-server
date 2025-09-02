import { TGenericErrorResponse } from "../interfaces/error.type"

export const handleDuplicateError=(err:any):TGenericErrorResponse=>{
        const matchedArray=err.message.match(/s*"([^"]+)"/)
    return {
        statusCode:400,
        message: `${matchedArray[1]} already exists`
}
}