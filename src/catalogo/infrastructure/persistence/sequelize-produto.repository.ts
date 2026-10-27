import { Inject, Injectable } from '@nestjs/common';
import { PaginaDeProdutos, ProdutoRepository } from '../../application/ports';
import { Produto } from '../../domain/produto';
import { ProdutoModel } from './produto.model';
import { SequelizeUnitOfWork } from './sequelize-unit-of-work';

const TAMANHO_LOTE = 10_000;

@Injectable()
export class SequelizeProdutoRepository implements ProdutoRepository {
  constructor(
    @Inject('PRODUTOS_REPOSITORY')
    private readonly model: typeof ProdutoModel,
    private readonly unitOfWork: SequelizeUnitOfWork,
  ) {}

  async salvarEmMassa(produtos: Produto[]): Promise<void> {
    const transaction = this.unitOfWork.transacao();
    const linhas = produtos.map((produto) => produto.toSnapshot());

    for (let i = 0; i < linhas.length; i += TAMANHO_LOTE) {
      const lote = linhas.slice(i, i + TAMANHO_LOTE);
      await this.model.bulkCreate(lote, { transaction });
    }
  }

  async buscarPaginado(page: number, limit: number): Promise<PaginaDeProdutos> {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      limit,
      offset,
      order: [['sku', 'ASC']],
    });

    return {
      total: count,
      itens: rows.map((row) =>
        Produto.criar({
          key: row.key,
          data_preco: row.data_preco,
          cod_produto: Number(row.cod_produto),
          sku: row.sku,
          qtd_estoque: Number(row.qtd_estoque),
          desconto: Number(row.desconto),
          data_hora_insercao: row.data_hora_insercao,
          data_inicio: row.data_inicio,
          data_fim: row.data_fim,
        }),
      ),
    };
  }
}
