import { ErroDeValidacao } from '../domain/errors';
import { Produto } from '../domain/produto';
import { ProdutoRepository, UnitOfWork } from './ports';

export class CadastrarProdutosEmMassa {
  constructor(
    private readonly produtos: ProdutoRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(entrada: unknown): Promise<void> {
    const massa = this.garantirArray(entrada);
    const produtos = this.materializarTodosOuNenhum(massa);
    this.garantirSkusUnicos(produtos);

    await this.unitOfWork.execute(async () => {
      await this.produtos.salvarEmMassa(produtos);
    });
  }

  private garantirArray(entrada: unknown): unknown[] {
    if (!Array.isArray(entrada)) {
      throw new ErroDeValidacao('A massa de produtos deve ser um array');
    }
    if (entrada.length === 0) {
      throw new ErroDeValidacao('A massa de produtos não pode ser vazia');
    }
    return entrada;
  }

  private materializarTodosOuNenhum(massa: unknown[]): Produto[] {
    const produtos: Produto[] = [];
    const erros: string[] = [];

    massa.forEach((item, indice) => {
      try {
        if (item === null || typeof item !== 'object' || Array.isArray(item)) {
          throw new ErroDeValidacao('deve ser um objeto');
        }
        produtos.push(Produto.criar(item));
      } catch (erro) {
        if (erro instanceof ErroDeValidacao) {
          const detalhe = erro.detalhes.length > 0 ? erro.detalhes.join('; ') : erro.message;
          erros.push(`Item ${indice}: ${detalhe}`);
        } else {
          throw erro;
        }
      }
    });

    if (erros.length > 0) {
      throw new ErroDeValidacao(
        'Há itens inválidos na massa. Nenhum produto foi salvo.',
        erros,
      );
    }

    return produtos;
  }

  private garantirSkusUnicos(produtos: Produto[]): void {
    const vistos = new Set<string>();
    const duplicados = new Set<string>();

    for (const produto of produtos) {
      if (vistos.has(produto.sku.valor)) {
        duplicados.add(produto.sku.valor);
      }
      vistos.add(produto.sku.valor);
    }

    if (duplicados.size > 0) {
      throw new ErroDeValidacao(
        'Há SKUs duplicados na massa. Nenhum produto foi salvo.',
        [...duplicados].map((sku) => `SKU duplicado: ${sku}`),
      );
    }
  }
}
