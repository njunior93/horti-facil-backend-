import { IsNumber, IsString } from 'class-validator';

export class CreatePedidoItemDto {
  @IsString()
  produto_id: string;


  @IsNumber()
  qtd_solicitado: number;

  @IsNumber()
  qtd_recebido?: number;

  @IsString()
  user_id: string;
}
