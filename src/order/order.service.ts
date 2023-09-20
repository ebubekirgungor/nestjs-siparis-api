import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order } from '@prisma/client';
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }
  async getOrder(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: Number(id) },
    });
  }
  async createOrder(data: Order): Promise<Order> {
    return this.prisma.order.create({
      data,
    });
  }
  async updateOrder(id: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id: Number(id) },
    });
  }
}
