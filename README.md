# Registro de produto em massa

API NestJS para cadastrar e consultar produtos em massa. O contexto delimitado é o **Catálogo**: cadastro e consulta paginada de produtos.

Regra principal: **se qualquer item da massa falhar na validação ou na persistência, nenhum produto é salvo** (tudo ou nada). O item inválido é apontado na resposta.

## Tecnologias

- NestJS
- Sequelize
- PostgreSQL

## Como rodar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run start:dev
```

Variáveis de ambiente (sem credenciais no código): `PORT`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.

```bash
npm test    # unitários de domínio e casos de uso (sem banco)
npm run build
```

## API

`POST /produtos` — multipart, campo `file` com um JSON array:

```json
[
  {
    "key": "p-1",
    "data_preco": "2026-01-10",
    "cod_produto": 100,
    "sku": "SKU-01",
    "qtd_estoque": 5,
    "desconto": 10,
    "data_hora_insercao": "2026-01-10T10:00:00.000Z",
    "data_inicio": "2026-01-01",
    "data_fim": "2026-12-31"
  }
]
```

Validação de domínio responde **422** com o índice do item. JSON malformado ou arquivo ausente responde **400**. Sucesso: `{ "message": "Produtos cadastrados com sucesso" }`.

`GET /produtos?page=1&limit=10` — paginação 1-based. `offset = (page - 1) * limit`. `limit` entre 1 e 100.

`GET /` — healthcheck.

## Arquitetura

Camadas do **Catálogo**, de dentro para fora:

```
domínio  →  aplicação (ports + use cases)  →  infraestrutura (adapters)
```

A infraestrutura depende do domínio. O domínio não conhece NestJS, Sequelize nem HTTP.

| Camada | O que entra | O que não entra |
| --- | --- | --- |
| **Domínio** | Agregado `Produto`, VOs, invariantes, `ErroDeValidacao` | NestJS, Sequelize, status HTTP |
| **Aplicação** | Casos de uso e ports (`ProdutoRepository`, `UnitOfWork`) | Tipo `Transaction` do Sequelize, `HttpException` |
| **Infraestrutura** | Controller HTTP, filter, repositório Sequelize, UoW, logger | Regra de negócio |

**Ports e adapters:** os casos de uso recebem interfaces. O `AppModule` injeta as implementações Sequelize. Os testes unitários usam fakes em memória no lugar desses adapters.

**Agregado `Produto`:** cria-se só se as invariantes passarem (código positivo, estoque ≥ 0, SKU, desconto 0–100, período válido). Comportamento: `estaVigente()`, `temEstoque()`.

**Value objects:** `Sku` (normaliza e valida formato), `Desconto` (0–100) e `PeriodoVigencia` (`data_inicio`/`data_fim`, fim ≥ início).

**Tudo ou nada:** o caso de uso valida a massa inteira *antes* de tocar no banco (e rejeita SKU duplicado). Só então `UnitOfWork.execute` abre uma transação, persiste os lotes (10.000 itens) e o Sequelize faz commit. Qualquer exceção dispara rollback — o repositório **não** engole erro de `bulkCreate`.

Logs de requisição e de erro ficam no adapter HTTP (`logs/`).
