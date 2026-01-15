import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Fornecedor } from "./fornecedor.entity";
import { FornecedorController } from "./fornecedor.controller";
import { FornecedorService } from "./fornecedor.service";

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor])],
  providers: [FornecedorService],
  controllers: [FornecedorController]
})
export class FornecedorModule {}
