import { Role } from "../enums/role.enum";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
