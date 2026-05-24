import compression from "compression";
import cors from "cors";
import express from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
// import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
   }),
);


// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/resumes", resumeRoutes);
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1", router);

// Default route for testing
app.get("/", (_req, res) => {
   res.send("API is running");
});

// 404 Handler
app.use((req, res, next) => {
   res.status(404).json({
      success: false,
      message: "Route Not Found",
   });
});
app.use(globalErrorHandler);

app.use(notFound);

export default app;
