import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/", protect, requireRole(["ADMIN", "TEACHER"]), getDashboard);

export default dashboardRouter;