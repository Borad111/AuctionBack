import { Response } from "express";
import { AppError, DuplicateError, InternalError, NotFoundError, ValidationError } from "./app.error";
import logger from "./logger"; // Import logger

export class UtilsService {
  static async to<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (err: any) {
    return [err, null];
  }
}


  static throwError(message: string, statusCode = 500): never {
    switch (statusCode) {
      case 400: 
        throw new ValidationError(message);
      case 409:
        throw new DuplicateError(message);
      case 500:
        throw new InternalError(message);
      case 404:
      throw new NotFoundError(message);  
      default:
        throw new AppError(message, statusCode);
    }
  }

 static sendError(res: Response, err: any, code?: number): void {
  const message = err instanceof Error ? err.message : "Internal server error";
  const statusCode = code || (err instanceof AppError ? err.statusCode : 500);
  
  logger.error(`Error ${statusCode}: ${message}`, { error: err });
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
    return;
}

static sendSuccess(res: Response, data: any, code?: number): void {
  const statusCode = code || 200;
  res.status(statusCode).json({
    success: true,
    ...data
  });
  return;
}

}