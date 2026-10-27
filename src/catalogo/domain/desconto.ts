import { ErroDeValidacao } from './errors';

export class Desconto {
  private constructor(readonly percentual: number) {}

  static criar(valor: unknown): Desconto {
    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      throw new ErroDeValidacao('desconto deve ser um número');
    }
    if (valor < 0 || valor > 100) {
      throw new ErroDeValidacao('desconto deve estar entre 0 e 100');
    }

    return new Desconto(valor);
  }

  aplicarSobre(preco: number): number {
    return preco * (1 - this.percentual / 100);
  }
}
