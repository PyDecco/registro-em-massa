import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";

export interface ITransformadorTipagemDeDado{
    BuffParaJson(buffer: Buffer): ProdutoDto[]
}
