import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
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
      throw new ApiError(400, errors.array()[0].msg);
    }
    next();
  },
];

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }
    next();
  },
];
