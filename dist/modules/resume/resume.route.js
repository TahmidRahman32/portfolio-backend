"use strict";
// routes/resumeRoutes.ts (Express - Unified API)
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeRoutes = void 0;
const express_1 = require("express");
const resume_controller_1 = require("./resume.controller");
// import { createResume, getResume, updateResume, deleteResume } from "../controllers/resumeController";
const router = (0, express_1.Router)();
exports.resumeRoutes = router;
// GET /api/v1/resume — fetch entire resume
router.get("/all", resume_controller_1.resumeController.getResume);
// POST /api/v1/resume — create complete resume (all sections at once)
router.post("/create", resume_controller_1.resumeController.createResume);
// PUT /api/v1/resume — update complete resume (full replace)
router.put("/", resume_controller_1.resumeController.updateResume);
// PATCH /api/v1/resume — update resume partially (merge with existing)
// You can use this if you want to support partial updates
router.patch("/", resume_controller_1.resumeController.updateResume);
// DELETE /api/v1/resume — delete entire resume and all sections
router.delete("/", resume_controller_1.resumeController.deleteResume);
