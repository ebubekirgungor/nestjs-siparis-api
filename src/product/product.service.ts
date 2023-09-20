import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
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
  async getProduct(id: number): Promise<Product | null> {
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
  async createProduct(data: Product): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }
  async updateProduct(id: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}
