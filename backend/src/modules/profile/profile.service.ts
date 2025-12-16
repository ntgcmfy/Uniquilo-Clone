import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import type { Profile } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Profile[]> {
    const { data, error } = await this.supabase.getClient()
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase.getClient()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  private parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
    if (value && typeof value === 'object') return [value as T];
    return fallback;
  }

  async getDashboard(userId: string) {
    const [profileResult, ordersResult] = await Promise.all([
      this.supabase.getClient()
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(),
      this.supabase.getClient()
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
    ]);

    if (profileResult.error) throw profileResult.error;
    if (ordersResult.error) throw ordersResult.error;

    const profile = profileResult.data;
    const orders = ordersResult.data || [];
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      profile: {
        id: profile?.id || userId,
        name: profile?.name || profile?.email || 'Khách hàng',
        email: profile?.email || '',
        phone: profile?.phone,
        tier: profile?.tier || 'Regular',
        loyaltyPoints: profile?.loyalty_points || 0,
        totalOrders: orders.length,
        totalSpent,
        joinDate: profile?.join_date
      },
      orders: orders.map(order => ({
        id: order.id,
        date: order.date,
        status: order.status || 'Chờ xử lý',
        total: Number(order.total || 0),
        items: Number(order.items_count || 0),
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        trackingNumber: order.tracking_number,
        products: (order.order_items || []).map(item => ({
          name: item.product_name,
          quantity: item.quantity,
          price: Number(item.price || 0)
        }))
      })),
      wishlist: this.parseJsonArray(profile?.wishlist, []),
      addresses: this.parseJsonArray(profile?.addresses, []),
      paymentMethods: this.parseJsonArray(profile?.payment_methods, []),
      notifications: this.parseJsonArray(profile?.notifications, [])
    };
  }

  async create(profile: Profile): Promise<Profile> {
    const payload = {
      ...profile,
      loyalty_points: profile.loyaltyPoints,
      join_date: profile.joinDate,
    };
    const { data, error } = await this.supabase.getClient()
      .from('profiles')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    const payload: any = {};
    if (profile.name !== undefined) payload.name = profile.name;
    if (profile.email !== undefined) payload.email = profile.email;
    if (profile.phone !== undefined) payload.phone = profile.phone;
    if (profile.role !== undefined) payload.role = profile.role;
    if (profile.loyaltyPoints !== undefined) payload.loyalty_points = profile.loyaltyPoints;
    if (profile.tier !== undefined) payload.tier = profile.tier;
    if (profile.joinDate !== undefined) payload.join_date = profile.joinDate;
    if (profile.cart !== undefined) payload.cart = profile.cart;

    const { data, error } = await this.supabase.getClient()
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async updateWishlist(userId: string, wishlist: any[]): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ wishlist })
      .eq('id', userId);
    if (error) throw error;
  }

  async updateAddresses(userId: string, addresses: any[]): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ addresses })
      .eq('id', userId);
    if (error) throw error;
  }

  async updatePaymentMethods(userId: string, paymentMethods: any[]): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ payment_methods: paymentMethods })
      .eq('id', userId);
    if (error) throw error;
  }

  async updateNotifications(userId: string, notifications: any[]): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('profiles')
      .update({ notifications })
      .eq('id', userId);
    if (error) throw error;
  }

}