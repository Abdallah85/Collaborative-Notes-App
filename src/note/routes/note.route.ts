import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth.middleware";
import NoteController from "../controller/note.controller";
import { validateNote } from "../middleware/note.validation";

const router = Router();
const noteController = new NoteController();

// All routes require authentication
router.use(authenticate);

// Note routes with validation
router.post("/", validateNote as any, noteController.createNote);

export default router;
