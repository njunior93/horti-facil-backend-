import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoMovController } from './produto-mov.controller';

describe('ProdutoMovController', () => {
  let controller: ProdutoMovController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoMovController],
    }).compile();

    controller = module.get<ProdutoMovController>(ProdutoMovController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
