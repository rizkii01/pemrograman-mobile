import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { lookupUserId } from '../utils/user';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = supabaseAdmin.from('courses').select('*');
    if (category && category !== 'Semua') {
      query = query.eq('category', category as string);
    }
    const { data, error } = await query.order('id');
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (courseError || !course) return res.status(404).json({ error: 'Kursus tidak ditemukan' });

    const { data: modules } = await supabaseAdmin
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .order('sort_order');

    res.json({ ...course, modules: modules || [] });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, color, lesson_count } = req.body;
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert({ title, description, category, color: color || '#38BDF8', lesson_count: lesson_count || 0 })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, color, lesson_count } = req.body;
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (color !== undefined) updateData.color = color;
    if (lesson_count !== undefined) updateData.lesson_count = lesson_count;

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kursus tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kursus tidak ditemukan' });
    res.json({ message: 'Kursus berhasil dihapus' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .order('sort_order');
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id, mid } = req.params;
    const { data, error } = await supabaseAdmin
      .from('modules')
      .select('*')
      .eq('course_id', id)
      .eq('id', mid)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, duration, sort_order } = req.body;
    const { data, error } = await supabaseAdmin
      .from('modules')
      .insert({ course_id: id, title, duration, sort_order: sort_order || 0 })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id, mid } = req.params;
    const { title, duration, sort_order } = req.body;
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (duration !== undefined) updateData.duration = duration;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data, error } = await supabaseAdmin
      .from('modules')
      .update(updateData)
      .eq('course_id', id)
      .eq('id', mid)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id, mid } = req.params;
    const { data, error } = await supabaseAdmin
      .from('modules')
      .delete()
      .eq('course_id', id)
      .eq('id', mid)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Modul tidak ditemukan' });
    res.json({ message: 'Modul berhasil dihapus' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const enroll = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    await supabaseAdmin
      .from('user_enrollments')
      .insert({ user_id: localId, course_id: id })
      .maybeSingle();
    res.json({ message: 'Berhasil mendaftar kursus' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const unenroll = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { id } = req.params;
    await supabaseAdmin
      .from('user_enrollments')
      .delete()
      .eq('user_id', localId)
      .eq('course_id', id);
    res.json({ message: 'Berhasil membatalkan enrollment' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const localId = await lookupUserId(req.userId!);
    if (!localId) return res.status(404).json({ error: 'User tidak ditemukan' });

    const { module_id } = req.body;
    await supabaseAdmin
      .from('user_progress')
      .insert({ user_id: localId, module_id })
      .maybeSingle();
    res.json({ message: 'Progress updated' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .single();
    if (quizError || !quiz) return res.status(404).json({ error: 'Kuis tidak ditemukan' });

    const { data: questions } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('quiz_id', quiz.id);

    res.json({ ...quiz, questions: questions || [] });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;

    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .single();
    if (quizError || !quiz) return res.status(404).json({ error: 'Kuis tidak ditemukan' });

    const { data: questions } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('quiz_id', quiz.id);

    let score = 0;
    (questions || []).forEach((q, i) => {
      if (answers[i] === q.correct_index) score++;
    });
    res.json({ score, total: questions?.length || 0 });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id, title, questions } = req.body;
    const { data: quiz, error } = await supabaseAdmin
      .from('quizzes')
      .insert({ course_id, title })
      .select()
      .single();
    if (error) throw error;

    if (questions && questions.length > 0) {
      const questionRows = questions.map((q: any) => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        options: q.options,
        correct_index: q.correct_index,
      }));
      const { error: qError } = await supabaseAdmin
        .from('questions')
        .insert(questionRows);
      if (qError) throw qError;
    }
    res.status(201).json(quiz);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .update({ title })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    res.json(data);
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await supabaseAdmin.from('questions').delete().eq('quiz_id', id);
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .delete()
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data) return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    res.json({ message: 'Kuis berhasil dihapus' });
  } catch (e) {
    console.error('[course.controller] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
