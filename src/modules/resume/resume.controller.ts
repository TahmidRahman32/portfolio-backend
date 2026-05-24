import { Request, Response } from "express";
import { createResumeService, deleteResumeService, getResumeService, updateResumeService } from "./resume.service";
import { ResumePayload } from "./resume.constant";

declare global {
   namespace Express {
      interface Request {
         userId?: string;
      }
   }
}

// ─── Error Response Helper ────────────────────────────────────────────────────

/**
 * Determine HTTP status code based on error message
 */
function getStatusCode(errorMessage: string): number {
   if (errorMessage.includes("Unauthorized")) return 401;
   if (errorMessage.includes("not found")) return 404;
   if (errorMessage.includes("already exists")) return 409;
   if (errorMessage.includes("required")) return 400;
   if (errorMessage.includes("cannot be")) return 400;
   return 500;
}

// ─── CREATE Resume Controller ─────────────────────────────────────────────────

/**
 * POST /api/v1/resume
 * Create a complete resume with all sections
 */
async function createResume(req: Request, res: Response) {
   try {
      const userId = req.userId;

      // Authenticate user
      if (!userId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      // Validate request body
      const payload: ResumePayload = req.body;
      if (!payload) {
         return res.status(400).json({
            success: false,
            message: "Request body is required",
         });
      }

      // Call service
      const resume = await createResumeService(userId, payload);

      return res.status(201).json({
         success: true,
         message: "Resume created successfully",
         data: resume,
      });
   } catch (error) {
      const message = (error as Error).message;
      const statusCode = getStatusCode(message);

      console.error("createResume error:", error);

      return res.status(statusCode).json({
         success: false,
         message: message || "Failed to create resume",
      });
   }
}

// ─── GET Resume Controller ───────────────────────────────────────────────────

/**
 * GET /api/v1/resume
 * Fetch the complete resume for authenticated user
 */
async function getResume(req: Request, res: Response) {
   try {
      const userId = req.userId;

      // Authenticate user
      if (!userId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      // Call service
      const resume = await getResumeService(userId);

      // Handle not found
      if (!resume) {
         return res.status(404).json({
            success: false,
            message: "Resume not found. Create one first using POST /resume",
         });
      }

      return res.status(200).json({
         success: true,
         message: "Resume fetched successfully",
         data: resume,
      });
   } catch (error) {
      const message = (error as Error).message;
      const statusCode = getStatusCode(message);

      console.error("getResume error:", error);

      return res.status(statusCode).json({
         success: false,
         message: message || "Failed to fetch resume",
      });
   }
}

// ─── UPDATE Resume Controller ─────────────────────────────────────────────────

/**
 * PUT /api/v1/resume (or PATCH)
 * Update entire resume with all sections
 * Supports partial updates - only sends sections you want to update
 */
async function updateResume(req: Request, res: Response) {
   try {
      const userId = req.userId;

      // Authenticate user
      if (!userId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      // Validate request body
      const payload: Partial<ResumePayload> = req.body;
      if (!payload || Object.keys(payload).length === 0) {
         return res.status(400).json({
            success: false,
            message: "Request body with at least one field is required",
         });
      }

      // Call service
      const resume = await updateResumeService(userId, payload);

      return res.status(200).json({
         success: true,
         message: "Resume updated successfully",
         data: resume,
      });
   } catch (error) {
      const message = (error as Error).message;
      const statusCode = getStatusCode(message);

      console.error("updateResume error:", error);

      return res.status(statusCode).json({
         success: false,
         message: message || "Failed to update resume",
      });
   }
}

// ─── DELETE Resume Controller ─────────────────────────────────────────────────

/**
 * DELETE /api/v1/resume
 * Delete entire resume and all related sections
 * This is permanent and cannot be undone
 */
async function deleteResume(req: Request, res: Response) {
   try {
      const userId = req.userId;

      // Authenticate user
      if (!userId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      // Call service
      await deleteResumeService(userId);

      return res.status(200).json({
         success: true,
         message: "Resume deleted permanently",
         data: null,
      });
   } catch (error) {
      const message = (error as Error).message;
      const statusCode = getStatusCode(message);

      console.error("deleteResume error:", error);

      return res.status(statusCode).json({
         success: false,
         message: message || "Failed to delete resume",
      });
   }
}

export const resumeController = {
   createResume,
   getResume,
   deleteResume,
   updateResume,
};
