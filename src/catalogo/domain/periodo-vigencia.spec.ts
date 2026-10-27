import { ErroDeValidacao } from './errors';
import { PeriodoVigencia } from './periodo-vigencia';

describe('PeriodoVigencia', () => {
  it('aceita intervalo válido', () => {
    const periodo = PeriodoVigencia.criar('2026-01-01', '2026-12-31');
    expect(periodo.contem(new Date('2026-06-01'))).toBe(true);
    expect(periodo.contem(new Date('2025-12-31'))).toBe(false);
  });

  it('aceita início igual ao fim', () => {
    const periodo = PeriodoVigencia.criar('2026-03-01', '2026-03-01');
    expect(periodo.contem(new Date('2026-03-01T12:00:00Z'))).toBe(true);
  });

  it('rejeita fim anterior ao início', () => {
    expect(() => PeriodoVigencia.criar('2026-12-31', '2026-01-01')).toThrow(
      ErroDeValidacao,
    );
  });

  it('rejeita data inválida', () => {
    expect(() => PeriodoVigencia.criar('ontem', '2026-01-01')).toThrow(
      ErroDeValidacao,
    );
  });
});
