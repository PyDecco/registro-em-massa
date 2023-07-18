import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";
import { Type } from 'class-transformer';

export interface ITransformadorTipagemDeDado{
    BuffParaJson<T>(buffer: Buffer): T[]
}
