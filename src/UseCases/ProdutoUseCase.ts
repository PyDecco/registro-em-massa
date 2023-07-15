import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { LogCore } from 'src/Core/LogCore';
import { ProdutoDto } from 'src/Models/Dtos/ProdutoDto';
import { IProdutoCore } from 'src/Ports/In/IProdutoCore';
import { IProdutoUseCase } from 'src/Ports/In/IProdutoUseCase';
import { ITransformadorTipagemDeDado } from 'src/Ports/In/ITransformadorTipagemDeDado';
import { IProdutoRepository } from 'src/Ports/Out/IProdutoRepository';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject('IProdutoRepository') private produtoRepository: IProdutoRepository,
    @Inject('IProdutoCore')private produtoCore: IProdutoCore,
    @Inject('ITransformadorTipagemDeDado')private transformadorTipagemDeDados: ITransformadorTipagemDeDado,
    private logger: LogCore) {}
    
  getHello(): string {
    return 'Hello World!';
  }

  public async BuscaDeProdutoPorPaginacao(row_count: number ,row_skip: number): Promise<any> { 
    const offset = (row_count - 1) * row_skip;
    this.logger.logInfo(`GET /produtos - parametros row_count:${row_count} & row_skip:${row_skip}`);
    var {count, rows} = await this.produtoRepository.BusqueProdutosPorPaginacao(offset);
    this.produtoCore.LanceUmErroParaNenhumProdutoEncontrado(rows);
    return {
      totalItems: count,
      currentPage: row_count,
      totalPages: Math.ceil(count / row_skip),
      data: rows,
    };   
  }
  
  public async RegitroEmMassa(buffer: Buffer): Promise<void> {
    const massaDeProdutos = this.transformadorTipagemDeDados.BuffParaJson(buffer);
    this.logger.logInfo(`POST /produtos - Quantidade de itens inseridas são de: ${massaDeProdutos.length}`);
    
    const transaction = await this.produtoRepository.CrieUmaTransaction();
    await this.OrganizadorDeMassaDeProduto(massaDeProdutos, transaction);
    await this.produtoRepository.ConcretizeAsTransacoes(transaction);
  }

  private async OrganizadorDeMassaDeProduto(massaDeProdutos: ProdutoDto[], transaction: Transaction): Promise<void> {
    const tamanhoLote = 10000;
    for (let i = 0 ; i < massaDeProdutos.length ; i+=tamanhoLote) {  
      try {
        const lote = massaDeProdutos.slice(i, i + tamanhoLote);
        await this.AnalisadorUnitarioDeProduto(lote);
        await this.produtoRepository.CrieProdutosEmMassa(lote,transaction);        
      }catch(error){
        await this.produtoRepository.realizeUmRolback(transaction);
        throw error
      }
    }
  }

  private async AnalisadorUnitarioDeProduto(lote: ProdutoDto[]) {
    for (const produto of lote){
      await this.produtoCore.ValidadorProduto(produto);
    }
  }
}
