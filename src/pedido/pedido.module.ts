import { TypeOrmModule } from "@nestjs/typeorm";
import { PedidoController } from "./pedido.controller";
import { PedidoService } from "./pedido.service";
import { Module } from "@nestjs/common";
import { Pedido } from "./pedido.entity";
import { PedidoItem } from "src/pedido-item/pedido-item.entity";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem]),EmailModule],
  providers: [PedidoService],
  controllers: [PedidoController]
})
export class PedidoModule {}
