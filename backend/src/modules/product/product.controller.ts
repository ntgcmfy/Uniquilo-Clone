import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return await this.productService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async create(@Body() dto: ProductDto) {
    return await this.productService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() dto: Partial<ProductDto>) {
    return await this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}