import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoMovService } from './produto-mov.service';

describe('ProdutoMovService', () => {
  let service: ProdutoMovService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoMovService],
    }).compile();

    service = module.get<ProdutoMovService>(ProdutoMovService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
