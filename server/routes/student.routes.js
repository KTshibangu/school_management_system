import { Router } from "express";
import { fetchAllStudents, fetchStudentById, postStudent, updateStudentById, deleteStudentById } from "../controllers/student.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const studentRouter = Router();

// both ADMIN and TEACHER can view students
studentRouter.get("/", protect, requireRole(["ADMIN", "TEACHER"]), fetchAllStudents);
studentRouter.get("/:id", protect, requireRole(["ADMIN", "TEACHER"]), fetchStudentById);

// ADMIN only for writes
studentRouter.post("/", protect, requireRole(["ADMIN"]), postStudent);
studentRouter.put("/:id", protect, requireRole(["ADMIN"]), updateStudentById);
studentRouter.delete("/:id", protect, requireRole(["ADMIN"]), deleteStudentById);

export default studentRouter;