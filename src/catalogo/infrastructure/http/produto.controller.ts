import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuscarProdutosPaginados } from '../../application/buscar-produtos-paginados';
import { CadastrarProdutosEmMassa } from '../../application/cadastrar-produtos-em-massa';
import { AppLogger } from '../logging/app-logger';

@Controller()
export class ProdutoController {
  constructor(
    @Inject(CadastrarProdutosEmMassa)
    private readonly cadastrar: CadastrarProdutosEmMassa,
    @Inject(BuscarProdutosPaginados)
    private readonly buscar: BuscarProdutosPaginados,
    private readonly logger: AppLogger,
  ) {}

  @Get()
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Get('/produtos')
  async listar(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    this.logger.info(`GET /produtos page=${page} limit=${limit}`);
    return await this.buscar.execute(Number(page), Number(limit));
  }

  @Post('/produtos')
  @UseInterceptors(FileInterceptor('file'))
  async cadastrarEmMassa(
    @UploadedFile() file?: { buffer: Buffer },
  ): Promise<{ message: string }> {
    this.logger.info('POST /produtos');

    if (!file?.buffer) {
      throw new BadRequestException('Arquivo JSON é obrigatório (campo file)');
    }

    let payload: unknown;
    try {
      payload = JSON.parse(file.buffer.toString('utf8'));
    } catch {
      throw new BadRequestException('JSON inválido');
    }

    await this.cadastrar.execute(payload);
    return { message: 'Produtos cadastrados com sucesso' };
  }
}
