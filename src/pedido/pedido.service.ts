import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CriarPedidoDto } from './dto/create-pedido.dto';
import { PedidoItem } from '../pedido-item/pedido-item.entity';
import { getSupabaseForUser } from 'src/supabaseClient';
import { Logger } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PedidoService {
  private readonly logger = new Logger(PedidoService.name);
  constructor(
    @InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>, private emailService: EmailService,

    @InjectRepository(PedidoItem) private readonly pedidoItemRepository: Repository<PedidoItem>,
  ) {}

  async criarPedido(criarPedidoDto: CriarPedidoDto, usuarioId: string, nomeUsuario: string): Promise<Pedido> {
    const itensPedidos = criarPedidoDto.itens.map(item => ({
      produto_id: item.produto_id,
      qtd_solicitado: item.qtd_solicitado,
      user_id: usuarioId
    }));

    const pedido = this.pedidoRepository.create({
      data_criacao: new Date(criarPedidoDto.data_criacao),
      qtd_itens: criarPedidoDto.itens.length,
      status: criarPedidoDto.status,
      fornecedor: {id: criarPedidoDto.fornecedor_id},
      user_id: usuarioId,
      estoque: { id: criarPedidoDto.estoque_id },
      itens: itensPedidos
    });

    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    const pedidoComFornecedor = await this.pedidoRepository.findOne({
      where: { id: pedidoSalvo.id },
      relations: [
        'fornecedor',
        'itens',
        'itens.produto'
      ],
    });
 
    
    const fornecedor = pedidoComFornecedor?.fornecedor;

    if(fornecedor?.noti_email && fornecedor.email){
      try{
        await this.emailService.enviarEmail(fornecedor.email,
        `Novo pedido de compra. Cliente: ${nomeUsuario}`,
        `
          <p>Olá <b>${fornecedor.nome}</b>,</p>
          <p>Um novo pedido foi gerado por ${nomeUsuario}.</p>
          <p><b>Número do pedido:</b> ${pedido.id} </p>
          <p><b>Data de Criação e Hora:</b> ${new Date(pedido.data_criacao).toLocaleDateString()} - ${new Date(pedido.data_criacao).toLocaleTimeString()}</p>
          <p><b>Itens:</b></p> 
            <ul> 
              ${pedidoComFornecedor?.itens.map(produto => `<li> <b>Produto</b>: ${produto.produto.nome} — <b>Unidade de Medida:</b> ${produto.produto.uniMedida} — <b>Quantidade Solicitada:</b> ${produto.qtd_solicitado}</li>`).join("")}
            </ul>

          <p>Não responda este email</p>
        `,
        )
      }catch(error){
        console.error('Erro ao enviar email:', error.message)
      }  
    }

    if (!pedidoComFornecedor) {
      throw new NotFoundException(`Pedido ${pedidoSalvo.id} não encontrado`);
    }

    return pedidoComFornecedor;

  }

  async efetivarPedido(pedidoId: number, status: string, estoqueId: number,itens: {id: number, qtdRecebida: number}[],usuarioId: string, accessToken:string): Promise<Pedido> {
    const supa = getSupabaseForUser (accessToken);

    for (const item of itens) {
      const {error: errUpdateItem} = await supa
      .from('pedido_item')
      .update({qtd_recebido: item.qtdRecebida})
      .eq('produto_id', item.id)
      .eq('pedido_id', pedidoId)
      .eq('user_id', usuarioId);

      if (errUpdateItem) {
        throw new BadRequestException(`Erro ao atualizar quantidade recebida: ${errUpdateItem.message}`);
      }
    }

    const { data, error } = await supa.rpc('efetivar_pedido_mov', {
      p_pedido_id: pedidoId,
      status_pedido: status,
      usuario_id: usuarioId,
      id_estoque: estoqueId
    });

    if (error) {
        throw new BadRequestException(`Erro ao efetivar pedido: ${error.message}`);
    }

    return data;
  }

  async cancelarPedido(pedidoId:number, usuarioId:string, estoqueId: number, accessToken:string): Promise<Pedido> {
    const supa = getSupabaseForUser (accessToken);

    const { error: erroMov } = await supa.rpc('cancelar_pedido_mov', {
      p_pedido_id: pedidoId,
      usuario_id: usuarioId,
      id_estoque: estoqueId
    });

    if (erroMov) {
        throw new BadRequestException(`Erro ao cancelar pedido: ${erroMov.message}`);
    }

    const { data, error: cancelaPedido } = await supa
      .from('pedido')
      .update({ status: 'cancelado'})
      .eq('id', pedidoId)
      .eq('user_id', usuarioId)
      .eq('estoque_id', estoqueId)
      .select()
      .single();

      if (cancelaPedido) {
        throw new BadRequestException(`Erro ao cancelar pedido: ${cancelaPedido.message}`);
      }

    return data;

  }

  async excluirPedido(pedidoId:number[], usuarioId:string, estoqueId: number, accessToken:string): Promise<void> {
    const supa = getSupabaseForUser (accessToken);

    for (const id of pedidoId){
        const { error: erroExc } = await supa.rpc('excluir_pedido_item', {
        p_pedido_id: id,
        usuario_id: usuarioId,
      });

      if (erroExc) {
          throw new BadRequestException(`Erro ao excluir pedido: ${erroExc.message}`);
      }
    }

    const { error: excluirPedido } = await supa
      .from('pedido')
      .delete()
      .in('id', pedidoId)
      .is('data_efetivacao', null)
      .eq('status', 'cancelado')
      .eq('estoque_id', estoqueId)
      .eq('user_id', usuarioId);

      if (excluirPedido) {
        throw new BadRequestException(`Erro ao excluir pedido: ${excluirPedido.message}`);
      }

  }

  async listarPedidos(usuarioId: string, accessToken: string): Promise<Pedido[]> {
    const supa = getSupabaseForUser (accessToken)
    const { data, error } = await supa
      .from('pedido')
      .select(`
      *,
      fornecedor:fornecedor_id ( nome ),
      itens:pedido_item (
        id,
        qtd_solicitado,
        qtd_recebido,
        produto:produto_id (
          id,
          nome,
          uniMedida,
          estoqueMinimo
        )
      )
    `)
      .eq('user_id', usuarioId);

      if (error) {
      throw new Error('Erro ao buscar os pedidos.');
    }

    return data as Pedido[];

  }

  async localizarPedido(usuarioId: string, accessToken: string, pedidoId: number): Promise<Pedido>{
    const supa = getSupabaseForUser(accessToken)
    const {data: pedido, error: errorPedido} = await supa
    .from('pedido')
    .select('*, fornecedor:fornecedor_id (nome)')
    .eq('user_id', usuarioId)
    .eq('id', pedidoId)
    .single();

    if (errorPedido) {
      throw new Error('Erro ao buscar o pedido de compra.');
    }

    const {data: itens, error: errItens} = await supa
    .from('pedido_item')
    .select('produto_id,qtd_solicitado,qtd_recebido,produto:produto_id(id, nome, estoqueMinimo, uniMedida)')
    .eq('user_id', usuarioId)
    .eq('pedido_id', Number(pedidoId));

    if (errItens) {
      throw new Error('Erro ao buscar os itens');
    }

    return {... pedido, itens }
  }

}
