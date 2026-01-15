import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';
import { EstoqueModule } from './estoque/estoque.module';
import { ProdutoMovModule } from './produto-mov/produto-mov.module';
import { ServidorModule } from './servidor/servidor.module';
import { PedidoModule } from './pedido/pedido.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'db.cbpfbcatmqkfspwwfeaw.supabase.co',
      port: 5432,
      username: 'postgres',
      password: 'cagaverde123',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ProdutoModule,
    EstoqueModule,
    ProdutoMovModule,
    ServidorModule,
    PedidoModule,
    FornecedorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
