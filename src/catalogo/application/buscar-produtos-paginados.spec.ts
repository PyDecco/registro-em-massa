import { ErroDeValidacao } from '../domain/errors';
import { Produto } from '../domain/produto';
import { BuscarProdutosPaginados } from './buscar-produtos-paginados';
import { InMemoryProdutoRepository } from './fakes/in-memory';

function produto(indice: number): Produto {
  return Produto.criar({
    key: `p-${indice}`,
    data_preco: '2026-01-10',
    cod_produto: indice,
    sku: `SKU-${indice}`,
    qtd_estoque: 1,
    desconto: 0,
    data_hora_insercao: '2026-01-10T10:00:00.000Z',
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
  });
}

describe('BuscarProdutosPaginados', () => {
  it('aplica offset = (page - 1) * limit e calcula totalPages', async () => {
    const repositorio = new InMemoryProdutoRepository();
    repositorio.itens = [produto(1), produto(2), produto(3), produto(4), produto(5)];
    const useCase = new BuscarProdutosPaginados(repositorio);

    const pagina = await useCase.execute(2, 2);

    expect(pagina.data.map((item) => item.sku)).toEqual(['SKU-3', 'SKU-4']);
    expect(pagina.meta).toEqual({
      page: 2,
      limit: 2,
      total: 5,
      totalPages: 3,
    });
  });

  it('retorna página vazia quando não há registros', async () => {
    const useCase = new BuscarProdutosPaginados(new InMemoryProdutoRepository());
    const pagina = await useCase.execute(1, 10);

    expect(pagina.data).toEqual([]);
    expect(pagina.meta.totalPages).toBe(0);
  });

  it('rejeita page inválida', async () => {
    const useCase = new BuscarProdutosPaginados(new InMemoryProdutoRepository());
    await expect(useCase.execute(0, 10)).rejects.toBeInstanceOf(ErroDeValidacao);
  });

  it('rejeita limit fora do intervalo', async () => {
    const useCase = new BuscarProdutosPaginados(new InMemoryProdutoRepository());
    await expect(useCase.execute(1, 0)).rejects.toBeInstanceOf(ErroDeValidacao);
    await expect(useCase.execute(1, 101)).rejects.toBeInstanceOf(ErroDeValidacao);
  });
});
