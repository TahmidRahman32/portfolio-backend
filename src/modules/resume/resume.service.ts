// services/resume.service.ts
import { PrismaClient } from "@prisma/client";
import { CreateResumeDto, UpdateResumeDto, ResumeResponse } from "../../Type/resume";

const prisma = new PrismaClient();

export class ResumeService {
   async createResume(data: CreateResumeDto): Promise<ResumeResponse> {
      try {
         const resume = await prisma.resume.create({
            data: {
               title: data.title,
               template: data.template || "modern",
               // Personal info fields
               fullName: data.fullName,
               email: data.email,
               phone: data.phone,
               address: data.address,
               linkedin: data.linkedin,
               github: data.github,
               website: data.website,
               summary: data.summary,
               userId: data.userId,
               // Create related records
               education: {
                  create: data.education.map((edu) => ({
                     institution: edu.institution,
                     degree: edu.degree,
                     fieldOfStudy: edu.fieldOfStudy,
                     startDate: edu.startDate,
                     endDate: edu.endDate,
                     description: edu.description,
                     grade: (edu as any).grade, // Using grade field from Prisma schema
                  })),
               },
               workExperience: {
                  create: data.workExperience.map((exp) => ({
                     company: exp.company,
                     position: exp.position,
                     startDate: exp.startDate,
                     endDate: exp.endDate,
                     current: exp.current,
                     description: exp.description,
                  })),
               },
               skills: {
                  create: data.skills.map((skill) => ({
                     name: skill.name,
                     level: skill.level,
                     category: skill.category,
                  })),
               },
               projects: {
                  create: data.projects.map((project) => ({
                     name: project.name,
                     description: project.description,
                     startDate: project.startDate,
                     endDate: project.endDate,
                     current: project.current,
                     url: project.url,
                     technologies: project.technologies,
                  })),
               },
            },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         return this.mapToResponse(resume);
      } catch (error) {
         console.error("Create resume error:", error);
         throw new Error(`Failed to create resume: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async getResumeById(id: string): Promise<ResumeResponse | null> {
      try {
         const resume = await prisma.resume.findUnique({
            where: { id },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         return resume ? this.mapToResponse(resume) : null;
      } catch (error) {
         console.error("Get resume error:", error);
         throw new Error(`Failed to get resume: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async getUserResumes(userId: number): Promise<ResumeResponse[]> {
      try {
         const resumes = await prisma.resume.findMany({
            where: { userId },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
            orderBy: { updatedAt: "desc" },
         });

         return resumes.map((resume) => this.mapToResponse(resume));
      } catch (error) {
         console.error("Get user resumes error:", error);
         throw new Error(`Failed to get user resumes: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async getAllResumes(): Promise<ResumeResponse[]> {
      try {
         const resumes = await prisma.resume.findMany({
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
               user: {
                  select: {
                     id: true,
                     first_name: true,
                     last_name: true,
                     email: true,
                  },
               },
            },
            orderBy: { updatedAt: "desc" },
         });

         return resumes.map((resume) => this.mapToResponse(resume));
      } catch (error) {
         console.error("Get all resumes error:", error);
         throw new Error(`Failed to get resumes: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async updateResume(data: UpdateResumeDto): Promise<ResumeResponse> {
      try {
         // First, delete all related records and recreate them
         await prisma.$transaction([
            prisma.education.deleteMany({ where: { resumeId: data.id } }),
            prisma.workExperience.deleteMany({ where: { resumeId: data.id } }),
            prisma.skill.deleteMany({ where: { resumeId: data.id } }),
            prisma.project.deleteMany({ where: { resumeId: data.id } }),
         ]);

         const resume = await prisma.resume.update({
            where: { id: data.id },
            data: {
               title: data.title,
               template: data.template,
               fullName: data.fullName,
               email: data.email,
               phone: data.phone,
               address: data.address,
               linkedin: data.linkedin,
               github: data.github,
               website: data.website,
               summary: data.summary,
               lastSavedAt: new Date(),
               // Recreate related records
               education: {
                  create:
                     data.education?.map((edu) => ({
                        institution: edu.institution,
                        degree: edu.degree,
                        fieldOfStudy: edu.fieldOfStudy,
                        startDate: edu.startDate,
                        endDate: edu.endDate,
                        description: edu.description,
                        grade: (edu as any).grade,
                     })) || [],
               },
               workExperience: {
                  create:
                     data.workExperience?.map((exp) => ({
                        company: exp.company,
                        position: exp.position,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        current: exp.current,
                        description: exp.description,
                     })) || [],
               },
               skills: {
                  create:
                     data.skills?.map((skill) => ({
                        name: skill.name,
                        level: skill.level,
                        category: skill.category,
                     })) || [],
               },
               projects: {
                  create:
                     data.projects?.map((project) => ({
                        name: project.name,
                        description: project.description,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        current: project.current,
                        url: project.url,
                        technologies: project.technologies,
                     })) || [],
               },
            },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         return this.mapToResponse(resume);
      } catch (error) {
         console.error("Update resume error:", error);
         throw new Error(`Failed to update resume: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async deleteResume(id: string): Promise<boolean> {
      try {
         await prisma.resume.delete({
            where: { id },
         });

         return true;
      } catch (error) {
         console.error("Delete resume error:", error);
         throw new Error(`Failed to delete resume: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async duplicateResume(id: string, newTitle?: string, userId?: number): Promise<ResumeResponse> {
      try {
         const originalResume = await prisma.resume.findUnique({
            where: { id },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         if (!originalResume) {
            throw new Error("Resume not found");
         }

         const newResume = await prisma.resume.create({
            data: {
               title: newTitle || `${originalResume.title} (Copy)`,
               template: originalResume.template,
               fullName: originalResume.fullName,
               email: originalResume.email,
               phone: originalResume.phone,
               address: originalResume.address,
               linkedin: originalResume.linkedin,
               github: originalResume.github,
               website: originalResume.website,
               summary: originalResume.summary,
               userId: userId || originalResume.userId,
               // Duplicate related records
               education: {
                  create: originalResume.education.map((edu) => ({
                     institution: edu.institution,
                     degree: edu.degree,
                     fieldOfStudy: edu.fieldOfStudy,
                     startDate: edu.startDate,
                     endDate: edu.endDate,
                     description: edu.description,
                     grade: (edu as any).grade,
                  })),
               },
               workExperience: {
                  create: originalResume.workExperience.map((exp) => ({
                     company: exp.company,
                     position: exp.position,
                     startDate: exp.startDate,
                     endDate: exp.endDate,
                     current: exp.current,
                     description: exp.description,
                  })),
               },
               skills: {
                  create: originalResume.skills.map((skill) => ({
                     name: skill.name,
                     level: skill.level,
                     category: skill.category,
                  })),
               },
               projects: {
                  create: originalResume.projects.map((project) => ({
                     name: project.name,
                     description: project.description,
                     startDate: project.startDate,
                     endDate: project.endDate,
                     current: project.current,
                     url: project.url,
                     technologies: project.technologies,
                  })),
               },
            },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         return this.mapToResponse(newResume);
      } catch (error) {
         console.error("Duplicate resume error:", error);
         throw new Error(`Failed to duplicate resume: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async savePdfData(id: string, pdfData: Buffer, fileName: string, fileSize: number): Promise<ResumeResponse> {
      try {
         // Convert Node Buffer to Uint8Array because Prisma expects bytes as Uint8Array
         const pdfUint8 = new Uint8Array(pdfData);

         const resume = await prisma.resume.update({
            where: { id },
            data: {
               pdfData: pdfUint8,
               fileName,
               fileSize,
               lastSavedAt: new Date(),
            },
            include: {
               education: true,
               workExperience: true,
               skills: true,
               projects: true,
            },
         });

         return this.mapToResponse(resume);
      } catch (error) {
         console.error("Save PDF data error:", error);
         throw new Error(`Failed to save PDF data: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   private mapToResponse(resume: any): ResumeResponse {
      return {
         id: resume.id,
         title: resume.title,
         template: resume.template,
         fullName: resume.fullName,
         email: resume.email,
         phone: resume.phone,
         address: resume.address,
         linkedin: resume.linkedin,
         github: resume.github,
         website: resume.website,
         summary: resume.summary,
         education: resume.education,
         workExperience: resume.workExperience,
         skills: resume.skills,
         projects: resume.projects,
         pdfData: resume.pdfData,
         fileName: resume.fileName,
         fileSize: resume.fileSize,
         createdAt: resume.createdAt,
         updatedAt: resume.updatedAt,
         lastSavedAt: resume.lastSavedAt,
         userId: resume.userId,
      };
   }
}

export const resumeService = new ResumeService();
