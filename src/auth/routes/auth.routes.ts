import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { validateLogin } from "../middleware/auth.validation";
import { validateUser } from "../../user/middleware/user.validation";
import expressAsyncHandler from "express-async-handler";

const router = Router();
const userController = new UserController();

router.post(
  "/register",
  validateUser as any,
  expressAsyncHandler(userController.register)
);
router.post(
  "/login",
  validateLogin as any,
  expressAsyncHandler(userController.login)
);

export default router;
