import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { products } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async getAllProducts(): Promise<products[]> {
    return this.prisma.products.findMany();
  }
  async getProduct(id: number): Promise<products | null> {
    return this.prisma.products.findUnique({ where: { id: Number(id) } });
  }
  async createProduct(data: products): Promise<products> {
    return this.prisma.products.create({
      data,
    });
  }
  async updateProduct(id: number): Promise<products> {
    return this.prisma.products.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  async deleteProduct(id: number): Promise<products> {
    return this.prisma.products.delete({
      where: { id: Number(id) },
    });
  }
}
