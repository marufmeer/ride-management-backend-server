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
exports.authControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const passport_1 = __importDefault(require("passport"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const userToken_1 = require("../../utils/userToken");
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
const setAuthCookie_1 = require("../../utils/setAuthCookie");
const credintialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new appError_1.default(http_status_codes_1.default.BAD_REQUEST, err));
        }
        if (!user) {
            return next(new appError_1.default(http_status_codes_1.default.BAD_REQUEST, info.message));
        }
        const tokenInfo = (0, userToken_1.createUserToken)(user);
        const userObject = user.toObject();
        delete userObject.password;
        (0, setAuthCookie_1.setAuthCookie)(res, tokenInfo);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User login sucsessfully",
            data: {
                accessToken: tokenInfo.accessToken,
                refreshToken: tokenInfo.refreshToken,
                user: userObject
            },
        });
    }))(req, res, next);
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const tokenInfo = (0, userToken_1.createUserToken)(user);
    (0, setAuthCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const decodeToken = req.user;
    yield auth_service_1.authServices.changePassword(oldPassword, newPassword, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password changed sucsessfully",
        data: null
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const decodeToken = req.user;
    yield auth_service_1.authServices.setPassword(password, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password set sucsessfully",
        data: null
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.authServices.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset link sent to your gmail",
        data: null
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodeToken = req.user;
    yield auth_service_1.authServices.resetPassword(payload, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset sucsessfully",
        data: null
    });
}));
const getRefreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = yield auth_service_1.authServices.getRefreshToken(refreshToken);
    (0, setAuthCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CONTINUE,
        message: "New access token get sucsessfully",
        data: {
            newAccessToken: tokenInfo.accessToken,
        }
    });
}));
const logOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "none"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CONTINUE,
        message: "User logged out successfully",
        data: null
    });
}));
exports.authControllers = {
    credintialsLogin,
    googleCallback,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    getRefreshToken,
    logOut
};
