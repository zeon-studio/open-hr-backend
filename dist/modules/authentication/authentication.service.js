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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
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
        role: isUserExist.role,
    }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createToken({
        id: isUserExist.id,
        role: isUserExist.role,
    }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
    // save refresh token to database
    yield authentication_model_1.Authentication.updateOne({ user_id: isUserExist.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
    return {
        userId: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.work_email,
        image: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.image,
        accessToken: accessToken,
        refreshToken: refreshToken,
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
        role: loginUser.role,
        accessToken: "",
        refreshToken: "",
    };
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: loginUser.id, role: loginUser.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: loginUser.id, role: loginUser.role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
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
        role: employee.role,
        accessToken: "",
        refreshToken: "",
    };
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: employee.id, role: employee.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: employee.id, role: employee.role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
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
const refreshTokenCache = new node_cache_1.default({ stdTTL: 30 });
// Track recently issued tokens for each user
const userRecentTokensCache = new node_cache_1.default({ stdTTL: 60 });
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    // Check if this exact token has a cached response
    const cached = refreshTokenCache.get(refreshToken);
    if (cached) {
        return cached;
    }
    try {
        // Verify the token is structurally valid
        const decodedToken = jwtTokenHelper_1.jwtHelpers.verifyToken(refreshToken, variables_1.default.jwt_refresh_secret);
        const { id: userId, role } = decodedToken;
        if (!userId) {
            throw new Error("Invalid refresh token - missing user ID");
        }
        // Get user's recent tokens (array of valid tokens)
        let recentTokens = userRecentTokensCache.get(userId) || [];
        // If this token is in the recent tokens list, it's valid even if not the latest
        const isRecentToken = Array.isArray(recentTokens) && recentTokens.includes(refreshToken);
        // Verify token exists in database
        const storedToken = yield authentication_model_1.Authentication.findOne({ user_id: userId });
        if (!storedToken) {
            throw new Error("User not found in authentication records");
        }
        // Accept the token if either:
        // 1. It matches the current database token, OR
        // 2. It's in our list of recently issued tokens for this user
        if (storedToken.refresh_token !== refreshToken && !isRecentToken) {
            console.log("Token mismatch for user:", userId, {
                latestToken: storedToken.refresh_token.substring(0, 20) + "...", // Log partial token for debugging
            });
            // Add the current database token to our recent tokens list
            if (storedToken.refresh_token &&
                !recentTokens.includes(storedToken.refresh_token)) {
                recentTokens = [storedToken.refresh_token, ...recentTokens].slice(0, 5); // Keep last 5 tokens
                userRecentTokensCache.set(userId, recentTokens);
            }
            throw new Error("Invalid refresh token - token mismatch");
        }
        // Generate new tokens
        const newAccessToken = jwtTokenHelper_1.jwtHelpers.createToken({
            id: userId,
            role: role,
        }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
        // @ts-ignore
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: userId, role: role }, variables_1.default.jwt_refresh_secret, { expiresIn: variables_1.default.jwt_refresh_expire });
        // Update the token in database
        // Note: We don't strictly check the previous token anymore to handle race conditions better
        const updatedAuth = yield authentication_model_1.Authentication.findOneAndUpdate({ user_id: userId }, { refresh_token: newRefreshToken }, { new: true });
        if (!updatedAuth) {
            throw new Error("Failed to update token record");
        }
        // Update the recent tokens list for this user
        recentTokens = [newRefreshToken, refreshToken, ...recentTokens].slice(0, 5); // Keep at most 5 recent tokens
        userRecentTokensCache.set(userId, recentTokens);
        const cacheData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
        // Cache responses for both the incoming token and the new token
        refreshTokenCache.set(refreshToken, cacheData);
        refreshTokenCache.set(newRefreshToken, cacheData); // Pre-cache for the new token too
        return cacheData;
    }
    catch (error) {
        // Log the specific error for debugging but don't include sensitive data
        console.error("Refresh token error:", error.message);
        // Rethrow with a consistent user-facing message
        throw new Error("Invalid refresh token");
    }
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
    refreshTokenService: exports.refreshTokenService,
};
//# sourceMappingURL=authentication.service.js.map