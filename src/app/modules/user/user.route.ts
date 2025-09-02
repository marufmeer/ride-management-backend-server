import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZosSchema } from "./user.validate";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router=Router()
router.post("/register",validateRequest(createUserZodSchema),userControllers.createUser)
router.get("/all-users",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),userControllers.getAllUsers)
router.get("/me",checkAuth(...Object.values(Role)),userControllers.getMe)
router.get("/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),userControllers.getOneUser)
router.patch("/:id",validateRequest(updateUserZosSchema),checkAuth(...Object.values(Role)),userControllers.updateOneUser)
export const UserRoutes=router