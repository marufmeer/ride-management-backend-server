import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/appError"
import http from "http-status-codes"
const transporter=nodemailer.createTransport({
   service:"gmail" ,
   secure:true,
   auth:{
    user:envVars.SMTP.SMTP_USER,
    pass:envVars.SMTP.SMTP_PASS
   },
   port:Number(envVars.SMTP.SMTP_PORT),
   host:envVars.SMTP.SMTP_HOST
}) 
interface sendEmailOptions{
    to:string
    subject:string
    templateName:string
    templateData?:Record<string,any>
    attachments?:{
        fileName:string
        content:Buffer | string
        contentType:string
    }[]
}
export const sendEmail=async({
    to,
   subject,
   templateName,
   templateData,
   attachments
}:sendEmailOptions)=>{
    try{
 const templatePath=path.join(__dirname,`templates/${templateName}.ejs`)
 const html=await ejs.renderFile(templatePath,templateData)
 const info=await transporter.sendMail({
    from:envVars.SMTP.SMTP_FROM,
    to:to,
    subject:subject,
    html:html,
    attachments:attachments?.map((attachment)=>({
            fileName:attachment.fileName,
            content:attachment.content,
            contentType:attachment.contentType
    }))

 })
 console.log(`Email send to ${to}:${ info.messageId}`)
    }
catch(error:any){
    console.log(error)
    throw new AppError(http.BAD_REQUEST,"Email error")
}
}