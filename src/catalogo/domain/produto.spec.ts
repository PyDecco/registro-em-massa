import { ErroDeValidacao } from './errors';
import { Produto, ProdutoProps } from './produto';

function propsValidas(overrides: Partial<ProdutoProps> = {}): ProdutoProps {
  return {
    key: 'p-1',
    data_preco: '2026-01-10',
    cod_produto: 100,
    sku: 'sku-01',
    qtd_estoque: 5,
    desconto: 10,
    data_hora_insercao: '2026-01-10T10:00:00.000Z',
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
    ...overrides,
  };
}

describe('Produto', () => {
  it('cria um agregado válido e expõe comportamento', () => {
    const produto = Produto.criar(propsValidas());

    expect(produto.sku.valor).toBe('SKU-01');
    expect(produto.temEstoque()).toBe(true);
    expect(produto.estaVigente(new Date('2026-06-01'))).toBe(true);
    expect(produto.estaVigente(new Date('2027-01-01'))).toBe(false);
    expect(produto.toSnapshot().desconto).toBe(10);
  });

  it('acumula vários erros de invariante', () => {
    try {
      Produto.criar(
        propsValidas({
          key: '',
          cod_produto: -1,
          qtd_estoque: -4,
          desconto: 150,
          sku: '',
        }),
      );
      fail('deveria ter lançado');
    } catch (erro) {
      expect(erro).toBeInstanceOf(ErroDeValidacao);
      const detalhes = (erro as ErroDeValidacao).detalhes;
      expect(detalhes).toEqual(
        expect.arrayContaining([
          'key é obrigatória',
          'cod_produto deve ser maior que zero',
          'qtd_estoque não pode ser negativo',
          'desconto deve estar entre 0 e 100',
          'sku é obrigatório',
        ]),
      );
    }
  });

  it('rejeita período de vigência invertido', () => {
    expect(() =>
      Produto.criar(
        propsValidas({ data_inicio: '2026-12-31', data_fim: '2026-01-01' }),
      ),
    ).toThrow(ErroDeValidacao);
  });
});
