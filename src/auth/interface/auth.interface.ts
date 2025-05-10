import { IUser } from "../../user/interface/Iuser.interface";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, "password">;
  token: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}
