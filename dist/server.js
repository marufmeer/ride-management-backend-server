"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const redis_config_1 = require("./app/config/redis.config");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const socket_io_1 = require("socket.io");
let server;
let io;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to DB!");
        server = (0, http_1.createServer)(app_1.default);
        io = new socket_io_1.Server(server, {
            cors: {
                origin: env_1.envVars.FRONTEND_URL,
                credentials: true
            }
        });
        io.on("connection", (socket) => {
            console.log("socket connected", socket.id);
            socket.on("disconnect", () => {
                console.log("Socket disconnected", socket.id);
            });
        });
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
    yield (0, redis_config_1.connectRedis)();
}))();
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", () => {
    console.log("Unhandle rejection detected... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log("Uncaught Exception detected... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
