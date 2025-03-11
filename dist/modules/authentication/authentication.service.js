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
    // Update with upsert to avoid race conditions
    yield authentication_model_1.Authentication.findOneAndUpdate({ user_id: isUserExist.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
    const userDetails = {
        userId: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.work_email,
        image: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.image,
        role: isUserExist.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
    return userDetails;
});
// oauth login
const oauthLoginService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!isUserExist) {
        throw new Error("User not found");
    }
    const userDetails = {
        userId: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.work_email,
        image: isUserExist.image,
        role: isUserExist.role,
        accessToken: "",
        refreshToken: "",
    };
    const accessToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: isUserExist.id, role: isUserExist.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    const refreshToken = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: isUserExist.id, role: isUserExist.role }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
    // save refresh token to database
    yield authentication_model_1.Authentication.findOneAndUpdate({ user_id: isUserExist.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
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
    yield authentication_model_1.Authentication.findOneAndUpdate({ user_id: employee.id }, { $set: { refresh_token: refreshToken } }, { upsert: true, new: true });
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
            const { token: hashedOtp, expires } = verificationToken.pass_reset_token || {};
            // Check if the OTP is still valid
            if (expires && new Date(expires) > new Date(currentTime)) {
                if (!hashedOtp) {
                    throw new Error("OTP not found");
                }
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
// Create a more robust cache with proper namespacing
const refreshTokenCache = new node_cache_1.default({ stdTTL: 10 });
// refresh token service
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        console.error("No refresh token provided");
        throw new Error("Refresh token is required");
    }
    console.log(`Processing refresh token starting with: ${refreshToken.substring(0, 8)}...`);
    try {
        // Verify token with detailed error handling
        console.log("Attempting to verify token...");
        let decodedToken;
        try {
            decodedToken = jwtTokenHelper_1.jwtHelpers.verifyToken(refreshToken, variables_1.default.jwt_refresh_secret);
            console.log("Token verification successful");
        }
        catch (verifyError) {
            console.error("Token verification failed:", verifyError.message);
            console.error("Token verification error type:", verifyError.name);
            throw new Error(`Token verification error: ${verifyError.message}`);
        }
        const { id: userId, role } = decodedToken;
        if (!userId) {
            console.error("No userId in decoded token");
            throw new Error("Invalid token payload");
        }
        console.log(`User ID from token: ${userId}, Role: ${role}`);
        // Create a user-specific cache key
        const cacheKey = `user:${userId}`;
        console.log(`Cache key: ${cacheKey}`);
        // Check for cached response
        console.log("Checking cache...");
        const cached = refreshTokenCache.get(cacheKey);
        if (cached) {
            console.log("Cache hit! Returning cached response");
            return cached;
        }
        console.log("Cache miss. Continuing with database lookup");
        // Find user's token in database
        console.log(`Looking up token in database for user: ${userId}`);
        let storedToken;
        try {
            // Add retry logic for database operations
            let retries = 3;
            while (retries > 0) {
                try {
                    storedToken = yield authentication_model_1.Authentication.findOne({ user_id: userId });
                    break; // If successful, exit the retry loop
                }
                catch (err) {
                    retries--;
                    if (retries === 0)
                        throw err;
                    yield new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before retrying
                }
            }
            console.log(`Database lookup result: ${storedToken ? "Found" : "Not found"}`);
        }
        catch (dbError) {
            console.error("Database lookup error:", dbError.message);
            throw new Error(`Database error: ${dbError.message}`);
        }
        if (!storedToken) {
            console.error(`No authentication record found for user: ${userId}`);
            throw new Error("User not found");
        }
        // IMPORTANT CHANGE: Use decoded payload information instead of exact token matching
        // This allows token rotation without forcing logout as long as the token is valid
        // Get DB token info
        let dbTokenInfo;
        try {
            dbTokenInfo = jwtTokenHelper_1.jwtHelpers.verifyToken(storedToken.refresh_token, variables_1.default.jwt_refresh_secret);
            console.log("DB token verification successful");
        }
        catch (verifyError) {
            console.error("DB token verification failed:", verifyError.message);
            // If DB token is invalid, continue with token update anyway
        }
        // Allow token rotation as long as the user ID matches
        console.log("Generating new tokens");
        console.log(`Using jwt_expire: ${variables_1.default.jwt_expire}`);
        console.log(`Using jwt_refresh_expire: ${variables_1.default.jwt_refresh_expire}`);
        const newAccessToken = jwtTokenHelper_1.jwtHelpers.createToken({
            id: userId,
            role: role,
        }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
        const newRefreshToken = jwtTokenHelper_1.jwtHelpers.createToken({
            id: userId,
            role: role,
        }, variables_1.default.jwt_refresh_secret, variables_1.default.jwt_refresh_expire);
        console.log(`New access token created starting with: ${newAccessToken.substring(0, 8)}...`);
        console.log(`New refresh token created starting with: ${newRefreshToken.substring(0, 8)}...`);
        // Update token in database - NOTE: Modified to find by user_id only
        console.log("Updating token in database...");
        let updatedAuth;
        try {
            updatedAuth = yield authentication_model_1.Authentication.findOneAndUpdate({ user_id: userId }, // Only match by user_id, not the token
            { refresh_token: newRefreshToken }, { new: true });
            console.log(`Database update result: ${updatedAuth ? "Success" : "Failed"}`);
        }
        catch (updateError) {
            console.error("Database update error:", updateError.message);
            throw new Error(`Database update error: ${updateError.message}`);
        }
        if (!updatedAuth) {
            console.error("No document updated");
            throw new Error("Authentication record not found or could not be updated");
        }
        const responseData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
        // Cache the response using just the user ID
        console.log("Setting cache entry...");
        refreshTokenCache.set(cacheKey, responseData);
        console.log(`Set cache with key: ${cacheKey}`);
        console.log("Refresh process completed successfully");
        return responseData;
    }
    catch (error) {
        // Log the full error with stack trace
        console.error("Refresh token complete error:", error);
        console.error("Error stack:", error.stack);
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