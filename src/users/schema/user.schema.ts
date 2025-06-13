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
        required: true,
        enum: Role
    })
    role: Role = Role.passenger 
}

export const UserSchema = SchemaFactory.createForClass(User)