import { DriverStatus } from "../driver/driver.interface"
import { Driver } from "../driver/driver.model"
import { PAYMENT, Status } from "../ride/ride.interface"
import { Ride } from "../ride/ride.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"

const now =new Date()
const sevenDaysAgo=new Date(now).setDate(now.getDate()-7)
const thirtyDaysAgo=new Date(now).setDate(now.getDate()-30)
const getRideStats=async()=>{
  const totalRidePromise=Ride.countDocuments()
  const totalRideByStatusPromise=Ride.aggregate([
    {
        $group:{
            _id:"$status",
            rideCount:{$sum:1}
        }
    }
  ])
     const RidesLast7DaysPromise = Ride.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const RidesLast30DaysPromise = Ride.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })
    const totalRideByUniqueUserPromise=Ride.distinct("user").then((user:any)=>user.length)
    const totalRideByUniqueDriverPromise=Ride.distinct("driver").then((driver:any)=>driver.length)
    const filter={
 $match:{
            status:Status.COMPLETED
        }
    }
const totalRideByOneUserPromise=Ride.aggregate([
  filter,
    {
        $group:{
            _id:"$user",
            count:{$sum:1}
        }
    }
])
const totalRideByOneDriverPromise=Ride.aggregate([
  filter,
    {
        $group:{
            _id:"$driver",
            count:{$sum:1}
        }
    }
])
const totalRevenewPromise=Ride.aggregate([
   {
   $match:{
    paymentStatus:PAYMENT.PAID
        } 
   } ,
   {
    $group:{
        _id:"null",
        totalRevenew:{$sum:"$estimatedFare"}
    }
   }
])
const avgPaymentAmountPromise=Ride.aggregate([
   {
   $match:{
    paymentStatus:PAYMENT.PAID
    } 
   },
   {
    $group:{
        _id:"null",
        avgPaymentAmount:{$avg:"$estimatedFare"}
    }
   }
])
const totalEarningsByEachDriversPromise=Ride.aggregate([
   {
   $match:{
    paymentStatus:PAYMENT.PAID
        } 
   } ,
   {
    $group:{
        _id:"$driver",
        totalEarnings:{$sum:"$estimatedFare"}
    }
   },
   {
    $lookup:{
        from:"drivers",
         localField:"_id",
        foreignField:"_id",
        as:"driver"
    }
   },
   {
    $unwind:"$driver"
   },
   {
     $lookup:{
        from:"users",
         localField:"driver.user",
        foreignField:"_id",
       as:"user"
    }
   },
   {
   $unwind:"$user"
   },
   {
    $project:{
        totalEarnings:1,
     driverName:"$user.name",
     userRole:"$user.role"    
    }
   }
])
const[totalRide,totalRideByUniqueUser,totalRideByUniqueDriver,totalRideByStatus,totalRideByOneUser,totalRideByOneDriver,totalRevenew,totalEarningsByEachDrivers,avgPaymentAmount,RidesLast7Days,RidesLast30Days ]=await Promise.all([
totalRidePromise,totalRideByUniqueUserPromise,totalRideByUniqueDriverPromise,totalRideByStatusPromise,totalRideByOneUserPromise,totalRideByOneDriverPromise,totalRevenewPromise,totalEarningsByEachDriversPromise,avgPaymentAmountPromise,RidesLast7DaysPromise,RidesLast30DaysPromise    
])
return{
    totalRide,totalRideByUniqueUser,totalRideByUniqueDriver,totalRideByStatus,totalRideByOneUser,totalRideByOneDriver,totalRevenew,totalEarningsByEachDrivers,avgPaymentAmount,RidesLast7Days,RidesLast30Days
}
}
const getUserStats=async()=>{
 const totalUserPromise= User.countDocuments()
const totalActiveUsersPromise=User.countDocuments({isActive:IsActive.ACTIVE})
const totalInActiveUsersPromise=User.countDocuments({isActive:IsActive.INACTIVE})
const totalBlockedUsersPromise=User.countDocuments({isActive:IsActive.BLOCKED}) 
const newUsersInLast7DaysPromise= User.countDocuments({createdAt:{$gte:sevenDaysAgo}})
const newUsersInLast30DaysPromise= User.countDocuments({createdAt:{$gte:thirtyDaysAgo}})

const usersByRolePromise=User.aggregate([
   {
   $group:{
    _id:"$role",
    count:{$sum:1}
    } 
   } 
])
const [totalUsers,totalActiveUsers,totalInActiveUsers,totalBlockedUsers,newUsersInLast7Days, newUsersInLast30Days,usersByRole]=await Promise.all([
 totalUserPromise,totalActiveUsersPromise,totalInActiveUsersPromise,totalBlockedUsersPromise,newUsersInLast7DaysPromise,newUsersInLast30DaysPromise,usersByRolePromise  
])
return{
 totalUsers,
 totalActiveUsers,
 totalInActiveUsers,
 totalBlockedUsers,
 newUsersInLast7Days, 
 newUsersInLast30Days,
 usersByRole  
}
}
const getDriverStats=async()=>{
 const totalDriverPromise= Driver.countDocuments()
const totalApprovedDriverPromise=Driver.countDocuments({ driverStatus:DriverStatus.APPROVED})
const totalPendingDriverPromise=Driver.countDocuments({ driverStatus:DriverStatus.PENDING})
const totalRejectDriverPromise=Driver.countDocuments({ driverStatus:DriverStatus.REJECTED})
const totalSuspendDriverPromise=Driver.countDocuments({ driverStatus:DriverStatus.SUSPEND})

const newDriversInLast7DaysPromise= Driver.countDocuments({createdAt:{$gte:sevenDaysAgo}})
const newDriversInLast30DaysPromise= Driver.countDocuments({createdAt:{$gte:thirtyDaysAgo}})

const [totalDriver,totalApprovedDriver,
totalPendingDriver,totalRejectDriver,totalSuspendDriver,newDriversInLast7Days,newDriversInLast30Days ]=await Promise.all([
 totalDriverPromise,totalApprovedDriverPromise,
 totalPendingDriverPromise,
totalRejectDriverPromise,
totalSuspendDriverPromise,
 newDriversInLast7DaysPromise,
 newDriversInLast30DaysPromise 
])
return{
totalDriver,totalApprovedDriver,
totalPendingDriver,totalRejectDriver,totalSuspendDriver,newDriversInLast7Days,newDriversInLast30Days 
}
}

export const StatsService={
    getRideStats,
    getUserStats,
    getDriverStats
}