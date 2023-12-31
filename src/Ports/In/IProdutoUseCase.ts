import { PageDto } from "src/Models/Dtos/PageDto";
import { ProdutoDto } from "src/Models/Dtos/ProdutoDto"

export interface IProdutoUseCase{
    getHello(): string;
    RegitroEmMassa(buffer: Buffer): Promise<void>;
    BuscaDeProdutoPorPaginacao(row_count: number ,row_skip: number): Promise<PageDto<ProdutoDto>>;
}