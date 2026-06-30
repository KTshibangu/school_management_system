import { Router } from "express";
import { fetchAllSubjects, fetchSubjectById, postSubject, updateSubjectById, deleteSubjectById } from "../controllers/subject.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const subjectRouter = Router();

subjectRouter.use(protect, requireRole(["ADMIN"]));

subjectRouter.get("/", fetchAllSubjects);
subjectRouter.get("/:id", fetchSubjectById);
subjectRouter.post("/", postSubject);
subjectRouter.put("/:id", updateSubjectById);
subjectRouter.delete("/:id", deleteSubjectById);

export default subjectRouter;