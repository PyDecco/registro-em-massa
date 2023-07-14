import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './ProdutoController';
import { ProdutoUseCase } from '../../UseCases/ProdutoUseCase';

describe('ProdutoController', () => {
  let appController: ProdutoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [ProdutoUseCase],
    }).compile();

    appController = app.get<ProdutoController>(ProdutoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
