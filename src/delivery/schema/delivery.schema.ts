import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema()
export class Delivery extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: User;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  pickupLocation: { type: string; coordinates: number[] };

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  dropoffLocation: { type: string; coordinates: number[] };

  @Prop({ enum: ['pending', 'accepted', 'in_progress', 'completed'], default: 'pending' })
  status: string;

  @Prop()
  estimatedDeliveryTime: number; // In minutes
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

// Create 2dsphere index for pickup and dropoff locations
DeliverySchema.index({ pickupLocation: '2dsphere', dropoffLocation: '2dsphere' });