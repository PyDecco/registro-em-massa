import { Produto } from '../domain/produto';

export const PRODUTO_REPOSITORY = Symbol('PRODUTO_REPOSITORY');
export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK');

export type PaginaDeProdutos = {
  itens: Produto[];
  total: number;
};

export interface ProdutoRepository {
  salvarEmMassa(produtos: Produto[]): Promise<void>;
  buscarPaginado(page: number, limit: number): Promise<PaginaDeProdutos>;
}

export interface UnitOfWork {
  execute<T>(trabalho: () => Promise<T>): Promise<T>;
}
