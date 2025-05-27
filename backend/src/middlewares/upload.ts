// src/middlewares/memoryUpload.ts
import multer from 'multer';

// Store uploaded file in memory as Buffer
export const memoryUpload = multer({ storage: multer.memoryStorage() });
