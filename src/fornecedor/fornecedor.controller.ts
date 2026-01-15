import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { CriarFornecedorDto } from './dto/create-fornecedor-dto';
import { Fornecedor } from './fornecedor.entity';
import { getSupabaseForUser } from 'src/supabaseClient';

@Controller('fornecedor')
export class FornecedorController {
    constructor(private readonly fornecedorService: FornecedorService) {}

  @Post('/criar-fornecedor')
  async criarFornecedor(@Body() criarFornecedorDto: CriarFornecedorDto, @Req() req: Request): Promise<Fornecedor> {
    const antesToken = req.headers['authorization'];
    
    if (!antesToken) {
          throw new UnauthorizedException('Token de autenticação não fornecido.');
        }
    
        const token = antesToken.replace('Bearer ', '').trim();
    
        const supabaseWithAuth = getSupabaseForUser(token);
    
        const {data: {user}, error} = await supabaseWithAuth.auth.getUser()
    
        if (error || !user) {
          throw new UnauthorizedException('Token inválido');
        }
    
        const usuarioId = user.id
    
    
        return this.fornecedorService.criarFornecedor(criarFornecedorDto, usuarioId);
  }

  @Get('/listar-fornecedores')
  async listarFornecedores(@Req() req: Request): Promise<Fornecedor[]> {
    const antesToken = req.headers['authorization'];

    if (!antesToken) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    const token = antesToken.replace('Bearer ', '').trim();

    const supabaseWithAuth = getSupabaseForUser(token);

    const {data: {user}, error} = await supabaseWithAuth.auth.getUser()

    if (error || !user) {
      throw new UnauthorizedException('Token inválido');
    }
    const usuarioId = user.id;

    const listaFonrcedores = await this.fornecedorService.listarFornecedores(usuarioId, token);

    return listaFonrcedores;
  }

  @Delete('/excluir-fornecedor/:id')
  async excluirFornecedor(@Param('id') id:string, @Req() req: Request): Promise<void> {
    const antesToken = req.headers['authorization'];

    if (!antesToken) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    const token = antesToken.replace('Bearer ', '').trim();

    const supabaseWithAuth = getSupabaseForUser(token);

    const {data: {user}, error} = await supabaseWithAuth.auth.getUser()

    if (error || !user) {
      throw new UnauthorizedException('Token inválido');
    }
    const usuarioId = user.id;

    try{
      await this.fornecedorService.excluirFornecedor(id, usuarioId, token);
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/editar-fornecedor/:id')
  async editarFornecedor(@Param('id') id: string,@Body() criarFornecedorDto: CriarFornecedorDto,@Req() req: Request): Promise<void> {
    const antesToken = req.headers['authorization'];

    if (!antesToken) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    const token = antesToken.replace('Bearer ', '').trim();

    const supabaseWithAuth = getSupabaseForUser(token);

    const { data: { user }, error } = await supabaseWithAuth.auth.getUser();

    if (error || !user) {
      throw new UnauthorizedException('Token inválido');
    }
    const usuarioId = user.id;

    await this.fornecedorService.editarFornecedor(id, criarFornecedorDto, usuarioId, token);
  }

}

