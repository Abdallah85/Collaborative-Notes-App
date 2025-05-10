import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import status from "http-status";
import ApiError from "../../utils/apiError";
import expressAsyncHandler from "express-async-handler";
import { Role } from "../../user/enums/role.enum";

export const authenticate = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(status.UNAUTHORIZED, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const authService = new AuthService();

    // Verify token and get user
    const user = await authService.getCurrentUser(token);
    // Attach user to request object
    res.locals.user = user;
    next();
  }
);

export const authorize = (...roles: Role[]) => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!res.locals.user) {
        throw new ApiError(status.UNAUTHORIZED, "User not authenticated");
      }

      if (!roles.includes(res.locals.user.role)) {
        throw new ApiError(
          status.FORBIDDEN,
          "You do not have permission to perform this action"
        );
      }

      next();
    }
  );
};
