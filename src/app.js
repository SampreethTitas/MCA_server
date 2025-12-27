import express from 'express';
import cors from 'cors';

import adminRoutes from './routes/admin.routes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);

import authRoutes from './routes/auth.routes.js';
app.use('/auth', authRoutes);

export default app;
