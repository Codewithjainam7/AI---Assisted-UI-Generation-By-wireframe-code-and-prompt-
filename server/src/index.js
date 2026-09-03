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

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static storage
app.use('/storage', express.static(path.join(__dirname, '../../storage')));
app.use('/storage', express.static(path.join(__dirname, '../storage')));

app.use('/api/health', healthRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/elements', elementsRoutes);
app.use('/api/generate', generateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Try to connect to MongoDB, but gracefully fall back to JSON file store if unavailable
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon_ui_gen';

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ Connected to MongoDB at:', mongoUri);
  })
  .catch((err) => {
    console.log('⚠️ MongoDB not detected. Fallback to resilient JSON Document Store (data/sections.json, data/elements.json)');
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`✦ UIGen Studio API server listening on http://localhost:${PORT}`);
    });
  });
