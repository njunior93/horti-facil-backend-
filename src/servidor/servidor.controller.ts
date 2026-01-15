import { Controller, Get } from '@nestjs/common';

@Controller('status-servidor')
export class ServidorController { @Get() check() 
  {
    return { status: 'ok' };
  }
}