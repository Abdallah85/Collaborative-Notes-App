import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { validateLogin } from "../middleware/auth.validation";
import { validateUser } from "../../user/middleware/user.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const auhtController = new AuthController();

// Public routes
router.post("/register", validateUser as any, auhtController.register);
router.post("/login", validateLogin as any, auhtController.login);

// Password reset routes
router.post("/forgot-password", auhtController.forgotPassword);
router.post("/reset-password", auhtController.resetPassword);

// Protected routes
router.use(authMiddleware);
router.post("/change-password", auhtController.changePassword);

export default router;
