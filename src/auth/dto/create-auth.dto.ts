import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/users/dto/create-user.dto";

export class CreateAuthDto {
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

     @IsEnum(Role)
     role: Role;
}
