"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const createUser = async (req, res) => {
    try {
        const result = await user_service_1.UserService.createUser(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
const getAllUsers = async (req, res) => {
    try {
        const result = await user_service_1.UserService.getAllUsers();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await user_service_1.UserService.getSingleUser(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
const updateUser = async (req, res) => {
    try {
        const result = await user_service_1.UserService.updateUser(req.params.id, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
const deleteUser = async (req, res) => {
    try {
        const result = await user_service_1.UserService.deleteUser(req.params.id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
