import { Module } from '@nestjs/common';
import { ProdutoController } from './Adapters/HttpControllerAdapter/ProdutoController';
import { ProdutoUseCase } from './UseCases/ProdutoUseCase';
import { produtosProviders } from './Adapters/PostgresSQLAdapter/Infrastructure/produtos.provider';
import { DatabaseModule } from './Adapters/PostgresSQLAdapter/Infrastructure/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProdutoRepository } from './Adapters/PostgresSQLAdapter/ProdutoRepository';
import { ProdutoCore } from './Core/ProdutoCore';
import { TransformadorTipagemDeDado } from './Core/TransformadorTipagemDeDado';
import { LogCore } from './Core/LogCore';
import { CalculoCore } from './Core/CalculoCore';

@Module({
  imports: [DatabaseModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'example',
        database: 'nestdb',
    }),],
  controllers: [ProdutoController],
  providers: [
    ProdutoUseCase,
    {
      provide: 'IProdutoUseCase',
      useClass: ProdutoUseCase,
    },
    ProdutoRepository,
    {
      provide: 'IProdutoRepository',
      useClass: ProdutoRepository,
    },
    ProdutoRepository,
    {
      provide: 'IProdutoCore',
      useClass: ProdutoCore,
    },
    ProdutoRepository,
    {
      provide: 'ITransformadorTipagemDeDado',
      useClass: TransformadorTipagemDeDado,
    },
    {
      provide: 'ICalculoCore',
      useClass: CalculoCore,
    },
    LogCore,
    ...produtosProviders,
  ],
})
export class AppModule {}
