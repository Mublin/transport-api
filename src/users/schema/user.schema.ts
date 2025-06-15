import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../dto/create-user.dto";



@Schema({
    timestamps : true
})
export class User extends Document{
    @Prop({
        required: true,
        unique: true
    })
    email: string;
    @Prop({
        required: true,
        unique: true
    })
    phoneNumber: string;
    @Prop({
        required: true
    })
    password: string

    refreshToken?: string

    @Prop({
        required: true
    })
    firstName: string
    lastName: string

    @Prop({
        enum: Role,
        default: Role.passenger
    })
    role: Role 
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  })
  location: { type: string; coordinates: number[] }; // GeoJSON Point

  @Prop({ default: true })
  isAvailable: boolean; // Driver availability
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create 2dsphere index for geospatial queries
UserSchema.index({ location: '2dsphere' });