import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Validasi env vars wajib sebelum memuat config yang bergantung padanya
import './config/supabase'; // akan throw jika SUPABASE_URL / SERVICE_ROLE_KEY kosong

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import projectRoutes from './routes/project.routes';
import communityRoutes from './routes/community.routes';
import libraryRoutes from './routes/library.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/community', communityRoutes);
app.use('/api', libraryRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ message: 'SkillUps API', docs: '/api/health' });
});

app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`SkillUps API running on port ${PORT}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
});

