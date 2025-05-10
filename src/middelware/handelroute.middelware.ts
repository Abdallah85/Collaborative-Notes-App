import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

const handelRoute = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
};

export default handelRoute;
