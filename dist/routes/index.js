"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const resume_route_1 = require("../modules/resume/resume.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.userRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/resume",
        route: resume_route_1.resumeRoutes,
    },
    // {
    //    path: "/massage",
    //    route: MassageRoutes,
    // },
    // {
    //    path: "/review",
    //    route: ReviewRoutes,
    // },
    // {
    //    path: "/order",
    //    route: orderRoutes,
    // },
    // {
    //    path: "/service",
    //    route: serviceRoute,
    // },
    // {
    //    path: "/meta",
    //    route: MetaRoutes,
    // },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
