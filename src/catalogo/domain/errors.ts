export class ErroDeDominio extends Error {
  constructor(
    message: string,
    readonly codigo: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ErroDeValidacao extends ErroDeDominio {
  constructor(
    message: string,
    readonly detalhes: string[] = [],
  ) {
    super(message, 'VALIDACAO');
  }
}
