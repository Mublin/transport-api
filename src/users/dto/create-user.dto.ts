import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum Role {
    passenger = "passenger",
    driver = "driver",
    admin = "admin"
}

export class CreateUserDto {
   @IsEmail()
   @IsNotEmpty()
    email: string;
   @IsNotEmpty()
   @IsString()
    phoneNumber: string;
    @IsNotEmpty()
   @IsString()
    password: string
    @IsNotEmpty()
   @IsString()
    firstName: string
   @IsString()
    lastName: string
    @IsEnum({
        Role
    })
    role: Role = Role.passenger 
}
