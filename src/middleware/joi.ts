import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// Custom middleware for validating request body
export function validate<T>(schema: ObjectSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      next();
    }
  };
}