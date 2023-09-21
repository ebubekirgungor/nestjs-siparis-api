import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { ProductController } from './product/product.controller';
import { OrderController } from './order/order.controller';
import { OrderProcessor } from './order/order.processor';
import { PrismaService } from './prisma.service';
import { CampaignController } from './campaign/campaign.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    CacheModule.register(),
    BullModule.registerQueue({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      name: 'order-queue',
    }),
  ],
  providers: [PrismaService, OrderProcessor],
  controllers: [
    ProductController,
    OrderController,
    CampaignController,
    UserController,
  ],
})
export class AppModule {}
