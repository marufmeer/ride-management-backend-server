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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_constant_1 = require("./user.constant");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.CONFLICT, "This email is already registered");
    }
    if (!payload.password) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required");
    }
    const { name, email, password } = payload, rest = __rest(payload, ["name", "email", "password"]);
    const hasedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        providerId: email,
        provider: "credintials"
    };
    const newPayload = Object.assign({ name,
        email, password: hasedPassword, auths: [authProvider] }, rest);
    yield user_model_1.User.create(newPayload);
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: decodedToken.email }).populate("driver");
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!isUserExist.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User email is not verified");
    }
    const user = isUserExist.toObject();
    delete user.password;
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = queryBuilder.search(user_constant_1.userSearchableFields).filter().sort().paginate().fields();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);
    const newData = data.map(user => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    });
    return {
        newData, meta
    };
});
const getOneUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return isUserExist;
});
const updateOneUser = (userId, decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
        if (decodedToken.userId !== userId) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && payload.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not permitted to give super admin role");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && payload.role === user_interface_1.Role.ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only super admin can create a role admin");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isVerified || payload.isDeleted) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    yield user_model_1.User.findByIdAndUpdate(userId, payload, { runValidators: true, new: true });
});
exports.userServices = {
    createUser,
    getMe,
    getAllUsers,
    getOneUser,
    updateOneUser
};
