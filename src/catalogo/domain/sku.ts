import { ErroDeValidacao } from './errors';

export class Sku {
  private constructor(readonly valor: string) {}

  static criar(valor: unknown): Sku {
    if (typeof valor !== 'string' || valor.trim() === '') {
      throw new ErroDeValidacao('sku é obrigatório');
    }

    const normalizado = valor.trim().toUpperCase();
    if (normalizado.length > 64) {
      throw new ErroDeValidacao('sku deve ter no máximo 64 caracteres');
    }
    if (!/^[A-Z0-9][A-Z0-9\-_]*$/.test(normalizado)) {
      throw new ErroDeValidacao(
        'sku deve começar com letra ou número e conter apenas letras, números, hífen ou underscore',
      );
    }

    return new Sku(normalizado);
  }

  equals(outro: Sku): boolean {
    return this.valor === outro.valor;
  }
}
