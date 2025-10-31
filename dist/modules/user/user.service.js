"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (payload) => {
    try {
        // Hash password before creating user
        if (payload.password) {
            const saltRounds = 12;
            payload.password = await bcrypt_1.default.hash(payload.password, saltRounds);
        }
        const createdUser = await db_1.prisma.user.create({
            data: payload,
        });
        return createdUser;
    }
    catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
};
const getAllUsers = async () => {
    const result = await db_1.prisma.user.findMany({
        select: {
            id: true,
            first_name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
const getSingleUser = async (id) => {
    const result = await db_1.prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            first_name: true,
            email: true,
            role: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            status: true,
        },
    });
    return result;
};
const updateUser = async (id, payload) => {
    const result = await db_1.prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};
const deleteUser = async (id) => {
    const result = await db_1.prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
