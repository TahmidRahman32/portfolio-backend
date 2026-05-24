import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

// router.get("/", UserController.getAllUsers);

// router.get("/:id", UserController.getSingleUser);

router.post("/login", authController.loginWithEmail);
router.post("/google", authController.googleLogin);

// router.patch("/:id", UserController.updateUser);

// router.delete("/:id", UserController.deleteUser);

export const authRouter = router;
