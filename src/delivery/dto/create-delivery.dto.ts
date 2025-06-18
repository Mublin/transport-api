import { IsArray, IsEnum, IsObject, IsString } from "class-validator";

    export class CreateDeliveryDto {
  @IsObject()
  // @IsArray({ context: { path: 'pickupLocation.coordinates' } })
  pickupLocation: { coordinates: [number, number] };

  @IsObject()
  // @IsArray({ context: { path: 'dropoffLocation.coordinates' } })
  dropoffLocation: { coordinates: [number, number] };
}

