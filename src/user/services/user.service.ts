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
      throw new ApiError(
        status.BAD_REQUEST,
        "User with this email already exists"
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user with hashed password
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      // If password is being updated, hash it
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      return await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true }
      ).select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
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
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
