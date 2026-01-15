import { IsDateString, IsArray, ValidateNested, IsUUID, IsNumber, IsString } from 'class-validator';
import { CreateProdutoDto } from '../../produto/dto/create-produto.dto';
import { Type } from 'class-transformer';

export class CreateEstoqueDto {
  @IsDateString()
  data: string;

  @IsNumber()
  contQtdEstoque: number;

  @IsString()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProdutoDto)
  listaProdutos: CreateProdutoDto[];
}