import { ErroDeValidacao } from '../domain/errors';
import { ProdutoProps } from '../domain/produto';
import { CadastrarProdutosEmMassa } from './cadastrar-produtos-em-massa';
import { InMemoryProdutoRepository, InMemoryUnitOfWork } from './fakes/in-memory';

function item(overrides: Partial<ProdutoProps> = {}): ProdutoProps {
  return {
    key: 'p-1',
    data_preco: '2026-01-10',
    cod_produto: 100,
    sku: 'SKU-01',
    qtd_estoque: 5,
    desconto: 10,
    data_hora_insercao: '2026-01-10T10:00:00.000Z',
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
    ...overrides,
  };
}

describe('CadastrarProdutosEmMassa', () => {
  let repositorio: InMemoryProdutoRepository;
  let useCase: CadastrarProdutosEmMassa;

  beforeEach(() => {
    repositorio = new InMemoryProdutoRepository();
    useCase = new CadastrarProdutosEmMassa(
      repositorio,
      new InMemoryUnitOfWork(repositorio),
    );
  });

  it('salva todos os itens quando a massa é válida', async () => {
    await useCase.execute([
      item({ key: 'p-1', sku: 'SKU-01' }),
      item({ key: 'p-2', sku: 'SKU-02', cod_produto: 101 }),
    ]);

    expect(repositorio.itens).toHaveLength(2);
    expect(repositorio.itens.map((p) => p.sku.valor)).toEqual(['SKU-01', 'SKU-02']);
  });

  it('não salva nada quando um item falha na validação', async () => {
    await expect(
      useCase.execute([
        item({ key: 'p-1', sku: 'SKU-01' }),
        item({ key: 'p-2', sku: 'SKU-02', desconto: 200 }),
      ]),
    ).rejects.toBeInstanceOf(ErroDeValidacao);

    expect(repositorio.itens).toHaveLength(0);
  });

  it('indica o índice do item inválido', async () => {
    try {
      await useCase.execute([
        item({ key: 'p-1', sku: 'SKU-01' }),
        item({ key: 'p-2', sku: '???' }),
      ]);
      fail('deveria ter lançado');
    } catch (erro) {
      expect(erro).toBeInstanceOf(ErroDeValidacao);
      expect((erro as ErroDeValidacao).detalhes[0]).toMatch(/^Item 1:/);
    }
  });

  it('não salva nada quando há SKU duplicado na massa', async () => {
    await expect(
      useCase.execute([
        item({ key: 'p-1', sku: 'SKU-01' }),
        item({ key: 'p-2', sku: 'SKU-01' }),
      ]),
    ).rejects.toThrow(/SKUs duplicados/);

    expect(repositorio.itens).toHaveLength(0);
  });

  it('faz rollback e não deixa residual quando a persistência falha no meio', async () => {
    repositorio.falharAoSalvarAPartirDe = 1;

    await expect(
      useCase.execute([
        item({ key: 'p-1', sku: 'SKU-01' }),
        item({ key: 'p-2', sku: 'SKU-02' }),
      ]),
    ).rejects.toThrow('falha de persistência');

    expect(repositorio.itens).toHaveLength(0);
  });
});
