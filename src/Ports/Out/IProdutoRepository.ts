import { Transaction } from "sequelize"
import { ProdutoDto } from "src/Models/Dtos/ProdutoDto"

export interface IProdutoRepository{
    BusqueProdutosPorPaginacao(offset: number): Promise<any>
    CrieProdutosEmMassa(massaDeProduto: ProdutoDto[], transaction: Transaction): Promise<void>
    CrieUmaTransaction(): Promise<Transaction>
    ConcretizeAsTransacoes(transaction: Transaction): Promise<void>
    realizeUmRolback(transaction: Transaction): Promise<void>
}