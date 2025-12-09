import { IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class ProductDto {
  @IsString( { message: 'ID must be a string' })
  id: string;

  @IsString( { message: 'Name must be a string' })
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsNumber({}, { message: 'Original price must be a number' })
  originalprice: number;

  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsString({ message: 'Subcategory must be a string' })
  subcategory: string;

  @IsArray({ message: 'Images must be an array' })
  images: any[];

  @IsArray({ message: 'Colors must be an array' })
  colors: any[];

  @IsArray({ message: 'Sizes must be an array' })
  sizes: any[];

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsArray({ message: 'Features must be an array' })
  features: any[];

  @IsBoolean({ message: 'isNew must be a boolean' })
  isnew: boolean;

  @IsBoolean({ message: 'isSale must be a boolean' })
  issale: boolean;

  @IsNumber({}, { message: 'Rating must be a number' })
  rating: number;

  @IsNumber({}, { message: 'Review count must be a number' })
  reviewcount: number;
}