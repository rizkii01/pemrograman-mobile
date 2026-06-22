import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, xp_reward, due_days, requirements, tips, color } = req.body;
    const result = await pool.query(
      'INSERT INTO projects (title, description, xp_reward, due_days, requirements, tips, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, xp_reward || 0, due_days || 7, JSON.stringify(requirements || []), JSON.stringify(tips || []), color || '#38BDF8']
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, xp_reward, due_days, requirements, tips, color } = req.body;
    const result = await pool.query(
      'UPDATE projects SET title = COALESCE($1, title), description = COALESCE($2, description), xp_reward = COALESCE($3, xp_reward), due_days = COALESCE($4, due_days), requirements = COALESCE($5, requirements), tips = COALESCE($6, tips), color = COALESCE($7, color) WHERE id = $8 RETURNING *',
      [title, description, xp_reward, due_days, requirements ? JSON.stringify(requirements) : null, tips ? JSON.stringify(tips) : null, color, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json({ message: 'Proyek berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { link, note } = req.body;
    if (!link) return res.status(400).json({ error: 'Link proyek wajib diisi' });
    const result = await pool.query(
      'INSERT INTO user_submissions (user_id, project_id, link, note) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, id, link, note || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.title as project_title, p.xp_reward FROM user_submissions s
       JOIN projects p ON s.project_id = p.id WHERE s.user_id = $1 ORDER BY s.submitted_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const reviewSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const result = await pool.query(
      'UPDATE user_submissions SET status = $1, feedback = $2 WHERE id = $3 RETURNING *',
      [status, feedback || '', id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Submission tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.id, p.title, p.description, p.xp_reward, s.link, s.status, s.submitted_at
       FROM user_submissions s JOIN projects p ON s.project_id = p.id
       WHERE s.user_id = $1 AND s.status = 'approved' ORDER BY s.submitted_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
