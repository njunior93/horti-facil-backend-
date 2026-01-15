import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estoque } from '../estoque/estoque.entity';


@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'varchar' })
  tipo: 'horta' | 'fruta';

  @Column({ nullable: true })
  estoque: number;

  @Column({ nullable: true })
  estoqueSuficiente: boolean;

  @Column({ nullable: true })
  vendaMensal: number;

  @Column({ nullable: true })
  vendaDiaria: number;

  @Column({ nullable: true })
  tempo: number;

  @Column({ nullable: true })
  lote: number;

  @Column({ nullable: true })
  estoqueMinimo: number;

  @Column({ nullable: true })
  estoqueMaximo: number;

  @Column({ nullable: true })
  uniMedida: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Estoque, (estoque) => estoque.listaProdutos, { nullable: true })
  estoqueRef: Estoque;
}