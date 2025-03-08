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
exports.authenticationService = exports.refreshTokenService = void 0;
const variables_1 = __importDefault(require("../../config/variables"));
const jwtTokenHelper_1 = require("../../lib/jwtTokenHelper");
const mailSender_1 = require("../../lib/mailSender");
const redisClient_1 = __importDefault(require("../../lib/redisClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const employee_model_1 = require("../employee/employee.model");
const authentication_model_1 = require("./authentication.model");
// password login
const passwordLoginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!isUserExist)
        throw Error("User not found");
    const isMatch = yield bcrypt_1.default.compare(password, isUserExist.password);
    if (!isMatch && isUserExist.password) {
        throw Error("Incorrect password");
    }
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({
        id: isUserExist.id,
        role: isUserExist.role || "user",
    }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createRefreshToken({
        id: isUserExist.id,
        role: isUserExist.role || "user",
    }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
    // save refresh token to database
    yield authentication_model_1.Authentication.updateOne({ user_id: isUserExist.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
    return {
        accessToken,
        refreshToken,
        // token will expire in 60 seconds
        expiresAt: Date.now() + 60 * 1000,
        userId: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.work_email,
        image: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.image,
        role: isUserExist.role,
    };
});
// oauth login
const oauthLoginService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUser = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!loginUser) {
        throw new Error("User not found");
    }
    const userDetails = {
        userId: loginUser.id,
        name: loginUser.name,
        email: loginUser.work_email,
        image: loginUser.image,
        role: loginUser.role || "user",
        accessToken: "",
        refreshToken: "",
    };
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: loginUser.id, role: loginUser.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createRefreshToken({ user_id: loginUser.id, role: loginUser.role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
    // save refresh token to database
    yield authentication_model_1.Authentication.updateOne({ user_id: loginUser.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
    userDetails.accessToken = accessToken;
    userDetails.refreshToken = refreshToken;
    return userDetails;
});
// token login
const tokenLoginService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jwtTokenHelper_1.jwtHelpers.verifyToken(token, variables_1.default.jwt_secret);
    const userId = decodedToken.id;
    const employee = yield employee_model_1.Employee.findOne({ id: userId });
    if (!employee) {
        throw new Error("User not found");
    }
    const userDetails = {
        userId: employee.id,
        name: employee.name,
        email: employee.work_email,
        image: employee.image,
        role: employee.role || "user",
        accessToken: "",
        refreshToken: "",
    };
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: employee.id, role: employee.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createRefreshToken({ user_id: employee.id, role: employee.role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
    // save refresh token to database
    yield authentication_model_1.Authentication.updateOne({ user_id: employee.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
    userDetails.accessToken = accessToken;
    userDetails.refreshToken = refreshToken;
    return userDetails;
});
// user verification for password recovery
const verifyUserService = (email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!isUserExist) {
        throw Error("Something went wrong Try again");
    }
    else {
        yield sendVerificationOtp(isUserExist.id, email, currentTime);
        return isUserExist;
    }
});
// send verification otp
const sendVerificationOtp = (id, email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const getCurrentTime = new Date(currentTime);
    const expiringTime = new Date(getCurrentTime.setMinutes(getCurrentTime.getMinutes() + 5)).toISOString();
    const userVerification = {
        pass_reset_token: {
            token: yield bcrypt_1.default.hash(otp, variables_1.default.salt),
            expires: expiringTime,
        },
    };
    yield authentication_model_1.Authentication.updateOne({ user_id: id }, { $set: userVerification }, { upsert: true, new: true });
    yield mailSender_1.mailSender.otpSender(email, otp);
});
// verify otp
const verifyOtpService = (email, otp, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otp && !email) {
        throw Error("Empty details are not allowed");
    }
    else {
        const user = yield employee_model_1.Employee.findOne({ work_email: email });
        const verificationToken = yield authentication_model_1.Authentication.findOne({
            user_id: user === null || user === void 0 ? void 0 : user.id,
        });
        if (!verificationToken) {
            throw Error("OTP not found");
        }
        else {
            const userId = verificationToken.user_id;
            const { token: hashedOtp, expires } = verificationToken.pass_reset_token;
            // Check if the OTP is still valid
            if (new Date(expires) > new Date(currentTime)) {
                const compareOtp = yield bcrypt_1.default.compare(otp, hashedOtp);
                yield employee_model_1.Employee.updateOne({ id: userId }, { $set: { verified: true } });
                // Check if the OTP is correct
                if (!compareOtp) {
                    throw Error("Incorrect OTP!");
                }
                // Check if the OTP has expired
            }
            else {
                throw Error("OTP Expired");
            }
        }
    }
});
// reset password
const resetPasswordService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const hashedPassword = yield bcrypt_1.default.hash(password, variables_1.default.salt);
        const resetPassword = yield employee_model_1.Employee.findOneAndUpdate({ work_email: email }, {
            $set: {
                password: hashedPassword,
            },
        }, { session, new: true });
        if (!resetPassword) {
            throw new Error("Something went wrong");
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
    }
});
// update password
const updatePasswordService = (id, current_password, new_password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield employee_model_1.Employee.findOne({ id: id });
    if (!user) {
        throw new Error("Something went wrong");
    }
    if (user.password) {
        const isMatch = yield bcrypt_1.default.compare(current_password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect password");
        }
    }
    const hashedPassword = yield bcrypt_1.default.hash(new_password, variables_1.default.salt);
    yield employee_model_1.Employee.updateOne({ id: id }, {
        $set: {
            password: hashedPassword,
        },
    }, { new: true, upsert: true });
});
// reset password otp
const resetPasswordOtpService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw Error("Invalid request");
    }
    else {
        const isUserOtp = yield authentication_model_1.Authentication.findOne({
            user_id: id,
        });
        if (!isUserOtp) {
            throw Error("Invalid user_id");
        }
        else {
            return isUserOtp;
        }
    }
});
// resend verification token
const resendOtpService = (email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    const user_id = user === null || user === void 0 ? void 0 : user.id;
    if (!email) {
        throw Error("Empty user information");
    }
    else {
        yield sendVerificationOtp(user_id, email, currentTime);
    }
});
// create refresh token
const createRefreshToken = (id, role) => {
    return jwtTokenHelper_1.jwtHelpers.createRefreshToken({ id, role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
};
// verify refresh token
const verifyRefreshToken = (token) => {
    return jwtTokenHelper_1.jwtHelpers.verifyRefreshToken(token, variables_1.default.jwt_refresh_secret);
};
//
const THROTTLE_CONFIG = {
    maxAttempts: variables_1.default.env === "development" ? Infinity : 5,
    windowSeconds: 60,
    lockoutDurationSeconds: 300,
    keyPrefix: "refresh:throttle:",
};
const getRedisKeys = (userId) => ({
    attemptsKey: `${THROTTLE_CONFIG.keyPrefix}${userId}:attempts`,
    lockKey: `${THROTTLE_CONFIG.keyPrefix}${userId}:lock`,
});
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    // Create a new refresh promise and store it
    const decodedToken = verifyRefreshToken(refreshToken);
    const { id: userId, role } = decodedToken;
    if (!userId) {
        throw new Error("Invalid refresh token");
    }
    const isExit = yield redisClient_1.default.get(refreshToken);
    if (isExit) {
        return JSON.parse(isExit);
    }
    const { attemptsKey, lockKey } = getRedisKeys(userId);
    if (yield redisClient_1.default.get(lockKey)) {
        const ttl = yield redisClient_1.default.ttl(lockKey);
        throw new Error(`Too many requests. Try again in ${ttl} seconds.`);
    }
    const now = Date.now();
    yield redisClient_1.default.zadd(attemptsKey, now, now);
    yield redisClient_1.default.expire(attemptsKey, THROTTLE_CONFIG.windowSeconds * 2);
    yield redisClient_1.default.zremrangebyscore(attemptsKey, 0, now - THROTTLE_CONFIG.windowSeconds * 1000);
    const attemptCount = yield redisClient_1.default.zcard(attemptsKey);
    if (attemptCount > THROTTLE_CONFIG.maxAttempts) {
        yield redisClient_1.default.set(lockKey, "1", "EX", THROTTLE_CONFIG.lockoutDurationSeconds);
        throw new Error("Too many attempts. Try again later.");
    }
    const storedToken = yield authentication_model_1.Authentication.findOne({ user_id: userId });
    if (!storedToken || storedToken.refresh_token !== refreshToken) {
        throw new Error("Invalid refresh token");
    }
    const newAccessToken = jwtTokenHelper_1.jwtHelpers.createToken({
        id: userId,
        role: role || "user",
    }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const newRefreshToken = jsonwebtoken_1.default.sign({ id: userId, role: role || "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    yield authentication_model_1.Authentication.updateOne({ user_id: userId }, { refresh_token: newRefreshToken });
    yield redisClient_1.default.psetex(refreshToken, 10 * 1000, JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }));
    yield redisClient_1.default.del(attemptsKey);
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
});
exports.refreshTokenService = refreshTokenService;
// export services
exports.authenticationService = {
    passwordLoginService,
    oauthLoginService,
    tokenLoginService,
    verifyUserService,
    resendOtpService,
    verifyOtpService,
    resetPasswordService,
    updatePasswordService,
    resetPasswordOtpService,
    createRefreshToken,
    verifyRefreshToken,
    refreshTokenService: exports.refreshTokenService,
};
//# sourceMappingURL=authentication.service.js.map