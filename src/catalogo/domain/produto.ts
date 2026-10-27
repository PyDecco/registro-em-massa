import { Desconto } from './desconto';
import { ErroDeValidacao } from './errors';
import { PeriodoVigencia } from './periodo-vigencia';
import { Sku } from './sku';

export type ProdutoProps = {
  key: string;
  data_preco: string | Date;
  cod_produto: number;
  sku: string;
  qtd_estoque: number;
  desconto: number;
  data_hora_insercao: string | Date;
  data_inicio: string | Date;
  data_fim: string | Date;
};

export type ProdutoSnapshot = {
  key: string;
  data_preco: string;
  cod_produto: number;
  sku: string;
  qtd_estoque: number;
  desconto: number;
  data_hora_insercao: string;
  data_inicio: string;
  data_fim: string;
};

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

export class Produto {
  private constructor(
    readonly key: string,
    readonly dataPreco: Date,
    readonly codigo: number,
    readonly sku: Sku,
    readonly quantidadeEstoque: number,
    readonly desconto: Desconto,
    readonly dataHoraInsercao: Date,
    readonly vigencia: PeriodoVigencia,
  ) {}

  static criar(props: Partial<ProdutoProps>): Produto {
    const erros: string[] = [];

    const registrar = <T>(factory: () => T): T | undefined => {
      try {
        return factory();
      } catch (erro) {
        if (erro instanceof ErroDeValidacao) {
          erros.push(erro.message);
          return undefined;
        }
        throw erro;
      }
    };

    const key = registrar(() => {
      if (typeof props.key !== 'string' || props.key.trim() === '') {
        throw new ErroDeValidacao('key é obrigatória');
      }
      return props.key.trim();
    });

    const dataPreco = registrar(() => parseData(props.data_preco, 'data_preco'));

    const codigo = registrar(() => {
      if (typeof props.cod_produto !== 'number' || !Number.isInteger(props.cod_produto)) {
        throw new ErroDeValidacao('cod_produto deve ser um inteiro');
      }
      if (props.cod_produto <= 0) {
        throw new ErroDeValidacao('cod_produto deve ser maior que zero');
      }
      return props.cod_produto;
    });

    const sku = registrar(() => Sku.criar(props.sku));

    const quantidadeEstoque = registrar(() => {
      if (typeof props.qtd_estoque !== 'number' || Number.isNaN(props.qtd_estoque)) {
        throw new ErroDeValidacao('qtd_estoque deve ser um número');
      }
      if (props.qtd_estoque < 0) {
        throw new ErroDeValidacao('qtd_estoque não pode ser negativo');
      }
      return props.qtd_estoque;
    });

    const desconto = registrar(() => Desconto.criar(props.desconto));
    const dataHoraInsercao = registrar(() =>
      parseData(props.data_hora_insercao, 'data_hora_insercao'),
    );
    const vigencia = registrar(() =>
      PeriodoVigencia.criar(props.data_inicio, props.data_fim),
    );

    if (erros.length > 0 || !key || !dataPreco || !codigo || !sku || quantidadeEstoque === undefined || !desconto || !dataHoraInsercao || !vigencia) {
      throw new ErroDeValidacao(erros.join('; '), erros);
    }

    return new Produto(
      key,
      dataPreco,
      codigo,
      sku,
      quantidadeEstoque,
      desconto,
      dataHoraInsercao,
      vigencia,
    );
  }

  estaVigente(em: Date = new Date()): boolean {
    return this.vigencia.contem(em);
  }

  temEstoque(): boolean {
    return this.quantidadeEstoque > 0;
  }

  toSnapshot(): ProdutoSnapshot {
    return {
      key: this.key,
      data_preco: this.dataPreco.toISOString().slice(0, 10),
      cod_produto: this.codigo,
      sku: this.sku.valor,
      qtd_estoque: this.quantidadeEstoque,
      desconto: this.desconto.percentual,
      data_hora_insercao: this.dataHoraInsercao.toISOString(),
      data_inicio: this.vigencia.inicio.toISOString().slice(0, 10),
      data_fim: this.vigencia.fim.toISOString().slice(0, 10),
    };
  }
}
