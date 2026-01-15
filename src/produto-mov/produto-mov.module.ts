import { Module } from '@nestjs/common';
import { ProdutoMovService } from './produto-mov.service';
import { ProdutoMovController } from './produto-mov.controller';

@Module({
  providers: [ProdutoMovService],
  controllers: [ProdutoMovController]
})
export class ProdutoMovModule {}
