"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const db_1 = require("../../config/db");
const loginWithEmail = async ({ email, password }) => {
    console.log(email, password);
    try {
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
const googleLogin = async (data) => {
    // Implementation for Google login
    let user = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        user = await db_1.prisma.user.create({ data });
    }
    return user;
};
exports.authService = {
    loginWithEmail,
    googleLogin,
};
