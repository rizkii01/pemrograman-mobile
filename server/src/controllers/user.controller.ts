import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, bio, level, xp, streak, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, bio } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING id, name, email, bio, level, xp, streak',
      [name, email, bio, req.userId]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.userId]);
    res.json({ message: 'Akun berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const enrollments = await pool.query('SELECT COUNT(*) FROM user_enrollments WHERE user_id = $1', [userId]);
    const submissions = await pool.query('SELECT COUNT(*) FROM user_submissions WHERE user_id = $1', [userId]);
    const certificates = await pool.query(
      'SELECT COUNT(*) FROM user_progress up JOIN modules m ON up.module_id = m.id WHERE up.user_id = $1',
      [userId]
    );
    const user = await pool.query('SELECT xp FROM users WHERE id = $1', [userId]);
    const achievements = await pool.query('SELECT COUNT(*) FROM user_achievements WHERE user_id = $1', [userId]);
    res.json({
      courses: parseInt(enrollments.rows[0].count),
      projects: parseInt(submissions.rows[0].count),
      certificates: parseInt(certificates.rows[0].count),
      xp: user.rows[0]?.xp || 0,
      streak: user.rows[0]?.streak || 0,
      achievements: parseInt(achievements.rows[0].count),
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await pool.query('SELECT name, xp, streak FROM users WHERE id = $1', [userId]);
    const enrollments = await pool.query(
      `SELECT c.id, c.title, c.color, 
        (SELECT COUNT(*) FROM user_progress up JOIN modules m ON up.module_id = m.id WHERE up.user_id = $1 AND m.course_id = c.id) as completed,
        c.lesson_count
       FROM courses c JOIN user_enrollments ue ON c.id = ue.course_id WHERE ue.user_id = $1 LIMIT 3`,
      [userId]
    );
    const stats = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM user_enrollments WHERE user_id = $1) as courses,
        (SELECT COUNT(*) FROM user_submissions WHERE user_id = $1) as projects,
        (SELECT streak FROM users WHERE id = $1) as streak`,
      [userId]
    );
    const activities = await pool.query(
      `SELECT 'submission' as type, s.submitted_at as time, p.title as text, s.status
       FROM user_submissions s JOIN projects p ON s.project_id = p.id WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC LIMIT 3`,
      [userId]
    );
    res.json({
      user: user.rows[0],
      stats: stats.rows[0],
      courses: enrollments.rows.map(c => ({
        ...c,
        progress: c.lesson_count > 0 ? Math.round((parseInt(c.completed) / parseInt(c.lesson_count)) * 100) : 0
      })),
      activities: activities.rows,
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.description, c.category, c.color, c.lesson_count,
        (SELECT COUNT(*) FROM user_progress up JOIN modules m ON up.module_id = m.id WHERE up.user_id = $1 AND m.course_id = c.id) as completed
       FROM courses c JOIN user_enrollments ue ON c.id = ue.course_id WHERE ue.user_id = $1`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
