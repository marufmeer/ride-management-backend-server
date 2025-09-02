import {createServer} from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { Server as SocketIOServer  } from "socket.io";
let server:ReturnType<typeof createServer>;
let io:SocketIOServer
const startServer=async()=>{
   try{
await mongoose.connect(envVars.DB_URL)
    console.log("Connected to DB!")
    server=createServer(app)
    io=new SocketIOServer(server,{
        cors:{
            origin:envVars.FRONTEND_URL,
            credentials:true
        }
    })
    io.on("connection",(socket)=>{
        console.log("socket connected",socket.id)
        socket.on("disconnect",()=>{
            console.log("Socket disconnected",socket.id)
        })
    })
server=app.listen(envVars.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
   })
}
   catch(error){
    console.log(error)
   }
}
(async()=>{
await startServer()
await seedSuperAdmin()
await connectRedis()
    }
)()


process.on("SIGTERM",()=>{
    console.log("SIGTERM signal recieved... Server shutting down..");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGINT",()=>{
    console.log("SIGINT signal recieved... Server shutting down..");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("unhandledRejection",()=>{
    console.log("Unhandle rejection detected... Server shutting down..");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("uncaughtException",()=>{
    console.log("Uncaught Exception detected... Server shutting down..");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})