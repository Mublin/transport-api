import { Test, TestingModule } from '@nestjs/testing';
import { OpenRouteService } from './openroute.service';

describe('OpenrouteService', () => {
  let service: OpenRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenRouteService],
    }).compile();

    service = module.get<OpenRouteService>(OpenRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
