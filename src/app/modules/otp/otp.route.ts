import { Router } from "express"
import { otpControllers } from "./otp.controller"

const router=Router()
router.post("/send",otpControllers.otpSend)
router.post("/verify",otpControllers.otpVerify)
router.post("/resend",otpControllers.otpResend)

export const OtpRoutes=router