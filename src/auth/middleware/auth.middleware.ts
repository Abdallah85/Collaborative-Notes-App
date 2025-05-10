import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import ApiError from "../../utils/apiError";
import expressAsyncHandler from "express-async-handler";
import { Role } from "../../user/enums/role.enum";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const authService = new AuthService();
    const user = await authService.verifyToken(token);

    res.locals.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, "Invalid token"));
    }
  }
};

export const authorize = (...roles: Role[]) => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!res.locals.user) {
        throw new ApiError(401, "User not authenticated");
      }

      if (!roles.includes(res.locals.user.role)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action"
        );
      }

      next();
    }
  );
};
