import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { LoginDto, SignupDto, LoginResult } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const { data, error } = await this.supabase.getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error || !data?.session) {
      return { success: false, error };
    }

    return { 
      success: true, 
      session: data.session,
      user: data.user 
    };
  }

  async signup(dto: SignupDto): Promise<LoginResult> {
    const { data, error } = await this.supabase.getClient()
      .auth.signUp({
        email: dto.email,
        password: dto.password,
        options: {
          data: {
            name: dto.name,
          },
        },
      });

    if (error) {
      return { success: false, error };
    }

    return { 
      success: true, 
      session: data.session,
      user: data.user 
    };
  }

  async logout(token: string): Promise<{ success: boolean; error?: any }> {
    const { error } = await this.supabase.getClient().auth.signOut();
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  }

  async getUser(token: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser(token);
    if (error) throw error;
    return data.user;
  }
}
