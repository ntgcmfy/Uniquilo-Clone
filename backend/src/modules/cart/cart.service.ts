import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CartItem } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly supabase: SupabaseService) {}

  async getCart(userId: string): Promise<CartItem[]> {
    const { data, error } = await this.supabase.getClient()
      .from('profiles')
      .select('cart')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data?.cart || [];
  }

  async saveCart(userId: string, cart: CartItem[]): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ cart })
      .eq('id', userId);
    if (error) throw error;
  }

  async clearCart(userId: string): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ cart: [] })
      .eq('id', userId);
    if (error) throw error;
  }
}
