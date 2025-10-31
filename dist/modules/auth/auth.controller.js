"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const loginWithEmail = async (req, res) => {
    try {
        const result = await auth_service_1.authService.loginWithEmail(req.body);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid user",
            });
        }
        if (result.password !== req.body.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const googleLogin = async (req, res) => {
    try {
        const result = await auth_service_1.authService.googleLogin(req.body);
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.authController = {
    loginWithEmail,
    googleLogin,
};
