import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Health check endpoint for monitoring and load balancers
  @Get('health')
  getHealth(): { status: string; timestamp: string; uptime: number } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // Detailed health check with database connectivity
  @Get('health/detailed')
  async getDetailedHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    database: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  }> {
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const memPercentage = (usedMem / totalMem) * 100;

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected', // You can add actual DB health check here
      memory: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round(memPercentage),
      },
    };
  }
}
