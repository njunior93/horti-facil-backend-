import { Estoque } from 'src/estoque/estoque.entity';
import { Fornecedor } from 'src/fornecedor/fornecedor.entity';
import { PedidoItem } from 'src/pedido-item/pedido-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { StatusPedido } from './StatusPedido';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  data_criacao: Date;

  @Column({ type: 'timestamp', nullable: true})
  data_efetivacao: Date;

  @Column({ type: 'timestamp', nullable: true})
  data_cancelamento: Date;

  @Column({ type: 'int' })
  qtd_itens: number;

  @Column({ type: 'enum', enum: StatusPedido })
  status: StatusPedido;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Estoque, (estoque) => estoque.pedidos, { nullable: true }) 
  @JoinColumn({ name: 'estoque_id' })
  estoque: Estoque;


  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.pedidos, { nullable: false })
  @JoinColumn({ name: 'fornecedor_id' }) 
  fornecedor: Fornecedor;

  @OneToMany(() => PedidoItem, item => item.pedido, { cascade: true, eager: true })
  itens: PedidoItem[];

}