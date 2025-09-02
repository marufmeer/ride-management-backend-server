import { Router } from "express"
import { driverControllers } from "./driver.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"
import { validateRequest } from "../../middlewares/validateRequest"
import { applyDriverZodSchema, updateDriverStatusZodSchema, updateDriverZodSchema } from "./driver.validate"

const router=Router()
router.post("/driver-apply",validateRequest(applyDriverZodSchema),checkAuth(Role.USER),driverControllers.applyForDriver)
router.get("/all-drivers",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),driverControllers.getAllDrivers)
router.patch("/approve/:id",validateRequest(updateDriverStatusZodSchema),checkAuth(Role.SUPER_ADMIN,Role.ADMIN),driverControllers.approveDriverStatus)
router.get("/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),driverControllers.getOneDriver)
router.patch("/:id",validateRequest(updateDriverZodSchema),checkAuth(...Object.values(Role)),driverControllers.updateOneDriver)

export const DriverRoutes=router