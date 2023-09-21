import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Campaign } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/campaigns')
export class CampaignController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async getAllCampaigns(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany();
  }
  @Post()
  async createCampaign(@Body() data: Campaign): Promise<Campaign> {
    return this.prisma.campaign.create({
      data,
    });
  }
  @Get(':id')
  async getCampaign(@Param('id') id: number): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id: Number(id) },
    });
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Campaign> {
    return this.prisma.campaign.delete({
      where: { id: Number(id) },
    });
  }
}
