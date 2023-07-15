import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LogCore {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  logInfo(message: string): void {
    this.logger.info(message);
  }

  logError(message: string): void {
    this.logger.error(message);
  }
}