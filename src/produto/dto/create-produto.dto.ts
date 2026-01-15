import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsNumber()
  id: number;

  @IsString()
  nome: string;

  @IsEnum(['horta', 'fruta'])
  tipo: 'horta' | 'fruta';

  @IsNumber()
  estoque?: number;

  @IsBoolean()
 estoqueSuficiente: boolean;

  @IsNumber()
  vendaMensal?: number;

  @IsNumber()
  vendaDiaria?: number;

  @IsNumber()
  tempo?: number;

  @IsNumber()
  lote?: number;

  @IsNumber()
  estoqueMinimo?: number;

  @IsNumber()
  estoqueMaximo?: number;

  @IsString()
  uniMedida?: string;

  @IsString()
  user_id: string;
}