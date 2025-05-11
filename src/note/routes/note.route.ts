import { Router } from "express";
import {
  authMiddleware,
  authorize,
} from "../../auth/middleware/auth.middleware";
import NoteController from "../controller/note.controller";
import { validateEditNote, validateNote } from "../middleware/note.validation";
import { Role } from "../../user/enums/role.enum";

const router = Router();
const noteController = new NoteController();

// All routes require authentication
router.use(authMiddleware);

// Note routes with validation
router.post(
  "/",
  authorize(Role.ADMIN),
  validateNote as any,
  noteController.createNote
);

router.put(
  "/:noteId",
  authorize(Role.ADMIN),
  validateEditNote as any,
  noteController.updateNote
);

router.get("/:noteId/history", noteController.getNoteHistory);

router.delete("/:noteId", authorize(Role.ADMIN), noteController.deleteNote);

router.get("/search", noteController.searchNotes);

export default router;
