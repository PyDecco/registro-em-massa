import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";

export interface IProdutoCore{
    ValidadorProduto(produto: ProdutoDto): Promise<void>
    LanceUmErroParaNenhumProdutoEncontrado(produto:ProdutoDto[]): void
}
