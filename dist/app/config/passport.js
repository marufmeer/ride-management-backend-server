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
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const env_1 = require("./env");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User not found" });
        }
        if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isVerified)) {
            return done(null, false, { message: "User is not verified" });
        }
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isActive) === user_interface_1.IsActive.BLOCKED || (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isActive) === user_interface_1.IsActive.INACTIVE) {
            return done(null, false, { message: `User is ${isUserExist.isActive}` });
        }
        if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted) {
            return done(null, false, { message: `User is deleted` });
        }
        const isGoogleAuthenticated = (_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.auths) === null || _a === void 0 ? void 0 : _a.some(providerObj => providerObj.provider === "google");
        if (isGoogleAuthenticated && !(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password)) {
            return done(null, false, { message: `You email had been authenticated with google login.Please try  google login to continue ` });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatch) {
            return done(null, false, { message: "Password does not match" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        if (isUserExist && (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE)) {
            return done(null, false, { message: `User is ${isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isActive}` });
        }
        if (isUserExist && isUserExist.isDeleted) {
            return done(null, false, { message: "User is deleted" });
        }
        const hasCredintialsLogin = (_b = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.auths) === null || _b === void 0 ? void 0 : _b.some(obj => obj.provider === "credintials");
        if (isUserExist && isUserExist.isVerified && hasCredintialsLogin) {
            isUserExist = yield user_model_1.User.findOneAndUpdate({ email: email }, {
                $addToSet: { auths: { provider: "google", providerId: profile.id }, }
            }, { new: true, runValidators: true });
        }
        if (!isUserExist) {
            isUserExist = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id
                    }
                ]
            });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
