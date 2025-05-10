import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { IUser } from "../../user/interface/Iuser.interface";
import ApiError from "../../utils/apiError";
import status from "http-status";

export class UserController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const userData: IUser = req.body;
    const result = await this.authService.register(userData);
    const response = {
      userName: result.user.name,
      email: result.user.email,
      role: result.user.role,
      token: result.token,
    };
    res.status(201).json(response);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    const response = {
      userName: result.user.name,
      email: result.user.email,
      role: result.user.role,
      token: result.token,
    };
    res.json(response);
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(status.BAD_REQUEST, "Email is required");
    }

    await this.authService.requestPasswordReset(email);
    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent",
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      throw new ApiError(
        status.BAD_REQUEST,
        "Reset token and new password are required"
      );
    }

    const result = await this.authService.resetPassword(
      resetToken,
      newPassword
    );
    const response = {
      userName: result.user.name,
      email: result.user.email,
      role: result.user.role,
      token: result.token,
    };
    res.json(response);
  };
  changePassword = async (req: Request, res: Response) => {
    const user = res.locals.user as IUser;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(
        status.BAD_REQUEST,
        "Current password and new password are required"
      );
    }

    await this.authService.changePassword(
      user.id,
      currentPassword,
      newPassword
    );
    res.json({ message: "Password changed successfully" });
  };
}
