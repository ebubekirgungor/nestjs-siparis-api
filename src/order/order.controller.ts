import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CampaignService } from '../campaign/campaign.service';
import { Order } from '@prisma/client';
import { OrderDto } from './order.dto';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/orders')
export class OrderController {
  constructor(
    private readonly OrderService: OrderService,
    private readonly CampaignService: CampaignService,
    private readonly prisma: PrismaService,
  ) {}
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.OrderService.getAllOrders();
  }
  @Post()
  async createOrder(@Body() OrderDto: OrderDto): Promise<Order> {
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

    const campaigns = await this.prisma.campaign.findMany();

    let total_price = products.reduce((total, product) => {
      return total + product.list_price;
    }, 0);

    let available_campaigns = [];
    if (total_price < 150) total_price += 35;
    for (const campaign of campaigns) {
      const conditions =
        (campaign.rule_author &&
          campaign.rule_category &&
          campaign.min_purchase_quantity &&
          campaign.discount_quantity &&
          products.filter(
            (product) =>
              product.author === campaign.rule_author &&
              product.category.title === campaign.rule_category,
          ).length >= campaign.min_purchase_quantity) ||
        (campaign.rule_author &&
          campaign.rule_category &&
          campaign.min_purchase_quantity &&
          campaign.discount_percent &&
          products.filter(
            (product) =>
              product.author === campaign.rule_author &&
              product.category.title === campaign.rule_category,
          ).length >= campaign.min_purchase_quantity) ||
        (campaign.rule_category &&
          !campaign.rule_author &&
          campaign.min_purchase_quantity &&
          campaign.discount_quantity &&
          products.filter(
            (product) => product.category.title === campaign.rule_category,
          ).length >= campaign.min_purchase_quantity) ||
        (campaign.rule_author &&
          !campaign.rule_category &&
          campaign.min_purchase_quantity &&
          campaign.discount_quantity &&
          products.filter((product) => product.author === campaign.rule_author)
            .length >= campaign.min_purchase_quantity) ||
        (campaign.rule_category &&
          !campaign.rule_author &&
          campaign.min_purchase_quantity &&
          campaign.discount_percent &&
          products.filter(
            (product) => product.category.title === campaign.rule_category,
          ).length >= campaign.min_purchase_quantity) ||
        (campaign.rule_author &&
          !campaign.rule_category &&
          campaign.min_purchase_quantity &&
          campaign.discount_percent &&
          products.filter((product) => product.author === campaign.rule_author)
            .length >= campaign.min_purchase_quantity) ||
        (campaign.min_purchase_quantity &&
          campaign.discount_quantity &&
          !campaign.rule_category &&
          !campaign.rule_author &&
          products.length >= campaign.min_purchase_quantity) ||
        (campaign.min_purchase_quantity &&
          campaign.discount_percent &&
          !campaign.rule_category &&
          !campaign.rule_author &&
          products.length >= campaign.min_purchase_quantity) ||
        (campaign.min_purchase_price &&
          products.reduce((sum, product) => sum + product.list_price, 0) >=
            campaign.min_purchase_price);

      if (conditions) {
        if (campaign.discount_percent != null) {
          available_campaigns.push({
            id: campaign.id,
            discount_percent: campaign.discount_percent,
            rule_author: campaign.rule_author,
            rule_category: campaign.rule_category,
          });
        } else if (campaign.discount_quantity != null) {
          available_campaigns.push({
            id: campaign.id,
            discount_quantity: campaign.discount_quantity,
            rule_author: campaign.rule_author,
            rule_category: campaign.rule_category,
          });
        }
      }
    }
    console.log(available_campaigns);

    function get_discounted_total_price(campaign) {
      if (campaign.discount_percent != null) {
        const discounted_price =
          total_price - (total_price * campaign.discount_percent) / 100;
        return discounted_price;
      } else if (campaign.discount_quantity != null) {
        const { rule_author, rule_category, discount_quantity } = campaign;

        const eligible_products = products
          .filter(
            (product) =>
              (!rule_author || product.author === rule_author) &&
              (!rule_category || product.category.title === rule_category),
          )
          .sort((a, b) => a.list_price - b.list_price)
          .slice(0, discount_quantity);

        console.log(eligible_products);
        const discounted_price =
          total_price -
          eligible_products.reduce(
            (sum, product) => sum + product.list_price,
            0,
          );

        return discounted_price;
      } else return 0;
    }

    const discounted_prices = [];

    for (const campaign of available_campaigns) {
      const discounted_price = get_discounted_total_price(campaign);
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

    const order = await this.prisma.order.create({
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
        products: {
          include: {
            category: {
              select: {
                title: true,
              },
            },
          },
        },
        campaign: {
          select: {
            description: true,
          },
        },
      },
    });

    return order;
  }
  @Get(':id')
  async getOrder(@Param('id') id: number): Promise<Order | null> {
    return this.OrderService.getOrder(id);
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Order> {
    return this.OrderService.updateOrder(id);
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Order> {
    return this.OrderService.deleteOrder(id);
  }
}
