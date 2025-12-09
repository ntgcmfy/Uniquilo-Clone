import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { supabase } from 'src/supabaseClient';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new ForbiddenException('No user id');
    const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (error || !data || data.role !== 'admin') throw new ForbiddenException('Admin only');
    return true;
  }
}