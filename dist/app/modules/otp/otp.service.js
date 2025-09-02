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
exports.otpServices = void 0;
const redis_config_1 = require("../../config/redis.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const otpGenerate_1 = require("../../utils/otpGenerate");
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const otp_expiration = 5 * 60;
const otpSend = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (isUserExist.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "You already verified your email");
    }
    const otp = (0, otpGenerate_1.otpGenerate)();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: otp_expiration
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your otp code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
            expiry: otp_expiration
        }
    });
});
const otpVerify = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (isUserExist.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.CONFLICT, "User email is already verified");
    }
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOtp) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid otp");
    }
    if (savedOtp !== otp) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid otp");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del(redisKey)
    ]);
});
const otpResend = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (isUserExist.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "You already verified your email");
    }
    const otp = (0, otpGenerate_1.otpGenerate)();
    const redisKey = `otp:${email}`;
    const oldOtp = yield redis_config_1.redisClient.get(redisKey);
    if (oldOtp) {
        yield redis_config_1.redisClient.del(redisKey);
    }
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: otp_expiration
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your otp code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
            expiry: otp_expiration
        }
    });
});
exports.otpServices = {
    otpSend,
    otpVerify,
    otpResend
};
