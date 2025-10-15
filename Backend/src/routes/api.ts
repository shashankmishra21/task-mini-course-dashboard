import express from 'express';
import { register, login } from '../controller/auth';
import { getCourses, getCourseModules, getUserProgress, completeModule} from "../controller/course";
 import {authMiddleware} from '../middleware/auth';

const router = express.Router();

// Authentication routes
router.post('/auth/register', register);
router.post('/auth/login', login);
// Course routes 
router.get('/course', authMiddleware, getCourses);
router.get('/course/:courseId/modules', authMiddleware, getCourseModules);
// Progress routes 
router.post('/progress/complete/:moduleId', authMiddleware, completeModule);
router.get('/progress', authMiddleware, getUserProgress);

export default router;
