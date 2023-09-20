import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('/api/products')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.ProductService.getAllProducts();
  }
  @Post()
  async createProduct(@Body() postData: Product): Promise<Product> {
    return this.ProductService.createProduct(postData);
  }
  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product | null> {
    return this.ProductService.getProduct(id);
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Product> {
    return this.ProductService.updateProduct(id);
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Product> {
    return this.ProductService.deleteProduct(id);
  }
}
