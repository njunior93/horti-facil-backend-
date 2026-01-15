import { Type } from 'class-transformer';
import { IsDateString, IsArray, ValidateNested, IsUUID, IsNumber, IsString, isBoolean, IsBoolean, IsEnum, IsDate, isNumber, isDateString } from 'class-validator';
import { CreatePedidoItemDto } from 'src/pedido-item/dto/create-pedido-item.dto';
import { StatusPedido } from '../StatusPedido';

export class CriarPedidoDto {
  @IsDateString()
  data_criacao: string;

  @IsDateString()
  data_efetivacao?: string;

  @IsDateString()
  data_cancelamento?: string;
  
  // @IsNumber()
  // qtd_itens: number;

  @IsEnum(StatusPedido)
  status: StatusPedido;

  @IsUUID()
  fornecedor_id: string;

  @IsNumber()
  estoque_id: number;

  @IsUUID()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  itens: CreatePedidoItemDto[];
}