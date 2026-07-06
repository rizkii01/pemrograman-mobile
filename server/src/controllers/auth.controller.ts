import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (authError) return res.status(400).json({ error: authError.message });

    // Hash password untuk disimpan secara lokal di tabel users
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({ supabase_id: authData.user.id, name, email, password_hash })
      .select('id, name, email, bio, level, xp, streak')
      .single();
    if (dbError) throw dbError;

    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email, password,
    });
    if (signInError) throw signInError;

    res.json({ token: signInData.session.access_token, user });
  } catch (e) {
    console.error('[register] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Email atau password salah' });

    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, bio, level, xp, streak, created_at')
      .eq('supabase_id', data.user.id)
      .single();
    if (dbError) return res.status(404).json({ error: 'User tidak ditemukan' });

    res.json({ token: data.session.access_token, user });
  } catch (e) {
    console.error('[login] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, bio, level, xp, streak, created_at')
      .eq('supabase_id', req.userId)
      .single();
    if (error || !user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (e) {
    console.error('[getMe] Error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};
