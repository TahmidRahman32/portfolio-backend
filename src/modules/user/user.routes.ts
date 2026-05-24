import express from "express";
import { UserController } from "./user.controller";


const router = express.Router();

router.get("/all", UserController.getAllUsers);

router.get("/:id", UserController.getSingleUser);

router.post("/",  UserController.createUser);

router.patch("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export const userRouter = router;
