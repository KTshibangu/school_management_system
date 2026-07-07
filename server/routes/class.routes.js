import { Router } from "express";
import { fetchAllClasses, fetchClassById, postClass, updateClassById, deleteClassById } from "../controllers/class.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const classRouter = Router();

classRouter.use(protect);

classRouter.get("/", requireRole(["ADMIN", "TEACHER"]), fetchAllClasses);
classRouter.get("/:id", requireRole(["ADMIN", "TEACHER"]) ,fetchClassById);
classRouter.post("/", requireRole(["ADMIN"]) ,postClass);
classRouter.put("/:id", requireRole(["ADMIN"]) ,updateClassById);
classRouter.delete("/:id", requireRole(["ADMIN"]) ,deleteClassById);

export default classRouter;