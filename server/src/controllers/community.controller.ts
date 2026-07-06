import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { lookupUserId } from '../utils/user';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('discussions')
      .select('*, users!inner(name, level)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const mapped = data?.map(d => ({
      ...d,
      author: (d.users as any)?.name,
      role: (d.users as any)?.level,
    })) || [];
    res.json(mapped);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: post, error: postError } = await supabaseAdmin
      .from('discussions')
      .select('*, users!inner(name, level)')
      .eq('id', id)
      .single();

    if (postError || !post) return res.status(404).json({ error: 'Postingan tidak ditemukan' });

    const { data: comments } = await supabaseAdmin
      .from('discussion_comments')
      .select('*, users!inner(name, level)')
      .eq('discussion_id', id)
      .order('created_at');

    const mappedComments = comments?.map(c => ({
      ...c,
      author: (c.users as any)?.name,
      role: (c.users as any)?.level,
    })) || [];

    res.json({
      ...post,
      author: (post.users as any)?.name,
      role: (post.users as any)?.level,
      comments: mappedComments,
    });
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { category, title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Judul dan isi wajib diisi' });

    const { data, error } = await supabaseAdmin
      .from('discussions')
      .insert({ user_id: localId, category: category || 'Diskusi', title, body })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { title, body, category } = req.body;
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (body !== undefined) updateData.body = body;
    if (category !== undefined) updateData.category = category;

    const { data, error } = await supabaseAdmin
      .from('discussions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', localId)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Postingan tidak ditemukan atau bukan milik Anda' });
    res.json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('discussions')
      .delete()
      .eq('id', id)
      .eq('user_id', localId)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Postingan tidak ditemukan atau bukan milik Anda' });
    res.json({ message: 'Postingan berhasil dihapus' });
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { data: existing } = await supabaseAdmin
      .from('discussion_likes')
      .select('*')
      .eq('user_id', localId)
      .eq('discussion_id', id)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from('discussion_likes')
        .delete()
        .eq('user_id', localId)
        .eq('discussion_id', id);
      await supabaseAdmin.rpc('decrement_discussion_likes', { row_id: parseInt(String(id)) });
      res.json({ liked: false });
    } else {
      await supabaseAdmin
        .from('discussion_likes')
        .insert({ user_id: localId, discussion_id: id });
      await supabaseAdmin.rpc('increment_discussion_likes', { row_id: parseInt(String(id)) });
      res.json({ liked: true });
    }
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'Komentar wajib diisi' });

    const { data, error } = await supabaseAdmin
      .from('discussion_comments')
      .insert({ discussion_id: id, user_id: localId, body })
      .select()
      .single();
    if (error) throw error;

    await supabaseAdmin.rpc('increment_discussion_replies', { row_id: parseInt(String(id)) });
    res.status(201).json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { body } = req.body;
    const { data, error } = await supabaseAdmin
      .from('discussion_comments')
      .update({ body })
      .eq('id', id)
      .eq('user_id', localId)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Komentar tidak ditemukan atau bukan milik Anda' });
    res.json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data: comment } = await supabaseAdmin
      .from('discussion_comments')
      .select('discussion_id')
      .eq('id', id)
      .single();
    if (!comment) return res.status(404).json({ error: 'Komentar tidak ditemukan' });

    await supabaseAdmin.from('discussion_comments').delete().eq('id', id);
    await supabaseAdmin.rpc('decrement_discussion_replies', { row_id: comment.discussion_id });
    res.json({ message: 'Komentar berhasil dihapus' });
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, xp, level')
      .order('xp', { ascending: false })
      .limit(10);

    if (error) throw error;
    const result = (data || []).map((u, i) => ({
      rank: i + 1,
      name: u.name,
      xp: u.xp,
      level: u.level,
      badge: i === 0 ? 'gold' as const : i === 1 ? 'silver' as const : i === 2 ? 'bronze' as const : 'none' as const,
    }));
    res.json(result);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('mentors')
      .select('*')
      .order('rating', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, expertise, students, rating, available } = req.body;
    const { data, error } = await supabaseAdmin
      .from('mentors')
      .insert({
        name,
        role,
        expertise: expertise || [],
        students: students || 0,
        rating: rating || 0,
        available: available !== false,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, expertise, students, rating, available } = req.body;
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (students !== undefined) updateData.students = students;
    if (rating !== undefined) updateData.rating = rating;
    if (available !== undefined) updateData.available = available;

    const { data, error } = await supabaseAdmin
      .from('mentors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMentor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('mentors')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Mentor tidak ditemukan' });
    res.json({ message: 'Mentor berhasil dihapus' });
  } catch (e) {
    console.error('[community.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
