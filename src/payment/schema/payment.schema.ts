import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Delivery } from 'src/delivery/schema/delivery.schema';

@Schema()
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Delivery', required: true })
  delivery: Delivery;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string; // e.g., 'USD'

  @Prop({ enum: ['pending', 'success', 'failed'], default: 'pending' })
  status: string;

  @Prop()
  transactionId: string; // From Stripe
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);