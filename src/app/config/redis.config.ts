import { createClient } from "redis";
import { envVars } from "./env";


export const redisClient= createClient({
    username:envVars.REDIS.REDIS_USERNAME,
    password:envVars.REDIS.REDIS_PASSWORD,
    socket:{
        port:Number(envVars.REDIS.REDIS_PORT),
        host:envVars.REDIS.REDIS_HOST
    }
})
redisClient.on("error",(err)=>{
    console.log(`Redis client error`,err)
})

export const connectRedis=async()=>{
      if(!redisClient.isOpen){
        redisClient.connect()
        console.log("Redis Connected")
      }
}