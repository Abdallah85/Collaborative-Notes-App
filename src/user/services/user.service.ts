import { User } from "../schemas/user.schema";
import { IUser } from "../interface/Iuser.interface";
import bcrypt from "bcryptjs";
import status from "http-status";
import ApiError from "../../utils/apiError";

export class UserService {
  // Create a new user
  async createUser(userData: IUser): Promise<IUser> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(status.CONFLICT, "Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user with hashed password
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found");
    }
    return user;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  // Get user by reset token
  async getUserByResetToken(resetToken: string): Promise<IUser | null> {
    return User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: new Date() },
    });
  }

  // Update user
  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found");
    }

    return user;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found");
    }
  }

  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find().select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
