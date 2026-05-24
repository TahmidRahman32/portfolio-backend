// routes/resumeRoutes.ts (Express - Unified API)

import { Router } from "express";
import { resumeController } from "./resume.controller";
import auth from "../../middlewares/auth";
// import { createResume, getResume, updateResume, deleteResume } from "../controllers/resumeController";


const router = Router();

// GET /api/v1/resume — fetch entire resume
router.get("/all", resumeController.getResume);

// POST /api/v1/resume — create complete resume (all sections at once)
router.post("/create", resumeController.createResume);

// PUT /api/v1/resume — update complete resume (full replace)
router.put("/", resumeController.updateResume);

// PATCH /api/v1/resume — update resume partially (merge with existing)
// You can use this if you want to support partial updates
router.patch("/", resumeController.updateResume);

// DELETE /api/v1/resume — delete entire resume and all sections
router.delete("/", resumeController.deleteResume);


export { router as resumeRoutes };
