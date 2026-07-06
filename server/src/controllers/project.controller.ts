import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { lookupUserId } from '../utils/user';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('id');
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, xp_reward, due_days, requirements, tips, color } = req.body;
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title,
        description,
        xp_reward: xp_reward || 0,
        due_days: due_days || 7,
        requirements: requirements || [],
        tips: tips || [],
        color: color || '#38BDF8',
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, xp_reward, due_days, requirements, tips, color } = req.body;
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (xp_reward !== undefined) updateData.xp_reward = xp_reward;
    if (due_days !== undefined) updateData.due_days = due_days;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (tips !== undefined) updateData.tips = tips;
    if (color !== undefined) updateData.color = color;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    res.json({ message: 'Proyek berhasil dihapus' });
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    const { link, note } = req.body;
    if (!link) return res.status(400).json({ error: 'Link proyek wajib diisi' });

    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .insert({ user_id: localId, project_id: id, link, note: note || '' })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*, projects!inner(title, xp_reward)')
      .eq('user_id', localId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    const mapped = data?.map(s => ({
      ...s,
      project_title: (s.projects as any)?.title,
      xp_reward: (s.projects as any)?.xp_reward,
    })) || [];
    res.json(mapped);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const reviewSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .update({ status, feedback: feedback || '' })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Submission tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('id, link, status, submitted_at, projects!inner(title, description, xp_reward)')
      .eq('user_id', localId)
      .eq('status', 'approved')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    const mapped = data?.map(s => ({
      id: s.id,
      title: (s.projects as any)?.title,
      description: (s.projects as any)?.description,
      xp_reward: (s.projects as any)?.xp_reward,
      link: s.link,
      status: s.status,
      submitted_at: s.submitted_at,
    })) || [];
    res.json(mapped);
  } catch (e) {
    console.error('[project.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
