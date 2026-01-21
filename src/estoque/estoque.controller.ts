import { Body, Controller, Get, Param, Patch, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { Estoque } from './estoque.entity';
import {getSupabaseForUser} from '../supabaseClient';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Post('/criar-estoque')
  async criarEstoque(@Body() createEstoqueDto: CreateEstoqueDto, @Req() req: Request): Promise<Estoque> {
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


    return this.estoqueService.criarEstoque(createEstoqueDto, usuarioId);

    
  }

  @Get('/verificar-estoque')
  async verificarEstoque(@Req() req: Request){
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

    const existe = await this.estoqueService.estoqueExistente(usuarioId, token);

    return {existe}
  }

  @Get('lista-produtos')
  async listarProdutos(@Req() req: Request){
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

    const listaProdutos = await this.estoqueService.listarEstoqueComProdutos(usuarioId, token);

    return listaProdutos;
  }

  @Get('lista-movimentacoes')
  async listarMovimentacoes(@Req() req: Request, @Query('estoqueId') estoqueId: number){
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

    const listaMovimentacoes = await this.estoqueService.listarMovimentacoes(usuarioId, token, estoqueId);
    
    return listaMovimentacoes;
  }

  @Patch("/atualizar-produto/:id")
  async atualizarProduto(@Req() req: Request, @Param('id') produtoId: number, @Body() body: {qtdMov: number, tipoMov: 'entrada' | 'saida', estoqueId: number, tipoSaida?: string, tipoEntrada?: string, nome: string, estoque_prod_mov:number}) {
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

    return this.estoqueService.atualizarEstoque(Number(body.estoqueId), Number(produtoId), body.tipoMov, body.qtdMov, usuarioId, token, body.nome ,body.tipoSaida, body.tipoEntrada);
  }

  @Get('/id-estoque')
  async getEstoqueId(@Req() req: Request) {
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

        return this.estoqueService.getEstoqueId(usuarioId, token);
  }

}


