import { Router } from "express";
import { authenticate, authorize } from "../../auth/middleware/auth.middleware";
import NoteController from "../controller/note.controller";
import { validateNote } from "../middleware/note.validation";
import { Role } from "../../user/enums/role.enum";

const router = Router();
const noteController = new NoteController();

// All routes require authentication
router.use(authenticate);

// Note routes with validation
router.post(
  "/",
  authorize(Role.ADMIN),
  validateNote as any,
  noteController.createNote
);

export default router;
