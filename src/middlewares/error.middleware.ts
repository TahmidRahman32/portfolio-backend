// // middlewares/error.middleware.ts
// import { Request, Response, NextFunction } from "express";

// export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
//    console.error("Error occurred:", error);

//    // JSON parsing error
//    if (error instanceof SyntaxError && "body" in error) {
//       return res.status(400).json({
//          success: false,
//          message: "Invalid JSON in request body",
//       });
//    }

//    // Prisma errors
//    if (error.name.includes("Prisma")) {
//       return res.status(500).json({
//          success: false,
//          message: "Database error occurred",
//       });
//    }

//    // Default error
//    res.status(500).json({
//       success: false,
//       message: "Internal server error",
//    });
// };
