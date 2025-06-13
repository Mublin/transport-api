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
}

export const UserSchema = SchemaFactory.createForClass(User)