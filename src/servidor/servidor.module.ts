import { Module } from "@nestjs/common";
import { ServidorController } from "./servidor.controller";

@Module({
  controllers: [ServidorController],
})
export class ServidorModule {}