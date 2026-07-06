import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { lookupUserId } from '../utils/user';

export const getResources = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.query;
    let query = supabaseAdmin
      .from('resources')
      .select('*, categories!left(name)');
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    const { data, error } = await query.order('downloads', { ascending: false });
    if (error) throw error;
    const mapped = data?.map(r => ({
      ...r,
      category_name: (r.categories as any)?.name,
    })) || [];
    res.json(mapped);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*, categories!left(name)')
      .eq('id', id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json({ ...data, category_name: (data.categories as any)?.name });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, author, description, content, downloads, category_id, color } = req.body;
    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert({
        title, type, author,
        description: description || '',
        content: content || '',
        downloads: downloads || 0,
        category_id,
        color: color || '#38BDF8',
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, author, description, content, downloads, category_id, color } = req.body;
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (author !== undefined) updateData.author = author;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (downloads !== undefined) updateData.downloads = downloads;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (color !== undefined) updateData.color = color;

    const { data, error } = await supabaseAdmin
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Resource tidak ditemukan' });
    res.json({ message: 'Resource berhasil dihapus' });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchResources = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('id, title, type, color')
      .ilike('title', `%${q}%`)
      .order('downloads', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('resource_count', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, icon, color: color || '#38BDF8' })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data, error } = await supabaseAdmin
      .from('user_bookmarks')
      .select('saved_at, resources!inner(id, title, type, color)')
      .eq('user_id', localId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    const mapped = data?.map(b => ({
      id: (b.resources as any)?.id,
      title: (b.resources as any)?.title,
      type: (b.resources as any)?.type,
      color: (b.resources as any)?.color,
      saved_at: b.saved_at,
    })) || [];
    res.json(mapped);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { resource_id } = req.body;
    await supabaseAdmin
      .from('user_bookmarks')
      .insert({ user_id: localId, resource_id })
      .maybeSingle();
    res.json({ message: 'Bookmark ditambahkan' });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    await supabaseAdmin
      .from('user_bookmarks')
      .delete()
      .eq('user_id', localId)
      .eq('resource_id', id);
    res.json({ message: 'Bookmark dihapus' });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data, error } = await supabaseAdmin
      .from('user_achievements')
      .select('achievement_key, earned_at')
      .eq('user_id', localId);
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, sort_order } = req.body;
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .insert({ question, answer, sort_order: sort_order || 0 })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, sort_order } = req.body;
    const updateData: Record<string, any> = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data, error } = await supabaseAdmin
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteFaq = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    res.json({ message: 'FAQ berhasil dihapus' });
  } catch (e) {
    console.error('[library.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
