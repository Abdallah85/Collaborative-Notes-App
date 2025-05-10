import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { validateLogin } from "../middleware/auth.validation";
import { validateUser } from "../../user/middleware/user.validation";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const userController = new UserController();

// Public routes
router.post("/register", validateUser as any, userController.register);
router.post("/login", validateLogin as any, userController.login);

// Password reset routes
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// Protected routes
router.use(authenticate);
router.post("/change-password", userController.changePassword);

export default router;
