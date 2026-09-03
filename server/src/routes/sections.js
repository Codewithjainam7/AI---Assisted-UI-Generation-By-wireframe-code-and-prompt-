import express from 'express';
import { listSections, getSection, regenerateSection, exportSection } from '../controllers/SectionController.js';

const router = express.Router();

router.get('/', listSections);
router.get('/:sectionId/export', exportSection);
router.get('/:sectionId', getSection);
router.post('/:sectionId/regenerate', regenerateSection);

export default router;
