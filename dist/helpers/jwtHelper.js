"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
    return token;
};
const verifyToken = (token, secret) => {
    try {
        if (!token) {
            throw new Error("Token is required");
        }
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        console.error("Token verification error:", error);
        throw new Error("Invalid or expired token");
    }
};
// Additional helper to safely extract accessToken
const extractAccessToken = (decoded) => {
    if (!decoded || typeof decoded !== "object") {
        throw new Error("Invalid token payload");
    }
    if (!decoded.accessToken) {
        throw new Error("accessToken not found in token payload");
    }
    return decoded.accessToken;
};
exports.jwtHelper = {
    generateToken,
    verifyToken,
    extractAccessToken, // New helper
};
