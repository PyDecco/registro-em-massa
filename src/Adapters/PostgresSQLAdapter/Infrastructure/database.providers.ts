import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../../../Models/Entities/Produto';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'example',
        database: 'nestdb',
      });
      sequelize.addModels([Produto]);
      await sequelize.sync();
      return sequelize;
    },
  },
];