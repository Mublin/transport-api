import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenRouteService {
  constructor(private httpService: HttpService, private readonly configService : ConfigService) {}

  async getTravelTime(
    origin: { coordinates: number[] },
    destination: { coordinates: number[] },
    profile: string = 'driving-car',
  ): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://api.openrouteservice.org/v2/directions/${profile}`,
          {
            coordinates: [
              origin.coordinates, // [longitude, latitude]
              destination.coordinates,
            ],
            units: 'km'
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get("ORS_API_KEY")}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const duration = response.data.routes[0].summary.duration; // In seconds
      return duration || 0;
    } catch (error) {
      // Fallback to Haversine formula if API fails
      return this.calculateHaversineDistance(
        origin.coordinates[1],
        origin.coordinates[0],
        destination.coordinates[1],
        destination.coordinates[0],
      );
    }
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    // Convert to seconds (assuming average speed of 50 km/h)
    return (distance / 1000 / 50) * 3600; // Seconds
  }
}