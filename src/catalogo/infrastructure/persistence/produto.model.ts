import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'produtos', timestamps: false })
export class ProdutoModel extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  key: string;

  @Column(DataType.DATEONLY)
  data_preco: string;

  @Column(DataType.BIGINT)
  cod_produto: number;

  @Column(DataType.STRING)
  sku: string;

  @Column(DataType.FLOAT)
  qtd_estoque: number;

  @Column(DataType.FLOAT)
  desconto: number;

  @Column(DataType.DATE)
  data_hora_insercao: Date;

  @Column(DataType.DATEONLY)
  data_inicio: string;

  @Column(DataType.DATEONLY)
  data_fim: string;
}
