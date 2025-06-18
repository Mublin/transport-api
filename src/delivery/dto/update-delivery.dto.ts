import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsEnum, IsString } from 'class-validator';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {}

export class UpdateDeliveryStatusDto {
  @IsString()
  @IsEnum(['pending', 'accepted', 'in_progress', 'completed'])
  status: string;
}
