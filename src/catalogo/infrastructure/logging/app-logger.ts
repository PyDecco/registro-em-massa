import { existsSync, mkdirSync } from 'node:fs';
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

if (!existsSync('logs')) {
  mkdirSync('logs');
}

@Injectable()
export class AppLogger {
  private readonly logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
