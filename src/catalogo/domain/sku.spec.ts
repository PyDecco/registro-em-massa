import { ErroDeValidacao } from './errors';
import { Sku } from './sku';

describe('Sku', () => {
  it('normaliza para maiúsculas', () => {
    expect(Sku.criar('abc-01').valor).toBe('ABC-01');
  });

  it('aceita letras, números, hífen e underscore', () => {
    expect(Sku.criar('SKU_01-A').valor).toBe('SKU_01-A');
  });

  it('rejeita vazio', () => {
    expect(() => Sku.criar('   ')).toThrow(ErroDeValidacao);
  });

  it('rejeita tipo inválido', () => {
    expect(() => Sku.criar(10)).toThrow(ErroDeValidacao);
  });

  it('rejeita caracteres especiais', () => {
    expect(() => Sku.criar('sku com espaço')).toThrow(ErroDeValidacao);
  });

  it('compara por valor', () => {
    expect(Sku.criar('abc').equals(Sku.criar('ABC'))).toBe(true);
  });
});
