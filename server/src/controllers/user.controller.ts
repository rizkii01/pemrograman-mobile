import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { lookupUserId } from '../utils/user';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, bio, level, xp, streak, created_at')
      .eq('id', localId)
      .single();
    if (error || !data) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[getProfile] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { name, email, bio } = req.body;
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', localId)
      .select('id, name, email, bio, level, xp, streak')
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[updateProfile] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    await supabaseAdmin.from('users').delete().eq('supabase_id', req.userId!);
    await supabaseAdmin.auth.admin.deleteUser(req.userId!);
    res.json({ message: 'Akun berhasil dihapus' });
  } catch (e) {
    console.error('[deleteProfile] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { count: courses } = await supabaseAdmin
      .from('user_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', localId);

    const { count: projects } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', localId);

    const { count: achievements } = await supabaseAdmin
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', localId);

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('xp, streak')
      .eq('id', localId)
      .single();

    res.json({
      courses: courses || 0,
      projects: projects || 0,
      certificates: 0,
      xp: user?.xp || 0,
      streak: user?.streak || 0,
      achievements: achievements || 0,
    });
  } catch (e) {
    console.error('[getStats] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('name, xp, streak')
      .eq('id', localId)
      .single();

    const { data: enrollments } = await supabaseAdmin
      .from('user_enrollments')
      .select('course_id')
      .eq('user_id', localId);

    const courseIds = enrollments?.map(e => e.course_id) || [];

    const { data: courseData } = await supabaseAdmin
      .from('courses')
      .select('*')
      .in('id', courseIds.slice(0, 3));

    const { data: allProgress } = await supabaseAdmin
      .from('user_progress')
      .select('module_id')
      .eq('user_id', localId);

    const completedIds = new Set(allProgress?.map(p => p.module_id) || []);

    const { data: allModules } = await supabaseAdmin
      .from('modules')
      .select('*')
      .in('course_id', courseIds);

    const courses = courseData?.map(c => {
      const courseModules = allModules?.filter(m => m.course_id === c.id) || [];
      const completed = courseModules.filter(m => completedIds.has(m.id)).length;
      return {
        ...c,
        progress: c.lesson_count > 0 ? Math.round((completed / c.lesson_count) * 100) : 0,
      };
    });

    const { count: statsCourses } = await supabaseAdmin
      .from('user_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', localId);

    const { count: statsProjects } = await supabaseAdmin
      .from('user_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', localId);

    const { data: activities } = await supabaseAdmin
      .from('user_submissions')
      .select('submitted_at, status, projects!inner(title)')
      .eq('user_id', localId)
      .order('submitted_at', { ascending: false })
      .limit(3);

    const mappedActivities = activities?.map(a => ({
      type: 'submission' as const,
      time: a.submitted_at,
      text: (a.projects as any)?.title || '',
      status: a.status,
    })) || [];

    res.json({
      user: { name: user?.name, xp: user?.xp, streak: user?.streak },
      stats: { courses: statsCourses || 0, projects: statsProjects || 0, streak: user?.streak || 0 },
      courses: courses || [],
      activities: mappedActivities,
    });
  } catch (e) {
    console.error('[getDashboard] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { data: enrollments } = await supabaseAdmin
      .from('user_enrollments')
      .select('course_id')
      .eq('user_id', localId);

    const courseIds = enrollments?.map(e => e.course_id) || [];
    if (courseIds.length === 0) return res.json([]);

    const { data: courses } = await supabaseAdmin
      .from('courses')
      .select('*')
      .in('id', courseIds);

    const { data: allProgress } = await supabaseAdmin
      .from('user_progress')
      .select('module_id')
      .eq('user_id', localId);

    const completedIds = new Set(allProgress?.map(p => p.module_id) || []);

    const { data: allModules } = await supabaseAdmin
      .from('modules')
      .select('*')
      .in('course_id', courseIds);

    const result = courses?.map(c => {
      const courseModules = allModules?.filter(m => m.course_id === c.id) || [];
      const completed = courseModules.filter(m => completedIds.has(m.id)).length;
      return { ...c, completed };
    });

    res.json(result || []);
  } catch (e) {
    console.error('[getEnrolledCourses] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
