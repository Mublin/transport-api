import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Delivery } from './schema/delivery.schema';
import { Model } from 'mongoose';

@Injectable()
export class DeliveryService {
  constructor(@InjectModel(Delivery.name) private deliveryModel: Model<Delivery>){}
  create(createDeliveryDto: CreateDeliveryDto) {
    return 'This action adds a new delivery';
  }

  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
