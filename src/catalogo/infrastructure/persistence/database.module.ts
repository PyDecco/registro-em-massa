import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { ProdutoModel } from './produto.model';

@Module({
  providers: [
    {
      provide: 'SEQUELIZE',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const sequelize = new Sequelize({
          dialect: 'postgres',
          host: config.getOrThrow<string>('DB_HOST'),
          port: Number(config.getOrThrow<string>('DB_PORT')),
          username: config.getOrThrow<string>('DB_USERNAME'),
          password: config.getOrThrow<string>('DB_PASSWORD'),
          database: config.getOrThrow<string>('DB_NAME'),
          logging: false,
        });
        sequelize.addModels([ProdutoModel]);
        await sequelize.sync();
        return sequelize;
      },
    },
    {
      provide: 'PRODUTOS_REPOSITORY',
      useValue: ProdutoModel,
    },
  ],
  exports: ['SEQUELIZE', 'PRODUTOS_REPOSITORY'],
})
export class DatabaseModule {}
