import { ErroDeValidacao } from '../domain/errors';
import { ProdutoSnapshot } from '../domain/produto';
import { ProdutoRepository } from './ports';

export type PaginaProdutos = {
  data: ProdutoSnapshot[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class BuscarProdutosPaginados {
  constructor(private readonly produtos: ProdutoRepository) {}

  async execute(page: number, limit: number): Promise<PaginaProdutos> {
    if (!Number.isInteger(page) || page < 1) {
      throw new ErroDeValidacao('page deve ser um inteiro maior ou igual a 1');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ErroDeValidacao('limit deve ser um inteiro entre 1 e 100');
    }

    const { itens, total } = await this.produtos.buscarPaginado(page, limit);

    return {
      data: itens.map((produto) => produto.toSnapshot()),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }
}
