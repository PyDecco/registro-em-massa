import { Injectable } from "@nestjs/common";
import { ICalculoCore } from "src/Ports/In/ICalculoCore";

@Injectable()
export class CalculoCore implements ICalculoCore {
  constructor() {}
    CalculeAPosicaoInicialDeRegistro(row_count: number, row_skip: number): number {
        return (row_count - 1) * row_skip;
    }
    CalculeOTotalDePaginas(contador: number, row_skip: number): number {
        return  Math.ceil(contador / row_skip)
    }
}
