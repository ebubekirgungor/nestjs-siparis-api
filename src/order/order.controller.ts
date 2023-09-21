import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Order } from '@prisma/client';
import { OrderDto } from './order.dto';
import {
  get_available_campaigns,
  get_discounted_total_price,
} from './order.functions';

const shipping_cost: number = 35;

@Controller('/api/orders')
export class OrderController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    @InjectQueue('order-queue') private queue: Queue,
  ) {}
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        campaign: {
          select: {
            description: true,
          },
        },
        products: {
          include: {
            category: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }
  @Post()
  async createOrder(@Body() OrderDto: OrderDto): Promise<Order> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: OrderDto.user_id,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.product.updateMany({
      where: {
        id: {
          in: OrderDto.product_ids,
        },
      },
      data: {
        stock_quantity: {
          decrement: 1,
        },
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: OrderDto.product_ids,
        },
      },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });

    if (products.length != OrderDto.product_ids.length) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error:
            OrderDto.product_ids.length -
            products.length +
            ' of the products were not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let campaigns = await this.cacheManager.get('campaigns');
    if (!campaigns) {
      campaigns = await this.prisma.campaign.findMany();
      await this.cacheManager.set('campaigns', campaigns, 30000);
    }

    let total_price = products.reduce((total, product) => {
      return total + product.list_price;
    }, 0);

    if (total_price < 150) total_price += shipping_cost;

    let available_campaigns = get_available_campaigns(campaigns, products);

    const discounted_prices = [];

    for (const campaign of available_campaigns) {
      const discounted_price = get_discounted_total_price(
        campaign,
        products,
        total_price,
      );
      discounted_prices.push({
        campaign_id: campaign.id,
        discounted_price: discounted_price,
      });
    }

    console.log(discounted_prices);

    let min_discounted_campaign = discounted_prices.reduce(
      (min_campaign, current_campaign) => {
        if (
          !min_campaign ||
          current_campaign.discounted_price < min_campaign.discounted_price
        ) {
          return current_campaign;
        }
        return min_campaign;
      },
      null,
    );
    console.log(min_discounted_campaign);
    if (discounted_prices.length == 0) {
      min_discounted_campaign = {
        discounted_price: total_price,
      };
    }

    const order = {
      data: {
        price_without_discount: total_price,
        discounted_price: min_discounted_campaign.discounted_price,
        campaign_id: min_discounted_campaign.campaign_id,
        user_id: OrderDto.user_id,
        products: {
          connect: OrderDto.product_ids.map((product_id) => ({
            id: product_id,
          })),
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        campaign: {
          select: {
            description: true,
          },
        },
        products: {
          include: {
            category: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    };
    const order_queue = await this.queue.add('processOrder', order);
    return order_queue.finished();
  }
  @Get(':id')
  async getOrder(@Param('id') id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        campaign: {
          select: {
            description: true,
          },
        },
        products: {
          include: {
            category: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id: Number(id) },
    });
  }
}
