import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Processor('order-queue')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);
  constructor(private readonly prisma: PrismaService) {}
  @Process('processOrder')
  async processOrder(job) {
    const order = await this.prisma.order.create(job.data);
    return order;
  }
}
