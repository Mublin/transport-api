import { Module } from '@nestjs/common';
import { OpenRouteService} from './openroute.service';
import { HttpModule} from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  providers: [OpenRouteService],
  exports: [OpenRouteService]
})
export class OpenrouteModule {}
