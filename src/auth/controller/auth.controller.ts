import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { IUser } from "../../user/interface/Iuser.interface";
import ApiError from "../../utils/apiError";
import expressAsyncHandler from "express-async-handler";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *               - role
   *             properties:
   *               name:
   *                 type: string
   *                 description: Full name of the user
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 description: User's password (minimum 8 characters)
   *               role:
   *                 type: string
   *                 enum: [USER, ADMIN]
   *                 description: User's role in the system
   *             example:
   *               name: "John Doe"
   *               email: "john.doe@gmail.com"
   *               password: "password123"
   *               role: "USER"
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userName:
   *                   type: string
   *                   description: User's full name
   *                 email:
   *                   type: string
   *                   description: User's email address
   *                 role:
   *                   type: string
   *                   description: User's role
   *                 token:
   *                   type: string
   *                   description: JWT authentication token
   *             example:
   *               userName: "John Doe"
   *               email: "john.doe@gmail.com"
   *               role: "USER"
   *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *             example:
   *               email: "test@gmail.com"
   *               password: "password"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userName:
   *                   type: string
   *                 email:
   *                   type: string
   *                 role:
   *                   type: string
   *                 token:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *             example:
   *               email: "test@gmail.com"
   *     responses:
   *       200:
   *         description: Password reset link sent
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Password reset link sent to your email
   *       400:
   *         description: Email is required
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Reset password using token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *               newPassword:
   *                 type: string
   *                 minLength: 8
   *             example:
   *               token: "reset-token-123"
   *               newPassword: "newpassword123"
   *     responses:
   *       200:
   *         description: Password reset successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Password has been reset successfully
   *       400:
   *         description: Token and new password are required
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /api/auth/change-password:
   *   post:
   *     summary: Change user password
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *                 minLength: 8
   *             example:
   *               currentPassword: "oldpassword123"
   *               newPassword: "newpassword123"
   *     responses:
   *       200:
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Password changed successfully
   *       400:
   *         description: Current password and new password are required
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
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
