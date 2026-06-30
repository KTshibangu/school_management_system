import { Router } from "express";
import { fetchProfile, updateProfileById } from "../controllers/profile.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
 
const profileRouter = Router();
 
profileRouter.use(protect, requireRole(["ADMIN", "TEACHER"]));
 
profileRouter.get("/", fetchProfile);
profileRouter.put("/", updateProfileById);
 
export default profileRouter;
 