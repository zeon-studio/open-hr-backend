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
exports.authenticationService = void 0;
const variables_1 = __importDefault(require("../../config/variables"));
const jwtTokenHelper_1 = require("../../lib/jwtTokenHelper");
const mailSender_1 = require("../../lib/mailSender");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const employee_model_1 = require("../employee/employee.model");
const authentication_model_1 = require("./authentication.model");
// Helper function to create JWT token
const createJwtToken = (id, role) => {
    return jwtTokenHelper_1.jwtHelpers.createToken({ id, role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
};
// Helper function to format user details
const formatUserDetails = (user, accessToken) => ({
    userId: user.id,
    name: user.name,
    email: user.work_email,
    image: user.image,
    role: user.role,
    accessToken,
});
// password login
const passwordLoginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!user)
        throw new Error("User not found");
    if (!user.password) {
        throw new Error("Password not set for this user. Please use OAuth login or reset your password.");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }
    const accessToken = createJwtToken(user.id, user.role);
    return formatUserDetails(user, accessToken);
});
// oauth login
const oauthLoginService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error("Email is required");
    }
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!user) {
        throw new Error("User not found");
    }
    const accessToken = createJwtToken(user.id, user.role);
    return formatUserDetails(user, accessToken);
});
// token login
const tokenLoginService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new Error("Token is required");
    }
    const decodedToken = jwtTokenHelper_1.jwtHelpers.verifyToken(token, variables_1.default.jwt_secret);
    const user = yield employee_model_1.Employee.findOne({ id: decodedToken.id });
    if (!user) {
        throw new Error("User not found");
    }
    const accessToken = createJwtToken(user.id, user.role);
    return formatUserDetails(user, accessToken);
});
// user verification for password recovery
const verifyUserService = (email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !currentTime) {
        throw new Error("Email and current time are required");
    }
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!user) {
        throw new Error("User not found");
    }
    yield sendVerificationOtp(user.id, email, currentTime);
    return user;
});
// send verification otp
const sendVerificationOtp = (id, email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const expiringTime = new Date(new Date(currentTime).getTime() + 5 * 60000).toISOString();
    const userVerification = {
        pass_reset_token: {
            token: yield bcrypt_1.default.hash(otp, variables_1.default.salt),
            expires: expiringTime,
        },
    };
    yield authentication_model_1.Authentication.updateOne({ user_id: id }, { $set: userVerification }, { upsert: true });
    yield mailSender_1.mailSender.otpSender(email, otp);
});
// verify otp
const verifyOtpService = (email, otp, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otp || !email || !currentTime) {
        throw new Error("Email, OTP, and current time are required");
    }
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!user) {
        throw new Error("User not found");
    }
    const verificationToken = yield authentication_model_1.Authentication.findOne({ user_id: user.id });
    if (!(verificationToken === null || verificationToken === void 0 ? void 0 : verificationToken.pass_reset_token)) {
        throw new Error("OTP not found or expired");
    }
    const { token: hashedOtp, expires } = verificationToken.pass_reset_token;
    if (!hashedOtp || !expires || new Date(expires) <= new Date(currentTime)) {
        throw new Error("OTP expired");
    }
    const isOtpValid = yield bcrypt_1.default.compare(otp, hashedOtp);
    if (!isOtpValid) {
        throw new Error("Incorrect OTP");
    }
    // Update user verification status
    yield employee_model_1.Employee.updateOne({ id: user.id }, { $set: { verified: true } });
});
// reset password
const resetPasswordService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const hashedPassword = yield bcrypt_1.default.hash(password, variables_1.default.salt);
        const updatedUser = yield employee_model_1.Employee.findOneAndUpdate({ work_email: email }, { $set: { password: hashedPassword } }, { session, new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
// update password
const updatePasswordService = (id, current_password, new_password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !current_password || !new_password) {
        throw new Error("All fields are required");
    }
    const user = yield employee_model_1.Employee.findOne({ id });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.password) {
        const isMatch = yield bcrypt_1.default.compare(current_password, user.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }
    }
    const hashedPassword = yield bcrypt_1.default.hash(new_password, variables_1.default.salt);
    yield employee_model_1.Employee.updateOne({ id }, { $set: { password: hashedPassword } });
});
// reset password otp
const resetPasswordOtpService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new Error("User ID is required");
    }
    const userOtp = yield authentication_model_1.Authentication.findOne({ user_id: id });
    if (!userOtp) {
        throw new Error("OTP record not found");
    }
    return userOtp;
});
// resend verification token
const resendOtpService = (email, currentTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !currentTime) {
        throw new Error("Email and current time are required");
    }
    const user = yield employee_model_1.Employee.findOne({ work_email: email });
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw new Error("User not found");
    }
    yield sendVerificationOtp(user.id, email, currentTime);
});
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
};
//# sourceMappingURL=authentication.service.js.map