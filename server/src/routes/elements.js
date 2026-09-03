import express from 'express';
import { listElements, updateElement } from '../controllers/ElementController.js';

const router = express.Router();

router.get('/', listElements);
router.patch('/:fieldId', updateElement);

export default router;
