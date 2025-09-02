"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.changePasswordZodSchema = exports.setpasswordZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.setpasswordZodSchema = zod_1.default.object({
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
    })
});
exports.changePasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default.string({ error: "password must be string" }),
    newPassword: zod_1.default.string({ error: "password must be string" }).min(8, { message: "Password must be at least 8 characters long" }).max(100, { message: "Password must be at most 100 characters long" })
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
    })
});
exports.resetPasswordZodSchema = zod_1.default.object({
    id: zod_1.default.string({ error: "id must be string" }),
    newPassword: zod_1.default.string({ error: "password must be string" }).min(8, { message: "Password must be at least 8 characters long" }).max(100, { message: "Password must be at most 100 characters long" })
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
    })
});
