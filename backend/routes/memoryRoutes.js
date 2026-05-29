import express from 'express';
import { createMemory, getMyMemories, deleteMemory } from '../controllers/memoryController.js';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createMemory);
router.get('/my', protect, getMyMemories);
router.delete('/:id', protect, deleteMemory);

export default router;
