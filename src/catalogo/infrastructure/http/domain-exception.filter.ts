import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErroDeDominio, ErroDeValidacao } from '../../domain/errors';
import { AppLogger } from '../logging/app-logger';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ErroDeValidacao) {
      this.logger.error(`Validação recusada: ${exception.message}`);
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: exception.message,
        errors: exception.detalhes,
      });
      return;
    }

    if (exception instanceof ErroDeDominio) {
      this.logger.error(`Erro de domínio: ${exception.message}`);
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.error(`HTTP ${status}: ${exception.message}`);
      response.status(status).json(exception.getResponse());
      return;
    }

    this.logger.error(`Erro inesperado: ${String(exception)}`);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    });
  }
}
