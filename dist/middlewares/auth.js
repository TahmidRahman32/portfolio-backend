"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// import ApiError from "../errors/ApiError";
// import { jwtHelper } from "../helper/jwtHelper";
// import { jwtHelper } from "../helpers/jwtHelper";
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../Errors/ApiError"));
const jwtHelper_1 = require("../helpers/jwtHelper");
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            // const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "") || req.body?.accessToken || req.query?.accessToken;
            // if (!token) {
            //    throw new ApiError(httpStatus.UNAUTHORIZED, "No access token provided");
            // }
            let token;
            // 1. From cookies
            if (req.cookies?.accessToken) {
                token = req.cookies.accessToken;
            }
            // 2. From Authorization header
            else if (req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "No access token provided");
            }
            const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            // Check if verifyUser is valid
            if (!verifyUser || typeof verifyUser !== "object") {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token payload");
            }
            req.user = verifyUser;
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Insufficient permissions");
            }
            next();
        }
        catch (err) {
            // Handle specific JWT errors
            if (err instanceof Error) {
                if (err.name === "JsonWebTokenError") {
                    next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token"));
                }
                else if (err.name === "TokenExpiredError") {
                    next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Token expired"));
                }
                else {
                    next(err);
                }
            }
            else {
                next(new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Authentication failed"));
            }
        }
    };
};
exports.default = auth;
