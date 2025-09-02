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
exports.authServices = void 0;
const userToken_1 = require("../../utils/userToken");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const changePassword = (oldPassword, newPassword, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: decodeToken.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isOldPasswordMatched = yield bcrypt_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatched) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User old password does not match");
    }
    const typeOldPassword = yield bcrypt_1.default.compare(newPassword, user === null || user === void 0 ? void 0 : user.password);
    if (typeOldPassword) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are entered the old password");
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashedNewPassword;
    yield user.save();
});
const setPassword = (password, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findOne({ email: decodeToken.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.password) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password already set instead use change password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credintialProvider = {
        provider: "credintials",
        providerId: user.email
    };
    const authcredintials = (_a = user.auths) === null || _a === void 0 ? void 0 : _a.some(providerObj => providerObj.provider === "credintials");
    if (!authcredintials) {
        user.auths = [...user.auths || [], credintialProvider];
    }
    user.password = hashedPassword;
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!user.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED || user.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${user.isActive}`);
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is deleted`);
    }
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const resetToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.JWT.JWT_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Forgot password",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            resetUILink
        }
    });
});
const resetPassword = (payload, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodeToken.userId) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User can't reset his password `);
    }
    const user = yield user_model_1.User.findById(decodeToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    yield user.save();
});
const getRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
exports.authServices = {
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    getRefreshToken,
};
