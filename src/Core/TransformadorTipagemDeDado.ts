import { Injectable } from "@nestjs/common";
import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";
import { ITransformadorTipagemDeDado } from "src/Ports/In/ITransformadorTipagemDeDado";

@Injectable()
export class TransformadorTipagemDeDado implements ITransformadorTipagemDeDado {
  constructor() {}
  BuffParaJson(buffer: Buffer): ProdutoDto[] {
    const fileData = buffer.toString();
    return JSON.parse(fileData);
  }
}