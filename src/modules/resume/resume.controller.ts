// controllers/resume.controller.ts
import { Request, Response } from "express";
import { CreateResumeDto, UpdateResumeDto, mapFrontendToBackend } from "../../Type/resume";
import { resumeService } from "./resume.service";


export class ResumeController {
   async createResume(req: Request, res: Response) {
      try {
         if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
               success: false,
               message: "Invalid request body",
            });
         }

         // Support both direct DTO and frontend format
         let createData: CreateResumeDto;

         if (req.body.personalInfo) {
            // Frontend format detected - convert to backend DTO
            const { resumeData, title, userId, template } = req.body;

            if (!resumeData || !title || !userId) {
               return res.status(400).json({
                  success: false,
                  message: "resumeData, title, and userId are required for frontend format",
               });
            }

            createData = mapFrontendToBackend(resumeData, title, userId, template);
         } else {
            // Direct DTO format
            createData = req.body as CreateResumeDto;
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

         const resume = await resumeService.createResume(createData);

         return res.status(201).json({
            success: true,
            data: resume,
            message: "Resume created successfully",
         });
      } catch (error) {
         console.error("Create resume error:", error);
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
         });
      }
   }

   async createResumeFromFrontend(req: Request, res: Response) {
      try {
         const { resumeData, title, userId, template } = req.body;

         if (!resumeData || !title || !userId) {
            return res.status(400).json({
               success: false,
               message: "resumeData, title, and userId are required",
            });
         }

         const createData = mapFrontendToBackend(resumeData, title, userId, template);

         const resume = await resumeService.createResume(createData);

         return res.status(201).json({
            success: true,
            data: resume,
            message: "Resume created successfully from frontend data",
         });
      } catch (error) {
         console.error("Create resume from frontend error:", error);
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
         });
      }
   }

   async getResume(req: Request, res: Response) {
      try {
         const { id } = req.params;

         if (!id || typeof id !== "string") {
            return res.status(400).json({
               success: false,
               message: "Valid resume ID is required",
            });
         }

         const resume = await resumeService.getResumeById(id);

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
      } catch (error) {
         console.error("Get resume error:", error);
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
         });
      }
   }

   async getUserResumes(req: Request, res: Response) {
      try {
         const { userId } = req.params;

         if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
               success: false,
               message: "Valid user ID is required",
            });
         }

         const resumes = await resumeService.getUserResumes(parseInt(userId));

         return res.json({
            success: true,
            data: resumes,
            count: resumes.length,
         });
      } catch (error) {
         console.error("Get user resumes error:", error);
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
         });
      }
   }

   async getAllResumes(req: Request, res: Response) {
      try {
         const resumes = await resumeService.getAllResumes();

         return res.json({
            success: true,
            data: resumes,
            count: resumes.length,
         });
      } catch (error) {
         console.error("Get all resumes error:", error);
         return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
         });
      }
   }

   async updateResume(req: Request, res: Response) {
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

         let updateData: UpdateResumeDto;

         if (req.body.personalInfo) {
            // Frontend format detected - convert to backend DTO
            const { resumeData, title, template } = req.body;

            if (!resumeData || !title) {
               return res.status(400).json({
                  success: false,
                  message: "resumeData and title are required for frontend format",
               });
            }

            const createData = mapFrontendToBackend(
               resumeData,
               title,
               0, // userId not needed for update
               template
            );

            updateData = {
               id,
               ...createData,
            };
         } else {
            // Direct DTO format
            updateData = {
               id,
               ...req.body,
            };
         }

         const resume = await resumeService.updateResume(updateData);

         return res.json({
            success: true,
            data: resume,
            message: "Resume updated successfully",
         });
      } catch (error) {
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

   async deleteResume(req: Request, res: Response) {
      try {
         const { id } = req.params;

         if (!id || typeof id !== "string") {
            return res.status(400).json({
               success: false,
               message: "Valid resume ID is required",
            });
         }

         await resumeService.deleteResume(id);

         return res.json({
            success: true,
            message: "Resume deleted successfully",
         });
      } catch (error) {
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

   async duplicateResume(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { title, userId } = req.body;

         if (!id || typeof id !== "string") {
            return res.status(400).json({
               success: false,
               message: "Valid resume ID is required",
            });
         }

         const resume = await resumeService.duplicateResume(id, title, userId);

         return res.status(201).json({
            success: true,
            data: resume,
            message: "Resume duplicated successfully",
         });
      } catch (error) {
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

export const resumeController = new ResumeController();
