import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async createDelivery(@Request() req, @Body() body: CreateDeliveryDto) {
    const userId = "684be10fa8c39fc1f443db82" 
    // || req.user.userId;
    const { pickupLocation, dropoffLocation } = body;
    return this.deliveryService.createDelivery(userId, pickupLocation, dropoffLocation);
  }

  @Patch(':id/status')
  async updateDeliveryStatus(@Request() req, @Param('id') id: string, @Body() body: UpdateDeliveryStatusDto) {
    const driverId = req.user.role === 'driver' ? req.user.userId : undefined;
    return this.deliveryService.updateDeliveryStatus(id, body.status, driverId);
  }

  @Get(':id')
  async getDelivery(@Param('id') id: string) {
    return this.deliveryService.getDelivery(id);
  }
}
