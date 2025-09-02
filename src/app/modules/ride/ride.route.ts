import { Router } from "express"
import { reqRideZodSchema, updateRideStatusZodSchema } from "./ride.validate"
import { rideControllers } from "./ride.controller"
import { validateRequest } from "../../middlewares/validateRequest"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"



const router=Router()
router.post("/ride-request",validateRequest(reqRideZodSchema),checkAuth(Role.USER),rideControllers.findRide)
router.get("/get-my-rides",checkAuth(Role.USER,Role.DRIVER),rideControllers.getMyRides)
router.get("/get-all-rides",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),rideControllers.getAllRides)
router.patch("/payment-status-update/:rideId",checkAuth(Role.DRIVER),rideControllers.paymentStatusUpdate)
router.patch("/ride-status-update/:rideId",checkAuth(Role.DRIVER,Role.USER),validateRequest(updateRideStatusZodSchema),rideControllers.rideStatusUpdate)
router.get("/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),rideControllers.getSingleRide)

export const RideRoutes=router