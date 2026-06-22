import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.name as author, u.level as role FROM discussions d
       JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await pool.query(
      `SELECT d.*, u.name as author, u.level as role FROM discussions d
       JOIN users u ON d.user_id = u.id WHERE d.id = $1`, [id]
    );
    if (post.rows.length === 0) return res.status(404).json({ error: 'Postingan tidak ditemukan' });
    const comments = await pool.query(
      `SELECT dc.*, u.name as author, u.level as role FROM discussion_comments dc
       JOIN users u ON dc.user_id = u.id WHERE dc.discussion_id = $1 ORDER BY dc.created_at`,
      [id]
    );
    res.json({ ...post.rows[0], comments: comments.rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { category, title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Judul dan isi wajib diisi' });
    const result = await pool.query(
      'INSERT INTO discussions (user_id, category, title, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, category || 'Diskusi', title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, category } = req.body;
    const result = await pool.query(
      'UPDATE discussions SET title = COALESCE($1, title), body = COALESCE($2, body), category = COALESCE($3, category) WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, body, category, id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Postingan tidak ditemukan atau bukan milik Anda' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM discussions WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Postingan tidak ditemukan atau bukan milik Anda' });
    res.json({ message: 'Postingan berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(
      'SELECT * FROM discussion_likes WHERE user_id = $1 AND discussion_id = $2',
      [req.userId, id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM discussion_likes WHERE user_id = $1 AND discussion_id = $2', [req.userId, id]);
      await pool.query('UPDATE discussions SET likes_count = likes_count - 1 WHERE id = $1', [id]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO discussion_likes (user_id, discussion_id) VALUES ($1, $2)', [req.userId, id]);
      await pool.query('UPDATE discussions SET likes_count = likes_count + 1 WHERE id = $1', [id]);
      res.json({ liked: true });
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'Komentar wajib diisi' });
    const result = await pool.query(
      'INSERT INTO discussion_comments (discussion_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
      [id, req.userId, body]
    );
    await pool.query('UPDATE discussions SET replies_count = replies_count + 1 WHERE id = $1', [id]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const result = await pool.query(
      'UPDATE discussion_comments SET body = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [body, id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Komentar tidak ditemukan atau bukan milik Anda' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await pool.query('SELECT * FROM discussion_comments WHERE id = $1', [id]);
    if (comment.rows.length === 0) return res.status(404).json({ error: 'Komentar tidak ditemukan' });
    await pool.query('DELETE FROM discussion_comments WHERE id = $1', [id]);
    await pool.query('UPDATE discussions SET replies_count = replies_count - 1 WHERE id = $1', [comment.rows[0].discussion_id]);
    res.json({ message: 'Komentar berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, xp, level FROM users ORDER BY xp DESC LIMIT 10'
    );
    res.json(result.rows.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      xp: u.xp,
      level: u.level,
      badge: i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'none',
    })));
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM mentors ORDER BY rating DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM mentors WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, expertise, students, rating, available } = req.body;
    const result = await pool.query(
      'INSERT INTO mentors (name, role, expertise, students, rating, available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, role, JSON.stringify(expertise || []), students || 0, rating || 0, available !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, expertise, students, rating, available } = req.body;
    const result = await pool.query(
      'UPDATE mentors SET name = COALESCE($1, name), role = COALESCE($2, role), expertise = COALESCE($3, expertise), students = COALESCE($4, students), rating = COALESCE($5, rating), available = COALESCE($6, available) WHERE id = $7 RETURNING *',
      [name, role, expertise ? JSON.stringify(expertise) : null, students, rating, available, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM mentors WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json({ message: 'Mentor berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
