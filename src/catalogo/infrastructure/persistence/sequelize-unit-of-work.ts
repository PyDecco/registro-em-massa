import { AsyncLocalStorage } from 'node:async_hooks';
import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { UnitOfWork } from '../../application/ports';

const transacaoAtual = new AsyncLocalStorage<Transaction>();

@Injectable()
export class SequelizeUnitOfWork implements UnitOfWork {
  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  transacao(): Transaction | undefined {
    return transacaoAtual.getStore();
  }

  async execute<T>(trabalho: () => Promise<T>): Promise<T> {
    return this.sequelize.transaction(async (transaction) =>
      transacaoAtual.run(transaction, trabalho),
    );
  }
}
