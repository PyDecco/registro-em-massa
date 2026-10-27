import { ErroDeValidacao } from './errors';

function parseData(valor: unknown, campo: string): Date {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor;
  }
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ErroDeValidacao(`${campo} é obrigatória`);
  }

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    throw new ErroDeValidacao(`${campo} não é uma data válida`);
  }
  return data;
}

function inicioDoDia(data: Date): Date {
  return new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()));
}

function fimDoDia(data: Date): Date {
  return new Date(
    Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate(), 23, 59, 59, 999),
  );
}

export class PeriodoVigencia {
  private constructor(
    readonly inicio: Date,
    readonly fim: Date,
  ) {}

  static criar(inicio: unknown, fim: unknown): PeriodoVigencia {
    const dataInicio = inicioDoDia(parseData(inicio, 'data_inicio'));
    const dataFim = fimDoDia(parseData(fim, 'data_fim'));

    if (dataFim < dataInicio) {
      throw new ErroDeValidacao('data_fim deve ser posterior ou igual a data_inicio');
    }

    return new PeriodoVigencia(dataInicio, dataFim);
  }

  contem(em: Date = new Date()): boolean {
    return em >= this.inicio && em <= this.fim;
  }
}
