import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>{
        return (
          {
            secret: configService.get("JWT_SECRET"),
            signOptions: {
              expiresIn: '7d'
            }
          }
        )
      },
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
