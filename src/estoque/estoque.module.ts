import { Module } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { Produto } from '../produto/produto.entity'; 
import { Estoque } from './estoque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estoque, Produto]), 
  ],
  providers: [EstoqueService],
  controllers: [EstoqueController]
})
export class EstoqueModule {}
