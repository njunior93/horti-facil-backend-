import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Produto } from '../produto/produto.entity';
import { TipoMov } from '../enum/tipoMov';

@Entity()
export class ProdutoMov {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  qtdMov: number;

  @Column({ type: 'varchar', nullable: true })
  tipoSaida?: string;

  @Column({ type: 'varchar', nullable: true })
  tipoEntrada?: string;

  @Column({ type: 'enum', enum: TipoMov })
  tipoMov: TipoMov;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataMov: Date;

  @Column({ type: 'int', nullable: true })
  pedido_compra_id?: number;

  @ManyToOne(() => Produto, { eager: true })
  produto: Produto;

}