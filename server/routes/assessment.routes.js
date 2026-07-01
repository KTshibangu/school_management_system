import { Router } from "express";
import { fetchAllAssessments, fetchAssessmentById, postAssessment, updateAssessmentById, deleteAssessmentById } from "../controllers/assessment.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const assessmentRouter = Router();

// all assessment routes are TEACHER only
assessmentRouter.use(protect, requireRole(["TEACHER"]));

assessmentRouter.get("/", fetchAllAssessments);
assessmentRouter.get("/:id", fetchAssessmentById);
assessmentRouter.post("/", postAssessment);
assessmentRouter.put("/:id", updateAssessmentById);
assessmentRouter.delete("/:id", deleteAssessmentById);

export default assessmentRouter;