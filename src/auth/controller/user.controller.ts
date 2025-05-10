import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { IUser } from "../../user/interface/Iuser.interface";

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
}
