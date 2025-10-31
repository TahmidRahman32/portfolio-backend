"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
// router.get("/", UserController.getAllUsers);
// router.get("/:id", UserController.getSingleUser);
router.post("/", auth_controller_1.authController.loginWithEmail);
router.post("/google", auth_controller_1.authController.googleLogin);
// router.patch("/:id", UserController.updateUser);
// router.delete("/:id", UserController.deleteUser);
exports.authRouter = router;
