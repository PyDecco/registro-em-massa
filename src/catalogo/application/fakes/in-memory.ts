import { Produto } from '../../domain/produto';
import { PaginaDeProdutos, ProdutoRepository, UnitOfWork } from '../ports';

export class InMemoryProdutoRepository implements ProdutoRepository {
  itens: Produto[] = [];
  falharAoSalvarAPartirDe = Number.POSITIVE_INFINITY;

  async salvarEmMassa(produtos: Produto[]): Promise<void> {
    for (let i = 0; i < produtos.length; i += 1) {
      if (i >= this.falharAoSalvarAPartirDe) {
        throw new Error('falha de persistência');
      }
      this.itens.push(produtos[i]);
    }
  }

  async buscarPaginado(page: number, limit: number): Promise<PaginaDeProdutos> {
    const offset = (page - 1) * limit;
    return {
      itens: this.itens.slice(offset, offset + limit),
      total: this.itens.length,
    };
  }
}

export class InMemoryUnitOfWork implements UnitOfWork {
  constructor(private readonly repositorio: InMemoryProdutoRepository) {}

  async execute<T>(trabalho: () => Promise<T>): Promise<T> {
    const snapshot = [...this.repositorio.itens];
    try {
      return await trabalho();
    } catch (erro) {
      this.repositorio.itens = snapshot;
      throw erro;
    }
  }
}
