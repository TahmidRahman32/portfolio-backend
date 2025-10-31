"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeController = exports.ResumeController = void 0;
const resume_1 = require("../../Type/resume");
const resume_service_1 = require("./resume.service");
class ResumeController {
    async createResume(req, res) {
        try {
            if (!req.body || typeof req.body !== "object") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                });
            }
            // Support both direct DTO and frontend format
            let createData;
            if (req.body.personalInfo) {
                // Frontend format detected - convert to backend DTO
                const { resumeData, title, userId, template } = req.body;
                if (!resumeData || !title || !userId) {
                    return res.status(400).json({
                        success: false,
                        message: "resumeData, title, and userId are required for frontend format",
                    });
                }
                createData = (0, resume_1.mapFrontendToBackend)(resumeData, title, userId, template);
            }
            else {
                // Direct DTO format
                createData = req.body;
            }
            // Validate required fields
            if (!createData.title || !createData.fullName || !createData.email || !createData.phone) {
                return res.status(400).json({
                    success: false,
                    message: "Title, full name, email, and phone are required",
                });
            }
            if (!createData.userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const resume = await resume_service_1.resumeService.createResume(createData);
            return res.status(201).json({
                success: true,
                data: resume,
                message: "Resume created successfully",
            });
        }
        catch (error) {
            console.error("Create resume error:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async createResumeFromFrontend(req, res) {
        try {
            const { resumeData, title, userId, template } = req.body;
            if (!resumeData || !title || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "resumeData, title, and userId are required",
                });
            }
            const createData = (0, resume_1.mapFrontendToBackend)(resumeData, title, userId, template);
            const resume = await resume_service_1.resumeService.createResume(createData);
            return res.status(201).json({
                success: true,
                data: resume,
                message: "Resume created successfully from frontend data",
            });
        }
        catch (error) {
            console.error("Create resume from frontend error:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async getResume(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid resume ID is required",
                });
            }
            const resume = await resume_service_1.resumeService.getResumeById(id);
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found",
                });
            }
            return res.json({
                success: true,
                data: resume,
            });
        }
        catch (error) {
            console.error("Get resume error:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async getUserResumes(req, res) {
        try {
            const { userId } = req.params;
            if (!userId || isNaN(parseInt(userId))) {
                return res.status(400).json({
                    success: false,
                    message: "Valid user ID is required",
                });
            }
            const resumes = await resume_service_1.resumeService.getUserResumes(parseInt(userId));
            return res.json({
                success: true,
                data: resumes,
                count: resumes.length,
            });
        }
        catch (error) {
            console.error("Get user resumes error:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async getAllResumes(req, res) {
        try {
            const resumes = await resume_service_1.resumeService.getAllResumes();
            return res.json({
                success: true,
                data: resumes,
                count: resumes.length,
            });
        }
        catch (error) {
            console.error("Get all resumes error:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async updateResume(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid resume ID is required",
                });
            }
            if (!req.body || typeof req.body !== "object") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request body",
                });
            }
            let updateData;
            if (req.body.personalInfo) {
                // Frontend format detected - convert to backend DTO
                const { resumeData, title, template } = req.body;
                if (!resumeData || !title) {
                    return res.status(400).json({
                        success: false,
                        message: "resumeData and title are required for frontend format",
                    });
                }
                const createData = (0, resume_1.mapFrontendToBackend)(resumeData, title, 0, // userId not needed for update
                template);
                updateData = {
                    id,
                    ...createData,
                };
            }
            else {
                // Direct DTO format
                updateData = {
                    id,
                    ...req.body,
                };
            }
            const resume = await resume_service_1.resumeService.updateResume(updateData);
            return res.json({
                success: true,
                data: resume,
                message: "Resume updated successfully",
            });
        }
        catch (error) {
            console.error("Update resume error:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async deleteResume(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid resume ID is required",
                });
            }
            await resume_service_1.resumeService.deleteResume(id);
            return res.json({
                success: true,
                message: "Resume deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete resume error:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async duplicateResume(req, res) {
        try {
            const { id } = req.params;
            const { title, userId } = req.body;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid resume ID is required",
                });
            }
            const resume = await resume_service_1.resumeService.duplicateResume(id, title, userId);
            return res.status(201).json({
                success: true,
                data: resume,
                message: "Resume duplicated successfully",
            });
        }
        catch (error) {
            console.error("Duplicate resume error:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.ResumeController = ResumeController;
exports.resumeController = new ResumeController();
