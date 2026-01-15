import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "src/pedido/pedido.entity";  


@Entity('fornecedor')
export class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 15 })
  telefone: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  whatsApp: string;

  @Column({ type: 'boolean', default: false })
  noti_email: boolean;

  @Column({ type: 'boolean', default: false })
  noti_whatsapp: boolean;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToMany(() => Pedido, (pedido) => pedido.fornecedor)
  pedidos: Pedido[];

}