import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BuscarProdutosPaginados } from './catalogo/application/buscar-produtos-paginados';
import { CadastrarProdutosEmMassa } from './catalogo/application/cadastrar-produtos-em-massa';
import {
  PRODUTO_REPOSITORY,
  ProdutoRepository,
  UNIT_OF_WORK,
  UnitOfWork,
} from './catalogo/application/ports';
import { ProdutoController } from './catalogo/infrastructure/http/produto.controller';
import { AppLogger } from './catalogo/infrastructure/logging/app-logger';
import { DatabaseModule } from './catalogo/infrastructure/persistence/database.module';
import { SequelizeProdutoRepository } from './catalogo/infrastructure/persistence/sequelize-produto.repository';
import { SequelizeUnitOfWork } from './catalogo/infrastructure/persistence/sequelize-unit-of-work';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
  ],
  controllers: [ProdutoController],
  providers: [
    AppLogger,
    SequelizeUnitOfWork,
    SequelizeProdutoRepository,
    {
      provide: UNIT_OF_WORK,
      useExisting: SequelizeUnitOfWork,
    },
    {
      provide: PRODUTO_REPOSITORY,
      useExisting: SequelizeProdutoRepository,
    },
    {
      provide: CadastrarProdutosEmMassa,
      useFactory: (repositorio: ProdutoRepository, unitOfWork: UnitOfWork) =>
        new CadastrarProdutosEmMassa(repositorio, unitOfWork),
      inject: [PRODUTO_REPOSITORY, UNIT_OF_WORK],
    },
    {
      provide: BuscarProdutosPaginados,
      useFactory: (repositorio: ProdutoRepository) =>
        new BuscarProdutosPaginados(repositorio),
      inject: [PRODUTO_REPOSITORY],
    },
  ],
})
export class AppModule {}
