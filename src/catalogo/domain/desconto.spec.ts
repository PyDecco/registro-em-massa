import { Desconto } from './desconto';
import { ErroDeValidacao } from './errors';

describe('Desconto', () => {
  it('aceita 0 e 100', () => {
    expect(Desconto.criar(0).percentual).toBe(0);
    expect(Desconto.criar(100).percentual).toBe(100);
  });

  it('aplica percentual sobre um preço', () => {
    expect(Desconto.criar(10).aplicarSobre(200)).toBe(180);
  });

  it('rejeita valor negativo', () => {
    expect(() => Desconto.criar(-1)).toThrow(ErroDeValidacao);
  });

  it('rejeita valor acima de 100', () => {
    expect(() => Desconto.criar(101)).toThrow(ErroDeValidacao);
  });

  it('rejeita não-número', () => {
    expect(() => Desconto.criar('10')).toThrow(ErroDeValidacao);
    expect(() => Desconto.criar(Number.NaN)).toThrow(ErroDeValidacao);
  });
});
