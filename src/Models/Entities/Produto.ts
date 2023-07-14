import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Produto extends Model<Produto> {
    @Column(DataType.UUID)
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