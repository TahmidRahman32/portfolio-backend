"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeRoutes = void 0;
// routes/resume.routes.ts
const express_1 = require("express");
const resume_controller_1 = require("./resume.controller");
const router = (0, express_1.Router)();
exports.resumeRoutes = router;
// Resume CRUD routes
router.post("/", resume_controller_1.resumeController.createResume.bind(resume_controller_1.resumeController));
router.post("/frontend", resume_controller_1.resumeController.createResumeFromFrontend.bind(resume_controller_1.resumeController));
router.get("/", resume_controller_1.resumeController.getAllResumes.bind(resume_controller_1.resumeController));
router.get("/user/:userId", resume_controller_1.resumeController.getUserResumes.bind(resume_controller_1.resumeController));
router.get("/:id", resume_controller_1.resumeController.getResume.bind(resume_controller_1.resumeController));
router.put("/:id", resume_controller_1.resumeController.updateResume.bind(resume_controller_1.resumeController));
router.delete("/:id", resume_controller_1.resumeController.deleteResume.bind(resume_controller_1.resumeController));
router.post("/:id/duplicate", resume_controller_1.resumeController.duplicateResume.bind(resume_controller_1.resumeController));
