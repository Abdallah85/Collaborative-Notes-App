import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { IUser } from "../../user/interface/Iuser.interface";
import ApiError from "../../utils/apiError";
import expressAsyncHandler from "express-async-handler";

export class UserController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = expressAsyncHandler(async (req: Request, res: Response) => {
    const userData: IUser = req.body;
    const result = await this.authService.register(userData);
    const response = {
      userName: result.user.name,
      email: result.user.email,
      role: result.user.role,
      token: result.token,
    };
    res.status(201).json(response);
  });

  login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    const response = {
      userName: result.user.name,
      email: result.user.email,
      role: result.user.role,
      token: result.token,
    };
    res.status(200).json(response);
  });

  forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(400, "Email is required");
      }
      await this.authService.requestPasswordReset(email);
      res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to process password reset request");
    }
  });

  resetPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new ApiError(400, "Token and new password are required");
      }
      await this.authService.resetPassword(token, newPassword);
      res.status(200).json({
        status: "success",
        message: "Password has been reset successfully",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to reset password");
    }
  });

  changePassword = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new ApiError(
          400,
          "Current password and new password are required"
        );
      }
      await this.authService.changePassword(
        res.locals.user._id,
        currentPassword,
        newPassword
      );
      res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to change password");
    }
  });
}
