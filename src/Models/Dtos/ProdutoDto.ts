import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProdutoDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsDate()
  data_preco: string;

  @IsNotEmpty()
  @IsNumber()
  cod_produto: number;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  qtd_estoque: number;

  @IsNotEmpty()
  @IsNumber()
  desconto: number;

  @IsNotEmpty()
  @IsDate()
  data_hora_insercao: Date;

  @IsNotEmpty()
  @IsDate()
  data_inicio: string;

  @IsNotEmpty()
  @IsDate()
  data_fim: string;
}
