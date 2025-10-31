// routes/resume.routes.ts
import { Router } from "express";
import { resumeController } from "./resume.controller";


const router = Router();

// Resume CRUD routes
router.post("/", resumeController.createResume.bind(resumeController));
router.post("/frontend", resumeController.createResumeFromFrontend.bind(resumeController));
router.get("/", resumeController.getAllResumes.bind(resumeController));
router.get("/user/:userId", resumeController.getUserResumes.bind(resumeController));
router.get("/:id", resumeController.getResume.bind(resumeController));
router.put("/:id", resumeController.updateResume.bind(resumeController));
router.delete("/:id", resumeController.deleteResume.bind(resumeController));
router.post("/:id/duplicate", resumeController.duplicateResume.bind(resumeController));

export { router as resumeRoutes };
