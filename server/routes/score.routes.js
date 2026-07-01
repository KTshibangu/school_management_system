import { Router } from "express";
import { fetchAllScores, fetchScoreById, postScore, updateScoreById, deleteScoreById } from "../controllers/score.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const scoreRouter = Router();

scoreRouter.use(protect, requireRole(["TEACHER"]));

scoreRouter.get("/", fetchAllScores);
scoreRouter.get("/:id", fetchScoreById);
scoreRouter.post("/", postScore);
scoreRouter.put("/:id", updateScoreById);
scoreRouter.delete("/:id", deleteScoreById);

export default scoreRouter;