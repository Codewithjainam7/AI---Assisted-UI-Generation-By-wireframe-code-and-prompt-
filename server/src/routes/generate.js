import express from 'express';
import { generate } from '../controllers/GenerateController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('wireframe'), generate);

export default router;
