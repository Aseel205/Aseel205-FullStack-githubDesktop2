import { Request, Response, NextFunction } from 'express';

// 404 handler for unknown routes
export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
};

// Generic error handler (400 and 500)
export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.message);

  if (err.status === 400) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
