import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabaseClient';

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  originalprice: number;
  category: string;
  subcategory: string;
  images: any;        // JSON array
  colors: any;        // JSON array
  sizes: any;         // JSON array
  description: string;
  features: any;      // JSON object
  isnew: boolean;
  issale: boolean;
  rating: number;
  reviewcount: number;
}

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