import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import type { Product } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(filters?: {
    category?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price' | 'rating' | 'sold_count';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    let query = this.supabase.getClient().from('products').select('*', { count: 'exact' });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }
    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters?.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async getRelatedProducts(category: string, excludeId?: string, limit = 4): Promise<Product[]> {
    let query = this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('category', category)
      .limit(limit);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  

  async create(product: Product): Promise<Product> {
    // Chuyển đổi sang snake_case
    const payload: any = {
      ...product,
      originalprice: product.originalPrice,
      sold_count: product.soldCount,
      review_count: product.reviewCount,
      isnew: product.isNew,
      issale: product.isSale,
    };
    delete payload.originalPrice;
    delete payload.soldCount;
    delete payload.reviewCount;
    delete payload.isNew;
    delete payload.isSale;

    const { data, error } = await this.supabase.getClient()
      .from('products')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const payload: any = {};
    
    if (product.name !== undefined) payload.name = product.name;
    if (product.price !== undefined) payload.price = product.price;
    if (product.originalPrice !== undefined) payload.originalprice = product.originalPrice;
    if (product.category !== undefined) payload.category = product.category;
    if (product.subcategory !== undefined) payload.subcategory = product.subcategory;
    if (product.images !== undefined) payload.images = product.images;
    if (product.colors !== undefined) payload.colors = product.colors;
    if (product.sizes !== undefined) payload.sizes = product.sizes;
    if (product.description !== undefined) payload.description = product.description;
    if (product.features !== undefined) payload.features = product.features;
    if (product.isNew !== undefined) payload.isnew = product.isNew;
    if (product.isSale !== undefined) payload.issale = product.isSale;
    if (product.rating !== undefined) payload.rating = product.rating;
    if (product.reviewCount !== undefined) payload.review_count = product.reviewCount;
    if (product.stock !== undefined) payload.stock = product.stock;
    if (product.soldCount !== undefined) payload.sold_count = product.soldCount;

    const { data, error } = await this.supabase.getClient()
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();
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