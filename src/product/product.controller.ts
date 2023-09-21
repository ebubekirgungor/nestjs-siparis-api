import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/products')
export class ProductController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }
  @Post()
  async createProduct(@Body() data: Product): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }
  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}
