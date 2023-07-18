import { Injectable } from "@nestjs/common";
import { ProdutoDto } from "src/Models/Dtos/ProdutoDto";
import { ITransformadorTipagemDeDado } from "src/Ports/In/ITransformadorTipagemDeDado";
import { Type } from 'class-transformer';

@Injectable()
export class TransformadorTipagemDeDado implements ITransformadorTipagemDeDado {
  constructor() {}
  BuffParaJson<T>(buffer: Buffer): T[] {
    const fileData = buffer.toString();
    return JSON.parse(fileData) as T[];
  }
}