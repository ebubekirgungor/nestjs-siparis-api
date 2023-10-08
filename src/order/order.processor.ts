import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from 'src/prisma.service';

@Processor('order-queue')
export class OrderProcessor {
  constructor(private readonly prisma: PrismaService) {}
  @Process('processOrder')
  async processOrder(job) {
    const order = await this.prisma.order.create(job.data);
    return order;
  }
}
