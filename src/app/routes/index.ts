import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RideRoutes } from "../modules/ride/ride.route";
import { StatsRoutes } from "../modules/stats/stats.route";


export const router=Router()
const moduleRoutes=[
{
 path:"/user",
 route:UserRoutes
},
{
path:"/otp",
route:OtpRoutes
},
{
path:"/auth",
route:AuthRoutes
},
{
path:"/driver",
route:DriverRoutes
},
{
path:"/ride",
route:RideRoutes
},
{
path:"/stats",
 route:StatsRoutes
}
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})