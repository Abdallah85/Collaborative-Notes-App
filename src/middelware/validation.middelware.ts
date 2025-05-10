import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import status from "http-status";
import config from "../config/config";

const validationMiddelware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
  }

  next();
};

export default validationMiddelware;
