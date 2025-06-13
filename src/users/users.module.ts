import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema:UserSchema}]),
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
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
