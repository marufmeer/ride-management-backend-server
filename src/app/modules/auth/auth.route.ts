import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";
import { validateRequest } from "../../middlewares/validateRequest";
import { changePasswordZodSchema, resetPasswordZodSchema, setpasswordZodSchema } from "./auth.validate";


const router=Router()
router.post("/login",authControllers.credintialsLogin)
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    const redirect=req.query?.redirect || "/"
passport.authenticate("google",{
    scope:["profile","email"],
    state:redirect as string
})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{   failureRedirect:`${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`
}),authControllers.googleCallback)
router.post("/change-password",validateRequest(changePasswordZodSchema),checkAuth(...Object.values(Role)),authControllers.changePassword)
router.post("/set-password",validateRequest(setpasswordZodSchema),checkAuth(...Object.values(Role)),authControllers.setPassword)
router.post("/forgot-password",authControllers.forgotPassword)
router.post("/reset-password",validateRequest(resetPasswordZodSchema),checkAuth(...Object.values(Role)),authControllers.resetPassword)
router.post("/refresh-token",authControllers.getRefreshToken)
router.post("/logout",authControllers.logOut)
export const AuthRoutes=router