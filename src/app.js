import express from 'express';
import cors from 'cors';

import adminRoutes from './routes/admin.routes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);

import authRoutes from './routes/auth.routes.js';
app.use('/auth', authRoutes);

import facultyRoutes from './routes/faculty.routes.js';
app.use('/faculty', facultyRoutes);   // 🔥 THIS WAS MISSING


export default app;
