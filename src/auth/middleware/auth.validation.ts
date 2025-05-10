import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import status from "http-status";
import ApiError from "../../utils/apiError";

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Validation result middleware
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(status.BAD_REQUEST, errors.array()[0].msg);
    }
    next();
  },
];
