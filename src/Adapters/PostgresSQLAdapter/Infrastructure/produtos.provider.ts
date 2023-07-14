import { Produto } from '../../../Models/Entities/Produto';

export const produtosProviders = [
  {
    provide: 'PRODUTOS_REPOSITORY',
    useValue: Produto,
  },
];