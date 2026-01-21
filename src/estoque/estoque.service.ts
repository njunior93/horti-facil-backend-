import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estoque } from './estoque.entity';
import { In, Repository } from 'typeorm';
import { Produto } from 'src/produto/produto.entity';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { getSupabaseForUser  } from '../supabaseClient';

@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(Estoque) private readonly estoqueRepository: Repository<Estoque>,
    @InjectRepository(Produto) private readonly produtoRepository: Repository<Produto>,
  ) {}

  async criarEstoque(createEstoqueDto: CreateEstoqueDto, usuarioId: string): Promise<Estoque> {
    const produtos = createEstoqueDto.listaProdutos.map(prodDto => {
        const produto = this.produtoRepository.create({
          ...prodDto,
          user_id: usuarioId,
        });
        return produto;
    });

    const estoque = this.estoqueRepository.create({
      data: createEstoqueDto.data,
      contQtdEstoque: createEstoqueDto.contQtdEstoque,
      listaProdutos: produtos,
      user_id: usuarioId
    });

    return this.estoqueRepository.save(estoque);
  }

  async getEstoqueId(usuarioId: string, accessToken: string): Promise<{ estoqueId: number }> {
    const supa = getSupabaseForUser (accessToken)
    const { data, error } = await supa
      .from('estoque')
      .select('id')
      .eq('user_id', usuarioId)
      .maybeSingle();

    if (error) {
      throw new Error('Erro ao buscar o estoque.');
    }

    if (!data) {
      throw new Error('Estoque nao encontrado para o usuario.');
    }

    return { estoqueId: data.id };

  }

  async estoqueExistente(usuarioId: string, accessToken: string): Promise<boolean>{
    const supa = getSupabaseForUser (accessToken)
    const {data, error} = await supa
      .from('estoque')
      .select('*')
      .eq('user_id', usuarioId)
      .limit(1);

  if (error) {
      throw new Error('Erro ao buscar o estoque.');
    }

    return data && data.length > 0;
  }

  async listarEstoqueComProdutos(usuarioId: string, accessToken: string): Promise<any> {
    const supa = getSupabaseForUser (accessToken)
    const { data, error } = await supa
  .from('estoque')
  .select(`
    id,
    data,
    contQtdEstoque,
    user_id,
    listaProdutos:produto_estoqueRefId_fkey(
        id,
        nome,
        tipo,
        estoque,
        estoqueMinimo,
        estoqueMaximo,
        uniMedida,
        estoqueSuficiente       
    )
  `)
  .eq('user_id', usuarioId)
  .maybeSingle();


    if (error) {
      console.error('Erro real ao listar estoque com produtos:', error);
      throw new Error('Erro ao buscar o estoque com produtos.');
    }

    return data;
    
  }

  async listarMovimentacoes(usuarioId: string, accessToken: string, estoqueId: number): Promise<any> {
    const supa = getSupabaseForUser (accessToken)
    const { data, error } = await supa
      .from('produto_mov')
      .select('qtdMov, tipoMov, tipoSaida, tipoEntrada, dataMov, nome, saldo_anterior, saldo_atual, pedido_compra_id ,produto(nome)')
      .eq('user_id', usuarioId)
      .eq('estoque_id', estoqueId);

    if (error) {
      throw new Error('Erro ao buscar o estoque com produtos.');
    }

    return data;
  }
  

  async atualizarEstoque( estoqueId: number, produtoId: number, tipoMov: 'entrada' | 'saida', qtdMov: number ,usuarioId: string, accessToken: string, nome: string, tipoSaida?: string, tipoEntrada?: string): Promise<any> {
    const supa = getSupabaseForUser (accessToken);

    const { error } = await supa.rpc('atualizar_estoque_mov', {
    estoque_id: estoqueId,
    produto_id: produtoId,
    tipo_mov: tipoMov,
    qtd_mov: qtdMov,
    tipo_saida: tipoSaida,
    tipo_entrada: tipoEntrada,
    user_id: usuarioId,
    nome: nome
  });

  if (error) {
    throw new BadRequestException(`Erro ao atualizar estoque: ${error.message}`);
  }

  const { data: produtoAtualizado, error: fetchError } = await supa
    .from('produto')
    .select('*')
    .eq('id', produtoId)
    .eq('estoqueRefId', estoqueId)
    .single();

  if (fetchError || !produtoAtualizado) {
    throw new BadRequestException('Erro ao buscar produto atualizado.');
  }

    return produtoAtualizado;

  }
}
