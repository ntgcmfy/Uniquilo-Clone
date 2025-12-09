import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { Product } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*');
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(product: Product): Promise<Product> {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.getClient()
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}