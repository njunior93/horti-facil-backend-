import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../pedido/pedido.entity';
import { Produto } from 'src/produto/produto.entity';

@Entity('pedido_item')
export class PedidoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  produto_id: string;

  @Column({ type: 'int' })
  qtd_solicitado: number;

  @Column({ type: 'int' })
  qtd_recebido?: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Pedido, pedido => pedido.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto, { eager: true })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;
}
