import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { PedidoService } from "./pedido.service";
import { CriarPedidoDto } from "./dto/create-pedido.dto";
import { Pedido } from "./pedido.entity";
import { getSupabaseForUser } from "src/supabaseClient";

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post('/criar-pedido')
  async criarPedido(@Body() criarPedidoDto: CriarPedidoDto,  @Req() req: Request): Promise<Pedido> {
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

    const nomeUsuario = user.user_metadata?.full_name || user.user_metadata?.name;

    const usuarioId = user.id;

    return this.pedidoService.criarPedido(criarPedidoDto, usuarioId, nomeUsuario);
  }

  @Patch('/efetivar-pedido/:id')
  async efetivarPedido(@Param('id') pedidoId: number, @Body() body: {status:string, estoqueId: number, itens: { id: number; qtdRecebida: number }[]}, @Req() req: Request): Promise<Pedido> {
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

    return this.pedidoService.efetivarPedido(pedidoId, body.status, body.estoqueId, body.itens, usuarioId, token);

  }

  @Patch('/cancelar-pedido/:id')
  async cancelarPedido(@Param('id') pedidoId: number, @Body() body: {estoqueId: number} ,@Req() req: Request): Promise<Pedido> {
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

    const nomeUsuario = user.user_metadata?.full_name || user.user_metadata?.name;

    return this.pedidoService.cancelarPedido(pedidoId, usuarioId, nomeUsuario, body.estoqueId, token);
  }

  @Delete('/excluir-pedido')
  async excluirPedido(@Body() body: {pedidoId: number[], estoqueId: number} ,@Req() req: Request): Promise<void> {
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

    await this.pedidoService.excluirPedido(body.pedidoId, usuarioId, body.estoqueId, token);
  }

  @Get('/listar-pedidos')
  async listarPedidos(@Req() req: Request): Promise<Pedido[]> {
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

    return this.pedidoService.listarPedidos(usuarioId, token);
  }

  @Get('/localizar-pedido/:id')
   async localizarPedido(@Req() req: Request, @Param('id') pedidoId: number): Promise<Pedido> {
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

    return this.pedidoService.localizarPedido(usuarioId, token, pedidoId);
  }

}