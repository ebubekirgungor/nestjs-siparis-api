import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { CampaignService } from './campaign/campaign.service';
import { PrismaService } from './prisma.service';
import { CampaignController } from './campaign/campaign.controller';

@Module({
  providers: [ProductService, OrderService, CampaignService, PrismaService],
  controllers: [ProductController, OrderController, CampaignController],
})
export class AppModule {}
