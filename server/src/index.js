import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import healthRoutes from './routes/health.js';
import sectionsRoutes from './routes/sections.js';
import elementsRoutes from './routes/elements.js';
import generateRoutes from './routes/generate.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/storage', express.static(path.join(__dirname, '../../storage')));

app.use('/api/health', healthRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/elements', elementsRoutes);
app.use('/api/generate', generateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uigen')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✦ UIGen Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
