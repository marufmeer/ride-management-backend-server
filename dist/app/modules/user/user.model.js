"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const AuthProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
});
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER
    },
    phone: {
        type: String,
    },
    picture: {
        type: String
    },
    address: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    auths: [AuthProviderSchema],
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver"
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", exports.UserSchema);
