"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./modules/user/user.routes");
const resume_route_1 = require("./modules/resume/resume.route");
const auth_route_1 = require("./modules/auth/auth.route");
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
app.use("/api/v1/users", user_routes_1.userRouter);
app.use("/api/v1/resumes", resume_route_1.resumeRoutes);
app.use("/api/v1/auth", auth_route_1.authRouter);
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
exports.default = app;
