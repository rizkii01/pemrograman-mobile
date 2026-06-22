import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getResources = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.query;
    let query = 'SELECT r.*, c.name as category_name FROM resources r LEFT JOIN categories c ON r.category_id = c.id';
    const params: any[] = [];
    if (category_id) {
      query += ' WHERE r.category_id = $1';
      params.push(category_id);
    }
    query += ' ORDER BY r.downloads DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT r.*, c.name as category_name FROM resources r LEFT JOIN categories c ON r.category_id = c.id WHERE r.id = $1', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, author, description, content, downloads, category_id, color } = req.body;
    const result = await pool.query(
      'INSERT INTO resources (title, type, author, description, content, downloads, category_id, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, type, author, description || '', content || '', downloads || 0, category_id, color || '#38BDF8']
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, author, description, content, downloads, category_id, color } = req.body;
    const result = await pool.query(
      'UPDATE resources SET title = COALESCE($1, title), type = COALESCE($2, type), author = COALESCE($3, author), description = COALESCE($4, description), content = COALESCE($5, content), downloads = COALESCE($6, downloads), category_id = COALESCE($7, category_id), color = COALESCE($8, color) WHERE id = $9 RETURNING *',
      [title, type, author, description, content, downloads, category_id, color, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json({ message: 'Resource berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchResources = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const result = await pool.query(
      'SELECT id, title, type, color FROM resources WHERE LOWER(title) LIKE LOWER($1) ORDER BY downloads DESC',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY resource_count DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, icon, color) VALUES ($1, $2, $3) RETURNING *',
      [name, icon, color || '#38BDF8']
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    const result = await pool.query(
      'UPDATE categories SET name = COALESCE($1, name), icon = COALESCE($2, icon), color = COALESCE($3, color) WHERE id = $4 RETURNING *',
      [name, icon, color, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.title, r.type, r.color, b.saved_at FROM user_bookmarks b
       JOIN resources r ON b.resource_id = r.id WHERE b.user_id = $1 ORDER BY b.saved_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const { resource_id } = req.body;
    await pool.query(
      'INSERT INTO user_bookmarks (user_id, resource_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, resource_id]
    );
    res.json({ message: 'Bookmark ditambahkan' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM user_bookmarks WHERE user_id = $1 AND resource_id = $2', [req.userId, id]);
    res.json({ message: 'Bookmark dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT achievement_key, earned_at FROM user_achievements WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY sort_order');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO faqs (question, answer, sort_order) VALUES ($1, $2, $3) RETURNING *',
      [question, answer, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE faqs SET question = COALESCE($1, question), answer = COALESCE($2, answer), sort_order = COALESCE($3, sort_order) WHERE id = $4 RETURNING *',
      [question, answer, sort_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM faqs WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    res.json({ message: 'FAQ berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
