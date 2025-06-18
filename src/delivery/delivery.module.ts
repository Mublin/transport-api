import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from './schema/delivery.schema';
import { OpenrouteModule } from 'src/openroute/openroute.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Delivery.name, schema: DeliverySchema}]),
    OpenrouteModule,
    UsersModule
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
