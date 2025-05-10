import jwt, { SignOptions } from "jsonwebtoken";
import { UserService } from "../../user/services/user.service";
import {
  ILoginCredentials,
  IAuthResponse,
  ITokenPayload,
} from "../interface/auth.interface";
import { IUser } from "../../user/interface/Iuser.interface";
import status from "http-status";
import ApiError from "../../utils/apiError";

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.userService = new UserService();
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

  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    try {
      // Find user by email
      const user = await this.userService.getUserByEmail(credentials.email);
      if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await this.userService.verifyPassword(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid email or password");
      }

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

  async verifyToken(token: string): Promise<ITokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as ITokenPayload;
      return decoded;
    } catch (error) {
      throw new ApiError(status.UNAUTHORIZED, "Invalid or expired token");
    }
  }

  async getCurrentUser(token: string): Promise<Omit<IUser, "password">> {
    try {
      const decoded = await this.verifyToken(token);
      const user = await this.userService.getUserById(decoded.userId);

      if (!user) {
        throw new ApiError(status.NOT_FOUND, "User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
}
