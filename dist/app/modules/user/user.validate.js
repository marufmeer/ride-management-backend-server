"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZosSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string({ error: "firstName must be string" }).min(2, { message: "Name must be at least 2 characters" }).max(50, { message: "Name must be at most 50 characters long" }),
    email: zod_1.default.string({ error: "email must be string" }).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Invalid email address format"
    }),
    phone: zod_1.default.string({ error: "number must be string" }).regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid number format"
    }).optional(),
    password: zod_1.default.string({ error: "password must be string" }).min(8, { message: "Password must be at least 8 characters long" }).max(100, { message: "Password must be at most 100 characters long" })
        .regex(/(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter"
    })
        .regex(/(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter"
    })
        .regex(/(?=.*\d)/, {
        message: "Password must contain at least 1 number"
    })
        .regex(/(?=.*[@$!%*?&])/, {
        message: "Password must contain at least 1 special character"
    }),
    address: zod_1.default.string({ error: "Address must be string" }).optional(),
});
exports.updateUserZosSchema = zod_1.default.object({
    name: zod_1.default.string({ error: "firstName must be string" }).min(2, { message: "Name must be at least 2 characters" }).max(50, { message: "Name must be at most 50 characters long" }).optional(),
    picture: zod_1.default.string({ error: "picture url must be type string" }).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isVerified: zod_1.default.boolean().optional(),
    phone: zod_1.default.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Please enter a valid phone number"
    }).optional(),
    address: zod_1.default.string().optional(),
});
