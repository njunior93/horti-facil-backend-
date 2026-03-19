import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ServidorService } from './servidor.service';


@Controller()
export class ServidorController {
  constructor(private readonly servidorService: ServidorService) {}

  @Get('health')
  async health(){
  try{
    await this.servidorService.checarBanco();
    return { status: 'ok' };
  } catch {
    return { status: 'error' };
  }
}
}

