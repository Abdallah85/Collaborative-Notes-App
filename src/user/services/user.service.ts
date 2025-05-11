import { User } from "../schemas/user.schema";
import { IUser } from "../interface/Iuser.interface";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/apiError";

export class UserService {
  // Create a new user
  async createUser(userData: IUser): Promise<IUser> {
    const user = await User.findOne({ email: userData.email });
    if (user) throw new ApiError(400, "User already exists");
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser> {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to get user");
    }
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
    try {
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update user");
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to delete user");
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
