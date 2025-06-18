import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenRouteService } from '../openroute/openroute.service';
import { Delivery } from './schema/delivery.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
    private userService: UsersService,
    private openRouteService: OpenRouteService,
  ) {}

  async createDelivery(
    userId: string,
    pickupLocation: { coordinates: number[] },
    dropoffLocation: { coordinates: number[] },
  ): Promise<Delivery> {
    // Validate user
    const user = await this.userService.findProfile(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Find nearby drivers (within 10km)
    const drivers = await this.userService.findNearbyDrivers(
      pickupLocation.coordinates[0],
      pickupLocation.coordinates[1],
      10000000000000,
    );
    if (!drivers.length) {
      throw new HttpException('No available drivers', HttpStatus.BAD_REQUEST);
    }

    // Assign the nearest driver
    const driver: any = drivers[0];
    await this.userService.updateAvailability(driver._id.toString(), false);

    // Calculate travel time using OpenRouteService
    const driverToPickupTime = await this.openRouteService.getTravelTime(driver.location, pickupLocation);
    const pickupToDropoffTime = await this.openRouteService.getTravelTime(pickupLocation, dropoffLocation);
    const totalTime = Math.round((driverToPickupTime + pickupToDropoffTime) / 60); // Convert to minutes

    // Create delivery
    return this.deliveryModel.create({
      user,
      driver,
      pickupLocation: { type: 'Point', coordinates: pickupLocation.coordinates },
      dropoffLocation: { type: 'Point', coordinates: dropoffLocation.coordinates },
      status: 'pending',
      estimatedDeliveryTime: totalTime,
    });
  }

  async updateDeliveryStatus(deliveryId: string, status: string, driverId?: string): Promise<Delivery> {
    const delivery : any = await this.deliveryModel.findById(deliveryId).exec();
    if (!delivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }

    // Validate driver
    if (driverId && delivery.driver._id.toString() !== driverId) {
      throw new HttpException('Unauthorized driver', HttpStatus.FORBIDDEN);
    }

    delivery.status = status;
    if (status === 'completed' && driverId) {
      await this.userService.updateAvailability(driverId, true);
    }

    const updatedDelivery = await delivery.save();

    return updatedDelivery;
  }

  async getDelivery(deliveryId: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(deliveryId).populate('user driver').exec();
    if (!delivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }
    return delivery;
  }
}