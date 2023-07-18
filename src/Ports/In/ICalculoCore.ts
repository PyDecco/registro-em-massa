export interface ICalculoCore{
    CalculeAPosicaoInicialDeRegistro(row_count: number, row_skip:number): number
    CalculeOTotalDePaginas(contador: number, row_skip:number): number
}
