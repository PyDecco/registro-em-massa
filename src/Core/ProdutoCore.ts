
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { validate } from "class-validator";
import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";
import { IProdutoCore } from "src/Ports/In/IProdutoCore";

interface FieldDefinition {
  field: keyof ProdutoDto;
  type: string;
}

@Injectable()
export class ProdutoCore implements IProdutoCore {
  
  constructor() {}
  LanceUmErroParaNenhumProdutoEncontrado(produto: ProdutoDto[]): void {
    if(produto.length == 0){
      throw new NotFoundException("Produtos Not Found");
    }
  }

  async ValidadorProduto(produto: ProdutoDto): Promise<void> {
    const fieldDefinitions: FieldDefinition[] = [
      { field: 'key', type: 'string' },
      { field: 'data_preco', type: 'string' },
      { field: 'cod_produto', type: 'number' },
      { field: 'sku', type: 'string' },
      { field: 'qtd_estoque', type: 'number' },
      { field: 'desconto', type: 'number' },
      { field: 'data_hora_insercao', type: 'string' },
      { field: 'data_inicio', type: 'string' },
      { field: 'data_fim', type: 'string' },
    ];
    const errors: string[] = [];
  
    for (const definition of fieldDefinitions) {
      const { field, type } = definition;
  
      if (typeof produto[field] !== type) {
        errors.push(`O campo '${field}' Está incorreto ou Ausente. Deve ser do tipo '${type}'.`);
      }
    }
  
    if (errors.length > 0) {
      const errorMessage = errors.join(' \n');
      throw new UnauthorizedException(errorMessage);
    }
  }
  
}

