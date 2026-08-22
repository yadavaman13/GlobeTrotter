import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import envConfig from './config/env.config.js';
import { authRouter, userRouter, adminRouter } from './modules/auth/index.js';
import aiRouter from './modules/ai/routes/ai.routes.js';
import { ragRouter } from './modules/rag/index.js';
import { pdfRouter } from './modules/pdf/index.js';
import { communityRouter } from './modules/community/index.js';
import { tripRouter } from './modules/trips/index.js';
import { dashboardRouter } from './modules/dashboard/index.js';
import { cityRouter } from './modules/city/index.js';
import { activityRouter } from './modules/activity/index.js';
import { publicRouter } from './modules/public/index.js';
import { savedDestinationRouter } from './modules/saved-destinations/index.js';
import { errorHandler } from './modules/auth/middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: envConfig.CLIENT_ORIGINS,
        credentials: true,
    }),
);
app.use(morgan('combined'));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/trips', tripRouter);
app.use('/api/ai', aiRouter);
app.use('/api/rag', ragRouter);
app.use('/api/pdf', pdfRouter);
app.use('/api/community', communityRouter);
app.use('/api/cities', cityRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/activities', activityRouter);
app.use('/api/public', publicRouter);
app.use('/api/saved-destinations', savedDestinationRouter);

app.use(errorHandler);

export default app;
