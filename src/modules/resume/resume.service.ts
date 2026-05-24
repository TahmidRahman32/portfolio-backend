

import { PrismaClient } from "@prisma/client";
import { ResumePayload } from "./resume.constant";

const prisma = new PrismaClient();




// ─── CREATE Resume Service ────────────────────────────────────────────────────

/**
 * Create a complete resume with all sections
 * Validates that resume doesn't already exist
 */
export async function createResumeService(userId: string, payload: ResumePayload) {
   // Validate required fields
   if (!payload.summary || payload.summary.trim().length === 0) {
      throw new Error("Summary is required");
   }

   if (!payload.personalInfo) {
      throw new Error("Personal info is required");
   }

   // Check if resume already exists
   const existing = await prisma.resume.findUnique({
      where: { userId },
   });

   if (existing) {
      throw new Error("Resume already exists. Use update or delete first.");
   }

   // Create resume with all related data
   const resume = await prisma.resume.create({
      data: {
         userId,
         summary: payload.summary,
         personalInfo: {
            create: payload.personalInfo,
         },
         education: payload.education?.length
            ? {
                 create: payload.education.map(({ id, ...rest }) => rest),
              }
            : undefined,
         workExperience: payload.workExperience?.length
            ? {
                 create: payload.workExperience.map(({ id, ...rest }) => rest),
              }
            : undefined,
         skills: payload.skills?.length
            ? {
                 create: payload.skills.map(({ id, ...rest }) => rest),
              }
            : undefined,
         projects: payload.projects?.length
            ? {
                 create: payload.projects.map(({ id, ...rest }) => ({
                    ...rest,
                    technologies: JSON.stringify(rest.technologies),
                 })),
              }
            : undefined,
         certifications: payload.certifications?.length
            ? {
                 create: payload.certifications.map(({ id, ...rest }) => rest),
              }
            : undefined,
      },
      include: {
         personalInfo: true,
         education: true,
         workExperience: true,
         skills: true,
         projects: true,
         certifications: true,
      },
   });

   return formatResumeResponse(resume);
}

// ─── GET Resume Service ──────────────────────────────────────────────────────

/**
 * Fetch complete resume for a user
 * Returns null if resume doesn't exist
 */
export async function getResumeService(userId: string) {
   const resume = await prisma.resume.findUnique({
      where: { userId },
      include: {
         personalInfo: true,
         education: { orderBy: { startDate: "desc" } },
         workExperience: { orderBy: { startDate: "desc" } },
         skills: { orderBy: { category: "asc" } },
         projects: { orderBy: { createdAt: "desc" } },
         certifications: { orderBy: { issueDate: "desc" } },
      },
   });

   if (!resume) {
      return null;
   }

   return formatResumeResponse(resume);
}

// ─── UPDATE Resume Service ──────────────────────────────────────────────────

/**
 * Update resume (full or partial)
 * Supports partial updates - only update sections provided
 * Replaces entire arrays for education, work experience, skills, projects, certifications
 */
export async function updateResumeService(userId: string, payload: Partial<ResumePayload>) {
   // Get existing resume
   const existingResume = await prisma.resume.findUnique({
      where: { userId },
   });

   if (!existingResume) {
      throw new Error("Resume not found");
   }

   // Build update data dynamically
   const updateData: any = {};

   // Update summary if provided
   if (payload.summary !== undefined) {
      if (!payload.summary.trim()) {
         throw new Error("Summary cannot be empty");
      }
      updateData.summary = payload.summary;
   }

   // Update personalInfo if provided
   if (payload.personalInfo) {
      updateData.personalInfo = {
         update: payload.personalInfo,
      };
   }

   // Replace education (delete old, create new)
   if (payload.education !== undefined) {
      updateData.education = {
         deleteMany: {},
         create: payload.education.map(({ id, ...rest }) => rest),
      };
   }

   // Replace workExperience (delete old, create new)
   if (payload.workExperience !== undefined) {
      updateData.workExperience = {
         deleteMany: {},
         create: payload.workExperience.map(({ id, ...rest }) => rest),
      };
   }

   // Replace skills (delete old, create new)
   if (payload.skills !== undefined) {
      updateData.skills = {
         deleteMany: {},
         create: payload.skills.map(({ id, ...rest }) => rest),
      };
   }

   // Replace projects (delete old, create new)
   if (payload.projects !== undefined) {
      updateData.projects = {
         deleteMany: {},
         create: payload.projects.map(({ id, ...rest }) => ({
            ...rest,
            technologies: JSON.stringify(rest.technologies),
         })),
      };
   }

   // Replace certifications (delete old, create new)
   if (payload.certifications !== undefined) {
      updateData.certifications = {
         deleteMany: {},
         create: payload.certifications.map(({ id, ...rest }) => rest),
      };
   }

   const resume = await prisma.resume.update({
      where: { userId },
      data: updateData,
      include: {
         personalInfo: true,
         education: { orderBy: { startDate: "desc" } },
         workExperience: { orderBy: { startDate: "desc" } },
         skills: { orderBy: { category: "asc" } },
         projects: { orderBy: { createdAt: "desc" } },
         certifications: { orderBy: { issueDate: "desc" } },
      },
   });

   return formatResumeResponse(resume);
}

// ─── DELETE Resume Service ──────────────────────────────────────────────────

/**
 * Delete entire resume and all related sections
 * Cascade delete handles all related records automatically
 */
export async function deleteResumeService(userId: string) {
   // Check if resume exists
   const existingResume = await prisma.resume.findUnique({
      where: { userId },
   });

   if (!existingResume) {
      throw new Error("Resume not found");
   }

   // Delete entire resume (cascade delete handles all related records)
   await prisma.resume.delete({
      where: { userId },
   });

   return { success: true };
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Format database response to match frontend data structure
 * Parses JSON strings back to arrays
 */
export function formatResumeResponse(resume: any) {
   return {
      id: resume.id,
      userId: resume.userId,
      summary: resume.summary,
      personalInfo: resume.personalInfo || {},
      education: resume.education || [],
      workExperience: resume.workExperience || [],
      skills: resume.skills || [],
      projects: (resume.projects || []).map((p: any) => ({
         ...p,
         technologies: safeParseJSON(p.technologies, []),
      })),
      certifications: resume.certifications || [],
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
   };
}

/**
 * Safely parse JSON string, return default value on failure
 */
export function safeParseJSON(json: string | null, defaultValue: any = []) {
   if (!json) return defaultValue;
   try {
      return JSON.parse(json);
   } catch {
      return defaultValue;
   }
}

/**
 * Get resume existence check (useful for middleware or other services)
 */
export async function resumeExists(userId: string): Promise<boolean> {
   const resume = await prisma.resume.findUnique({
      where: { userId },
      select: { id: true },
   });
   return !!resume;
}

export const resumeService = {
      createResumeService,
      getResumeService,
      updateResumeService,
      deleteResumeService,
     
};