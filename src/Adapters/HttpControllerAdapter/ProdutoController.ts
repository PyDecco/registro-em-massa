import { Controller, ForbiddenException, Get, Inject, InternalServerErrorException, NotFoundException, Post, Query, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProdutoUseCase } from '../../UseCases/ProdutoUseCase';
import { FileInterceptor } from '@nestjs/platform-express';
import { ok } from 'assert';
import { IProdutoUseCase } from 'src/Ports/In/IProdutoUseCase';

@Controller()
export class ProdutoController {
  constructor(@Inject('IProdutoUseCase')private readonly produtoUseCase: IProdutoUseCase) {}

  @Get()
  getHello(): string {
    return this.produtoUseCase.getHello();
  }

  @Get("/produtos")
  async getProduto(
  @Query('row_count') row_count: number,
  @Query('row_skip') row_skip: number): Promise<any> {
    try {
        var result =  this.produtoUseCase.BuscaDeProdutoPorPaginacao(row_count, row_skip);
        return result;
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
          } else {
            throw new InternalServerErrorException();
          }
    }
  }

  @Post('/produtos')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file): Promise<string> {
    try {
        await this.produtoUseCase.RegitroEmMassa(file.buffer);
        return 'Data uploaded successfully!';
    } catch (error) {
        if (error instanceof ForbiddenException) {
            throw error;
          } else if (error instanceof UnauthorizedException) {
            throw error;
          } else {
            throw new InternalServerErrorException();
          }
    }
  }
}