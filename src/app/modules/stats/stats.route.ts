import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get(
    "/ride",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getRideStats
);
router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
);
router.get(
    "/driver",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getDriverStats
);

export const StatsRoutes = router;