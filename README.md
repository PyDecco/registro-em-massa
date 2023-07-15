# REGISTRO DE PRODUTO EM MASSA.
- Fazer um cadastro em massa de produtos. 
- Onde o em um erro de validação, não deve cadastrar nehum produto na base de dados.
- Indicar o erro de validação em algum item da massa quando não validado corretamente.
- Buscar a massa de produtos por paginação
- Registra logs do fluxo, do momento da requisição, logs de erro. 

### Tecnologias utilizada.
 - Nestjs: Framework para nodeJS.
 - Sequelize: Para ORM de comunicação com banco.
 - PostgreSQL: como database. 

## Logica
 - Para rollback do banco, foi preciso acoplar 3 eventos que utiliza transaction na service:
    - `CREATE`: Criação da transaction que ira cuidar de toda massa;
    - `ROLBACK`: Para que durante o processo de validação elimine todas os dados do banco para caso um dado no meio do fluxo.
    - `COMMIT`: Após toda a massa ser validada. é feito um commit no final do processo para concretizar o registro no banco.  
 - Para lidar com a carga em massa, foi definido o registro no banco de 10.000 itens por lote. O que facilitou o processo de validação unitaria de cada item, e registro em massa utilizando bulktCrea(função do sequelize para multiplos registros );
 - Foi possivel realizar o registro em massa, apesar do retorno de timeout, toda massa foi agregada ao banco.

## Arquitetura 

![Arquitetura Hexagonal](image.png)
 - Conceitos utilizados para cada camada:
    - `Adapter:` Toda comunicação de saida para o banco, de saida por fila, para uma outra api, entradas da controller http ou amqp.
    - `Core:` Toda necessidade de validação, ajudadores que podem ser compartilhados em outras entidades, e calculos feitos para contemplar um fluxo deve ser posto aqui.
    - `Models:`Todos os Dto's e entidades que definem como deve ser os formatos de valores, devem ser registrados aqui
    - `Ports:` Todas as interfaces, onde utilizamos para acoplarmos os itens são registrados aqui, essas ports são importantes para facilitar testes unitarios e de integração para que evitemos de mockarmos são essenciais para arquitetura
    - `UseCases`: Toda regra de negocio, e puramente sua regra sem conexão com o banco deve é registrada nessa camada, definindo um metodo publico para apresentar o cliente final como uma "receita de bolo", os metodos privados para consolidar conceitos S do SOLID deixando cada metodo com apenas uma ação.
    
- Vatangens: 
    - `Code review`: Insumos onde podemos compartilhar com o time, conceitos para padronizar o codigo em Code Review onde direcionamos o time a pensar na mesma pagina
    - `Facilidade com os testes`: os multiplos acomplamentos com validações, calculos e ajudadores, facilitam os testes unitarios serem feitos de forma correta, onde testamos nada mais que a unidade do sistema.
    - `Nortear Dev's que trabalham em outras stacks`: A arquitetura tras facilidade de leitura onde quem tem o conhecimento consolidado sobre a arquitura teria mais facilidade de migrar do front para o back, ou do Python para node, por exemplo.
    - `Facilidade para lidar com o ChatGPT`: Podemos usar o chatGPT para lidar com mini funções, que podem parece a parte mais complexa de alterar a linguagem,facilitando a comunicação com o chatGPT para adaptar a sintaxe que o dev não tem conhecimento.
- Desvantagem
    - `Curva de aprendizado do equipe`: inicialmente deve existir uma curva de aprendizado do time para entender o processo.
    - `Adaptação para lidar com monolitos`: deve existir dentro do mesmo projeto esses mesmos arquivos para cada entidade. ex: Produto, Pedidos, Usuarios. Cada um carregando esses arquivos.
     
## Teste
- Pendentes finalizar os testes
- Facilidade que a arquitetura tras para o teste
- Boa praticas de teste
- Citar cada teste e o que trouxeue entra e sai da api deve ser agregada aqui, seja com