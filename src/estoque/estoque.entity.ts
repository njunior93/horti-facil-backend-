import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from '../produto/produto.entity';
import { Pedido } from 'src/pedido/pedido.entity';

@Entity('estoque')
export class Estoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  data: string;

  @Column({type:'int', default: 0})
  contQtdEstoque: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToMany(() => Produto, produto => produto.estoqueRef, { cascade: true })
  listaProdutos: Produto[];

  @OneToMany(() => Pedido, (pedido) => pedido.estoque)
  pedidos: Pedido[];
}