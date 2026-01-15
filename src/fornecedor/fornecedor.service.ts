import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fornecedor } from './fornecedor.entity';
import { Repository } from 'typeorm';
import { CriarFornecedorDto } from './dto/create-fornecedor-dto';
import { getSupabaseForUser } from 'src/supabaseClient';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor) private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async criarFornecedor(criarFornecedorDto: CriarFornecedorDto, usuarioId: string): Promise<Fornecedor> {
    const fornecedor = this.fornecedorRepository.create({
      nome: criarFornecedorDto.nome,
      email: criarFornecedorDto.email,
      telefone: criarFornecedorDto.telefone,
      whatsApp: criarFornecedorDto.whatsApp,
      noti_email: criarFornecedorDto.noti_email,
      noti_whatsapp: criarFornecedorDto.noti_whatsapp,
      user_id: usuarioId,
    });
    return await this.fornecedorRepository.save(fornecedor);
  }

  async listarFornecedores(usuarioId: string, accessToken: string): Promise<Fornecedor[]> {
   const supa = getSupabaseForUser (accessToken)
   const { data, error } = await supa
     .from('fornecedor')
     .select('*')
     .eq('user_id', usuarioId);

    if (error) {
      throw new Error('Erro ao buscar os fornecedores.');
    }

    return data as Fornecedor[];
  }

  async excluirFornecedor(fornecedorId: string, usuarioId: string, accessToken: string): Promise<void> {
    const supa = getSupabaseForUser (accessToken)

    const { data: pedidos, error: erroPedidos } = await supa
    .from('pedido')
    .select('id')
    .eq('fornecedor_id', fornecedorId) 
    .eq('user_id', usuarioId);

  if (erroPedidos) {
    throw new Error('Erro ao verificar pedidos vinculados.');
  }

  if (pedidos && pedidos.length > 0) {
    throw new Error('Este fornecedor possui pedidos cadastrados e não pode ser excluído.');
  }

    const { error } = await supa
      .from('fornecedor')
      .delete()
      .eq('id', fornecedorId)
      .eq('user_id', usuarioId);

      if (error) {
        if(error.code === '23503'){
          throw new Error('Não foi possível excluir o fornecedor porque ele está vinculado a um pedido.');
        }

      throw new Error(`Erro ao excluir fornecedor: ${error.message}`);
    }
  }

  async editarFornecedor(fornecedorId: string, atualizarDados: Partial<CriarFornecedorDto>, usuarioId: string, accessToken: string): Promise<void> {
    const supa = getSupabaseForUser (accessToken)
    const { data, error } = await supa
      .from('fornecedor')
      .update(atualizarDados)
      .eq('id', fornecedorId)
      .eq('user_id', usuarioId)
      .select()
      .single();

      if (error) {
      throw new Error(`Erro ao editar fornecedor: ${error.message}`);
    }
  }
    
}
