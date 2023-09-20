import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from '@prisma/client';

@Controller('/api/campaigns')
export class CampaignController {
  constructor(private readonly CampaignService: CampaignService) {}
  @Get()
  async getAllCampaigns(): Promise<Campaign[]> {
    return this.CampaignService.getAllCampaigns();
  }
  @Post()
  async createCampaign(@Body() postData: Campaign): Promise<Campaign> {
    return this.CampaignService.createCampaign(postData);
  }
  @Get(':id')
  async getCampaign(@Param('id') id: number): Promise<Campaign | null> {
    return this.CampaignService.getCampaign(id);
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<Campaign> {
    return this.CampaignService.updateCampaign(id);
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<Campaign> {
    return this.CampaignService.deleteCampaign(id);
  }
}
