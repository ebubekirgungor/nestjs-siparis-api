import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { products } from '@prisma/client';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}
  @Get()
  async getAllTodo(): Promise<products[]> {
    return this.ProductsService.getAllProducts();
  }
  @Post()
  async createTodo(@Body() postData: products): Promise<products> {
    return this.ProductsService.createProduct(postData);
  }
  @Get(':id')
  async getTodo(@Param('id') id: number): Promise<products | null> {
    return this.ProductsService.getProduct(id);
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<products> {
    return this.ProductsService.updateProduct(id);
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<products> {
    return this.ProductsService.deleteProduct(id);
  }
}
