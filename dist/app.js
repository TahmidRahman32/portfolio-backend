"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
// import { authMiddleware } from "./middlewares/auth.middleware";
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enables Cross-Origin Resource Sharing
app.use((0, compression_1.default)()); // Compresses response bodies for faster delivery
app.use(express_1.default.json()); // Parse incoming JSON requests
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/resumes", resumeRoutes);
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1", routes_1.default);
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
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
