import { Router } from "express";
import { fetchAllEvents, fetchEventById, postEvent, updateEventById, deleteEventById } from "../controllers/event.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const eventRouter = Router();

// ADMIN and TEACHER can view events
eventRouter.get("/", protect, requireRole(["ADMIN", "TEACHER"]), fetchAllEvents);
eventRouter.get("/:id", protect, requireRole(["ADMIN", "TEACHER"]), fetchEventById);

// ADMIN only for writes
eventRouter.post("/", protect, requireRole(["ADMIN"]), postEvent);
eventRouter.put("/:id", protect, requireRole(["ADMIN"]), updateEventById);
eventRouter.delete("/:id", protect, requireRole(["ADMIN"]), deleteEventById);

export default eventRouter;