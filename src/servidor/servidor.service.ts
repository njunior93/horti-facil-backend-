import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ServidorService {
  constructor(private readonly dataSource: DataSource) {}

  async checarBanco() {
    await this.dataSource.query('select 1');
    return true;
  }
}
