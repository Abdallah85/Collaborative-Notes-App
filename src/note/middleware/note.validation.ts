import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import validationMiddelware from "../../middelware/validation.middelware";

export const validateNote = [
  // Title validation
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  // Content validation
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty"),

  validationMiddelware,
];
