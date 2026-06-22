import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM courses';
    const params: any[] = [];
    if (category && category !== 'Semua') {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY id';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (course.rows.length === 0) return res.status(404).json({ error: 'Kursus tidak ditemukan' });
    const modules = await pool.query('SELECT * FROM modules WHERE course_id = $1 ORDER BY sort_order', [id]);
    res.json({ ...course.rows[0], modules: modules.rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, color, lesson_count } = req.body;
    const result = await pool.query(
      'INSERT INTO courses (title, description, category, color, lesson_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, category, color || '#38BDF8', lesson_count || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, color, lesson_count } = req.body;
    const result = await pool.query(
      'UPDATE courses SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), color = COALESCE($4, color), lesson_count = COALESCE($5, lesson_count) WHERE id = $6 RETURNING *',
      [title, description, category, color, lesson_count, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kursus tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kursus tidak ditemukan' });
    res.json({ message: 'Kursus berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM modules WHERE course_id = $1 ORDER BY sort_order', [id]);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id, mid } = req.params;
    const result = await pool.query('SELECT * FROM modules WHERE course_id = $1 AND id = $2', [id, mid]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, duration, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO modules (course_id, title, duration, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, title, duration, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id, mid } = req.params;
    const { title, duration, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE modules SET title = COALESCE($1, title), duration = COALESCE($2, duration), sort_order = COALESCE($3, sort_order) WHERE course_id = $4 AND id = $5 RETURNING *',
      [title, duration, sort_order, id, mid]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id, mid } = req.params;
    const result = await pool.query('DELETE FROM modules WHERE course_id = $1 AND id = $2 RETURNING id', [id, mid]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json({ message: 'Modul berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const enroll = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('INSERT INTO user_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.userId, id]);
    res.json({ message: 'Berhasil mendaftar kursus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const unenroll = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM user_enrollments WHERE user_id = $1 AND course_id = $2', [req.userId, id]);
    res.json({ message: 'Berhasil membatalkan enrollment' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { module_id } = req.body;
    await pool.query(
      'INSERT INTO user_progress (user_id, module_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, module_id]
    );
    res.json({ message: 'Progress updated' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const quiz = await pool.query('SELECT * FROM quizzes WHERE course_id = $1', [courseId]);
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quiz.rows[0].id]);
    res.json({ ...quiz.rows[0], questions: questions.rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const quiz = await pool.query('SELECT * FROM quizzes WHERE course_id = $1', [courseId]);
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quiz.rows[0].id]);
    let score = 0;
    questions.rows.forEach((q, i) => {
      if (answers[i] === q.correct_index) score++;
    });
    res.json({ score, total: questions.rows.length });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id, title, questions } = req.body;
    const quiz = await pool.query('INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING *', [course_id, title]);
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await pool.query(
          'INSERT INTO questions (quiz_id, question_text, options, correct_index) VALUES ($1, $2, $3, $4)',
          [quiz.rows[0].id, q.question_text, JSON.stringify(q.options), q.correct_index]
        );
      }
    }
    res.status(201).json(quiz.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const result = await pool.query('UPDATE quizzes SET title = COALESCE($1, title) WHERE id = $2 RETURNING *', [title, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM questions WHERE quiz_id = $1', [id]);
    const result = await pool.query('DELETE FROM quizzes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    res.json({ message: 'Kuis berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
