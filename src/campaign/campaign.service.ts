import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Campaign } from '@prisma/client';
@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}
  async getAllCampaigns(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany();
  }
  async getCampaign(id: number): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id: Number(id) },
    });
  }
  async createCampaign(data: Campaign): Promise<Campaign> {
    return this.prisma.campaign.create({
      data,
    });
  }
  async updateCampaign(id: number): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  async deleteCampaign(id: number): Promise<Campaign> {
    return this.prisma.campaign.delete({
      where: { id: Number(id) },
    });
  }
}
