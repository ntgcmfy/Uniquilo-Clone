import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabaseClient';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  async getAll() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(productDto: ProductDto) {
    const { data, error } = await supabase.from('products').insert([productDto]).select();
    if (error) throw error;
    return data;
  }

  async update(id: string, productDto: Partial<ProductDto>) {
    const { data, error } = await supabase.from('products').update(productDto).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
}