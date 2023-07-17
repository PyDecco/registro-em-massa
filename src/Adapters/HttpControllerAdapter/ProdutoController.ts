import { Controller, ForbiddenException, Get, Inject, InternalServerErrorException, NotFoundException, Post, Query, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IProdutoUseCase } from 'src/Ports/In/IProdutoUseCase';
import { LogCore } from 'src/Core/LogCore';
import { ProdutoDto } from 'src/Models/Dtos/ProdutoDto';
import { PageDto } from 'src/Models/Dtos/PageDto';

@Controller()
export class ProdutoController {
  constructor(
    @Inject('IProdutoUseCase')private readonly produtoUseCase: IProdutoUseCase,
    private logger: LogCore
    ) {}

  @Get()
  getHello(): string {
    this.logger.logInfo(`GET / - Requisição realizada as: ${Date.now}`);  
    return this.produtoUseCase.getHello();
  }

  @Get("/produtos")
  async getProduto(
  @Query('row_count') row_count: number,
  @Query('row_skip') row_skip: number): Promise<PageDto<ProdutoDto>> {
    try {
        this.logger.logInfo(`GET /produtos - Requisição realizada as: ${new Date().toString()}`);
        var result =  this.produtoUseCase.BuscaDeProdutoPorPaginacao(row_count, row_skip);
        return result;
    } catch (error) {
        if (error instanceof NotFoundException) {
            this.logger.logError(`GET /produtos - Erro: ${error}`);
            throw error;
          } else {
            this.logger.logError(`GET /produtos - Erro: ${error}`);
            throw new InternalServerErrorException();
          }
    }
  }

  @Post('/produtos')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file): Promise<string> {
    try {
        this.logger.logInfo(`POST /produtos - Requisição realizada as: ${Date.now()}`);
        await this.produtoUseCase.RegitroEmMassa(file.buffer);
        return 'Data uploaded successfully!';
    } catch (error) {
        if (error instanceof ForbiddenException) {
            this.logger.logError(`GET /produtos - Erro: ${error}`);
            throw error;
          } else if (error instanceof UnauthorizedException) {
            this.logger.logError(`GET /produtos - Erro: ${error}`);
            throw error;
          } else {
            this.logger.logError(`GET /produtos - Erro: ${error}`);
            throw new InternalServerErrorException();
          }
    }
  }
}