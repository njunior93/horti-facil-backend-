import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ServidorService } from './servidor.service';


@Controller()
export class ServidorController {
  constructor(private readonly servidorService: ServidorService) {}

  @Get('api-status')
  apistatus() {
    return { api: 'ok' };
  }

  @Get('db-status')
  async dbstatus(){
    try{
      await this.servidorService.checarBanco();
      return { db: 'ok' };
    } catch {
      return {db : 'error'};
    }
  }
}

