import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class CriarFornecedorDto {
  @IsString()
  nome: string;

  @IsString()
  telefone: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 15)
  whatsApp: string;

  @IsBoolean()
  noti_email: boolean;

  @IsBoolean()
  noti_whatsapp: boolean;

  @IsString()
  user_id: string;
}