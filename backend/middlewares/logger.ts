import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Log file path - Use path.join for platform-independent file paths
const logPath = path.join(__dirname, 'log.txt');  // Corrected the file path

// Ensure the log file exists, or create it if it doesn't
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, '');  // Create an empty file if it doesn't exist
}

export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  const time = new Date().toISOString();

  // Check if there is a body, and handle accordingly
  const logEntry = req.body 
    ? `[${time}] ${req.method} ${req.path} | Body: ${JSON.stringify(req.body)}\n`
    : `[${time}] ${req.method} ${req.path} | No Body in Request\n`;

  // Write log to the file and to the console
  fs.appendFile(logPath, logEntry, err => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  // Optional: also log to the console for immediate feedback
  console.log(logEntry);  // This will print logs in the terminal

  next();
};
