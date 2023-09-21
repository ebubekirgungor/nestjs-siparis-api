import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        orders: {
          include: {
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
        },
      },
    });
  }
  @Post()
  async createUser(@Body() data: User): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        orders: {
          include: {
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
        },
      },
    });
  }
  @Put(':id')
  async Update(@Param('id') id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {},
    });
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
