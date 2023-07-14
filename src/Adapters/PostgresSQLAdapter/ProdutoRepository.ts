import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProdutoDto } from 'src/Models/Dtos/ProdutoDto';
import { Produto } from 'src/Models/Entities/Produto';
import { IProdutoRepository } from 'src/Ports/Out/IProdutoRepository';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
    constructor(
        @Inject('PRODUTOS_REPOSITORY')
        private produtoRepository: typeof Produto,
        private readonly sequelize: Sequelize,
    ){}
    async BusqueProdutosPorPaginacao(offset: number): Promise<any> {
        const { count, rows } = await this.produtoRepository.findAndCountAll<Produto>({
            offset
          });

          return { count, rows }
    }
    async CrieProdutosEmMassa(massaDeProduto: ProdutoDto[], transaction: Transaction ): Promise<void> {
        try {
          await this.produtoRepository.bulkCreate<Produto>(massaDeProduto, { transaction });
          //await transaction.commit();
          console.log('Batch inserted into database:', massaDeProduto);
        } catch (error) {
          console.error('Error inserting batch into database:', error);
        }
    }

    async ConcretizeAsTransacoes(transaction: Transaction): Promise<void>{
      await transaction.commit();
    }

    async CrieUmaTransaction(): Promise<Transaction> {
      return await this.sequelize.transaction();
    }

    async realizeUmRolback(transaction: Transaction): Promise<void> {
      await transaction.rollback();
    }
}