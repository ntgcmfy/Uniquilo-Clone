export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  subcategory: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  features: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  soldCount?: number;
}