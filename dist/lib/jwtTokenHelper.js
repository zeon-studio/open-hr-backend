"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// create token
const createToken = (payload, secret, expires, timeStamp) => {
    const enhancedPayload = {
        id: payload === null || payload === void 0 ? void 0 : payload.id,
        role: payload === null || payload === void 0 ? void 0 : payload.role,
        at: timeStamp || Date.now().toString(),
        iat: Math.floor(Date.now() / 1000),
    };
    return jsonwebtoken_1.default.sign(enhancedPayload, secret, {
        expiresIn: expires ? expires : "24h",
        issuer: "open-hr-backend",
    });
};
// delete token
const deleteToken = (token, secret) => {
    return jsonwebtoken_1.default.sign({ id: token }, secret, {
        expiresIn: "0s",
    });
};
// verify token
const verifyToken = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, {
            issuer: "open-hr-backend",
        });
        // Additional validation
        if (!decoded.id || !decoded.role) {
            throw new Error("Invalid token structure");
        }
        // Check if token is not too old (additional security layer)
        if (decoded.iat) {
            const tokenAge = Date.now() - decoded.iat * 1000;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            if (tokenAge > maxAge) {
                throw new Error("Token too old");
            }
        }
        return decoded;
    }
    catch (error) {
        throw new Error("Token verification failed");
    }
};
exports.jwtHelpers = {
    createToken,
    deleteToken,
    verifyToken,
};
//# sourceMappingURL=jwtTokenHelper.js.map