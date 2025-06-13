import { IsEmail } from "class-validator";

export enum Role {
    passenger = "passenger",
    driver = "driver",
    admin = "admin"
}

export class CreateUserDto {
   @IsEmail()
    email: string;
   
    phoneNumber: string;
    
    password: string
    firstName: string
    lastName: string

    role: Role = Role.passenger 
}
