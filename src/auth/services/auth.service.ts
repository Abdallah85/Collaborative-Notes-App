import jwt, { SignOptions } from "jsonwebtoken";
import { UserService } from "../../user/services/user.service";
import { EmailService } from "../../utils/email.service";
import {
  ILoginCredentials,
  IAuthResponse,
  ITokenPayload,
} from "../interface/auth.interface";
import { IUser } from "../../user/interface/Iuser.interface";
import ApiError from "../../utils/apiError";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../../user/schemas/user.schema";

export class AuthService {
  private userService: UserService;
  private emailService: EmailService;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly RESET_TOKEN_EXPIRES_IN: number = 3600000; // 1 hour in milliseconds

  constructor() {
    this.userService = new UserService();
    this.emailService = EmailService.getInstance();
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
  }

  private generateToken(payload: ITokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(payload, this.JWT_SECRET, options);
  }

  async register(userData: IUser): Promise<IAuthResponse> {
    try {
      // Create new user
      const user = await this.userService.createUser(userData);

      // Generate token
      const tokenPayload: ITokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.generateToken(tokenPayload);

      return {
        user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError(401, "Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
      }

      const tokenPayload: ITokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.generateToken(tokenPayload);
      return { user, token };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to login");
    }
  }

  async verifyToken(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as ITokenPayload;
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid token");
      }
      throw new ApiError(500, "Failed to verify token");
    }
  }

  async getCurrentUser(token: string): Promise<Omit<IUser, "password">> {
    try {
      const decoded = await this.verifyToken(token);
      const user = await this.userService.getUserById(decoded.id);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + this.RESET_TOKEN_EXPIRES_IN);

    // Save reset token to user
    await this.userService.updateUser(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user, resetToken);
  }

  async resetPassword(
    resetToken: string,
    newPassword: string
  ): Promise<IAuthResponse> {
    // Find user by reset token and check if token is valid
    const user = await this.userService.getUserByResetToken(resetToken);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    // Update password and clear reset token
    await this.userService.updateUser(user.id, {
      password: newPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    // Send password changed email
    await this.emailService.sendPasswordChangedEmail(user);

    // Generate new auth token
    const tokenPayload: ITokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.generateToken(tokenPayload);

    return {
      user,
      token,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify current password
    const isPasswordValid = await this.userService.verifyPassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    // Update password
    await this.userService.updateUser(userId, { password: newPassword });

    // Send password changed email
    await this.emailService.sendPasswordChangedEmail(user);
  }
}
