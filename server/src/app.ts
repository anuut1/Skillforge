import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import lectureRoutes from './routes/lectureRoutes';
import quizRoutes from './routes/quizRoutes';
import adaptiveRoutes from './routes/adaptiveRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/recommendations/feedback', feedbackRoutes);
app.use('/api', adaptiveRoutes);

app.use(errorHandler);

export default app;
