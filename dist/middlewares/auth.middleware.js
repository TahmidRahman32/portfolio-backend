"use strict";
// // middlewares/auth.middleware.ts
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// interface AuthenticatedRequest extends Request {
//    user?: {
//       id: string;
//       email: string;
//    };
// }
// export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//    // Skip auth for public routes
//    if (req.path === "/resumes/public" && req.method === "GET") {
//       return next();
//    }
//    const token = req.header("Authorization")?.replace("Bearer ","");
//    if (!token) {
//       return res.status(401).json({
//          success: false,
//          message: "Access token required",
//       });
//    }
//    try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//       req.user = decoded;
//       next();
//    } catch (error) {
//       return res.status(401).json({
//          success: false,
//          message: "Invalid token",
//       });
//    }
// };
