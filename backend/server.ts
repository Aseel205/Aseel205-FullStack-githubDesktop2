import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import notesRouter from './routes/notesRouter';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger'; // Logger middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI!;

// ✅ Parse JSON before logger
app.use(express.json());

// ✅ Logger middleware after JSON parser
app.use(logger);

// Enable CORS and expose X-Total-Count
app.use(cors({ exposedHeaders: ['X-Total-Count'] }));

// Mount notes routes under /notes
app.use('/notes', notesRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Export the app for testing (supertest requires this)
export default  app ;
