import { Router } from "express";
import { fetchAllClasses, fetchClassById, postClass, updateClassById, deleteClassById } from "../controllers/class.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const classRouter = Router();

classRouter.use(protect, requireRole(["ADMIN"]));

classRouter.get("/", fetchAllClasses);
classRouter.get("/:id", fetchClassById);
classRouter.post("/", postClass);
classRouter.put("/:id", updateClassById);
classRouter.delete("/:id", deleteClassById);

export default classRouter;