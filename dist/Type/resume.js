"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFrontendToBackend = mapFrontendToBackend;
// Helper function to convert frontend data to backend DTO
function mapFrontendToBackend(frontendData, title, userId, template = "modern") {
    return {
        title,
        template,
        userId,
        // Map personal info to flat fields
        fullName: frontendData.personalInfo.fullName,
        email: frontendData.personalInfo.email,
        phone: frontendData.personalInfo.phone,
        address: frontendData.personalInfo.address,
        linkedin: frontendData.personalInfo.linkedin,
        github: frontendData.personalInfo.github,
        website: frontendData.personalInfo.website,
        summary: frontendData.summary,
        // Map arrays without frontend-generated IDs
        education: frontendData.education.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description,
            grade: edu.gpa, // Map gpa to grade for Prisma schema
        })),
        workExperience: frontendData.workExperience.map((exp) => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current || false,
            description: exp.description,
        })),
        skills: frontendData.skills.map((skill) => ({
            name: skill.name,
            level: skill.level,
            category: skill.category,
        })),
        projects: frontendData.projects.map((project) => ({
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            current: project.current || false,
            url: project.url,
            technologies: project.technologies || [],
        })),
    };
}
