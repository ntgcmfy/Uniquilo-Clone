import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export interface ProfileDto {
  id?: string; // uuid, tự sinh khi đăng ký
  name: string;
  email: string;
  role?: string; // 'customer' hoặc 'admin'
  avatar?: string;
  phone?: string;
  tier?: string;
  join_date?: string;
  loyalty_points?: number;
  wishlist?: any;
  cart?: any;
  addresses?: any;
  payment_methods?: any;
  notifications?: any;
}

@Injectable()
export class UserService {
  async register(email: string, password: string, name: string) {
    // Đăng ký qua Supabase Auth, metadata lưu name, role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'customer' }
      }
    });
    if (error) throw error;
    // Trả về token và refresh token nếu có
    return {
      user: data.user,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return {
      user: data.user,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) throw error;
    return {
      user: data.user,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    };
  }

  async getProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  }

    async updateRole(id: string, role: string) {
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select();
    if (error) throw error;
    return data;
  }
  
}