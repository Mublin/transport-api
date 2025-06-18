import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OpenrouteModule } from './openroute/openroute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>{
        return ({
          uri: configService.get("MONGO_DB")
        })
      },
     inject:[ConfigService] 
    }),
    UsersModule,
    AuthModule,
    PaymentModule,
    DeliveryModule,
    OpenrouteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
