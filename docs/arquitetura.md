# Arquitetura do EstudaIA

## 1. Visão geral

O EstudaIA é uma aplicação web em desenvolvimento que integra uma
interface executada no navegador a um backend Node.js com Express. O
backend disponibiliza os arquivos estáticos da aplicação e atua como
intermediário entre o frontend e a API Gemini.

A arquitetura foi mantida deliberadamente simples para esta etapa do
projeto. O objetivo é separar a apresentação e a interação do usuário da
responsabilidade de acessar um serviço externo que exige credencial
privada.

## 2. Componentes

### 2.1 Frontend

O frontend é composto por HTML, CSS e JavaScript executados no
navegador.

Responsabilidades principais:

-   apresentar as telas e componentes da aplicação;
-   controlar a navegação entre Dashboard, matérias, resumos, questões e
    flashcards;
-   capturar os dados inseridos pelo usuário;
-   solicitar ao backend a geração de conteúdo com IA;
-   renderizar as respostas recebidas;
-   persistir dados locais por meio de `localStorage`.

Módulos JavaScript:

  -----------------------------------------------------------------------
  Arquivo                             Responsabilidade
  ----------------------------------- -----------------------------------
  `public/js/app.js`                  Inicialização da aplicação,
                                      navegação, eventos da interface e
                                      atualização de indicadores

  `public/js/gemini.js`               Comunicação HTTP com o endpoint de
                                      geração de conteúdo do backend

  `public/js/quiz.js`                 Lógica relacionada à apresentação e
                                      interação com questões/quiz

  `public/js/storage.js`              Operações de leitura e gravação dos
                                      dados locais
  -----------------------------------------------------------------------

A interface principal está em `public/index.html`, e os estilos estão em
`public/css/style.css`.

### 2.2 Backend

O backend é executado em Node.js e utiliza Express.

Responsabilidades:

-   iniciar o servidor HTTP;
-   disponibilizar os arquivos estáticos da pasta `public`;
-   receber solicitações de geração de conteúdo;
-   utilizar a credencial Gemini armazenada no ambiente do servidor;
-   chamar a API Gemini por meio do pacote `@google/genai`;
-   devolver o resultado ou uma resposta de erro ao frontend.

O ponto de entrada do servidor é `server.js`.

### 2.3 Serviço externo de IA

A aplicação utiliza o SDK `@google/genai` para acessar a API Gemini. A
chamada é realizada pelo backend, evitando expor a chave de API no
código entregue ao navegador.

O modelo utilizado é definido na implementação do backend. O nome do
modelo pode mudar conforme disponibilidade, compatibilidade ou decisão
de manutenção; por isso, a documentação não fixa um identificador de
modelo.

## 3. Organização dos diretórios

``` text
estudaia/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── gemini.js
│       ├── quiz.js
│       └── storage.js
├── docs/
│   └── Arquitetura.md
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### Arquivos de configuração

-   `package.json`: metadados do projeto, dependências e comandos npm.
-   `package-lock.json`: registro das versões resolvidas das
    dependências.
-   `.env`: configuração local de variáveis sensíveis, como
    `GEMINI_API_KEY`; não deve ser versionado.
-   `.gitignore`: impede que arquivos locais, dependências instaladas e
    segredos sejam adicionados ao Git.
-   `server.js`: inicialização do servidor e definição das rotas HTTP.

## 4. Comunicação frontend/backend

A comunicação para geração de conteúdo ocorre por HTTP, utilizando o
endpoint:

``` http
POST /api/gemini
```

O frontend envia uma requisição com o conteúdo fornecido pelo usuário e
o tipo de operação solicitado. Os tipos funcionais documentados nesta
etapa são:

-   `summary`: geração de resumo;
-   `quiz`: geração de questões;
-   `flashcards`: geração de flashcards.

O backend utiliza o tipo recebido para selecionar as instruções
correspondentes, encaminha o conteúdo ao modelo Gemini e retorna a
resposta ao frontend.

### Fluxo simplificado

``` text
Usuário
   |
   v
Interface no navegador
(public/index.html + public/js/)
   |
   | POST /api/gemini
   v
Servidor Node.js / Express
(server.js)
   |
   | SDK @google/genai
   | GEMINI_API_KEY (ambiente do servidor)
   v
Google Gemini API
   |
   | resposta gerada
   v
Servidor Node.js / Express
   |
   | resposta HTTP
   v
Frontend apresenta o resultado
```

O navegador não deve se comunicar diretamente com a API Gemini usando
uma chave privada. A intermediação pelo backend mantém a credencial fora
dos arquivos públicos.

## 5. Integração com a API Gemini

### 5.1 Configuração

A credencial é disponibilizada ao processo Node.js por variável de
ambiente:

``` env
GEMINI_API_KEY=sua_chave_api_aqui
```

Durante o desenvolvimento local, o pacote `dotenv` pode carregar as
variáveis definidas no arquivo `.env`. Em hospedagem, a variável deve
ser cadastrada na configuração segura do serviço.

### 5.2 Processamento

Em termos conceituais, o processamento segue estas etapas:

1.  O frontend coleta o conteúdo e identifica a operação solicitada.
2.  O módulo `public/js/gemini.js` envia a requisição para
    `/api/gemini`.
3.  O backend recebe e interpreta os dados da requisição.
4.  O backend seleciona as instruções correspondentes ao tipo
    (`summary`, `quiz` ou `flashcards`).
5.  O SDK `@google/genai` envia a solicitação ao modelo configurado.
6.  O backend retorna o resultado ao frontend.
7.  A interface apresenta o conteúdo gerado.

A implementação também pode tratar falhas temporárias e limites de uso
retornados pelo provedor. Erros como indisponibilidade do modelo ou
excesso de requisições devem ser comunicados de forma controlada, sem
expor credenciais ou detalhes internos desnecessários.

### 5.3 Limites e dependências

A geração depende de fatores externos, incluindo:

-   disponibilidade da API Gemini;
-   limites de requisições e cotas da chave utilizada;
-   tamanho e qualidade do conteúdo enviado;
-   latência e conectividade de rede;
-   formato efetivamente retornado pelo modelo.

A saída de um modelo generativo não deve ser considerada automaticamente
correta. O conteúdo educacional gerado precisa ser revisado pelo
usuário.

## 6. Persistência de dados no navegador

Nesta etapa, os dados da aplicação são armazenados no `localStorage` do
navegador. As chaves utilizadas são:

  Chave                   Finalidade
  ----------------------- ------------------------
  `estudaia_subjects`     matérias cadastradas
  `estudaia_summaries`    resumos registrados
  `estudaia_questions`    questões registradas
  `estudaia_flashcards`   flashcards registrados

Essa abordagem é simples e não exige infraestrutura de banco de dados.
Entretanto, os dados ficam associados ao navegador e à origem da
aplicação. Eles não são automaticamente compartilhados entre
dispositivos, perfis ou usuários.

Não há, nesta arquitetura, uma camada de persistência centralizada no
backend.

## 7. Segurança e boas práticas

Pontos essenciais para a manutenção do projeto:

-   manter `GEMINI_API_KEY` somente no ambiente do servidor;
-   excluir `.env` do controle de versão;
-   nunca inserir credenciais em `public/` ou em arquivos JavaScript
    enviados ao navegador;
-   validar os dados recebidos pelo endpoint antes de encaminhá-los ao
    provedor;
-   limitar o tamanho das entradas e considerar controles contra
    requisições abusivas;
-   tratar erros do provedor sem retornar segredos, stack traces ou
    configurações internas;
-   manter dependências atualizadas e revisar alterações relevantes;
-   testar os fluxos de sucesso e falha antes de publicar novas versões.

Esta documentação descreve a arquitetura da etapa atual e não representa
uma auditoria de segurança ou uma certificação de conformidade.

## 8. Execução local

Na raiz do projeto:

``` bash
npm install
```

Configure `.env` com `GEMINI_API_KEY` e inicie:

``` bash
npm start
```

A aplicação deverá estar disponível em:

``` text
http://localhost:3000
```

O comando depende da configuração `start` definida em `package.json`.

## 9. Implantação

A estratégia considerada para esta etapa é:

1.  versionar o código-fonte no GitHub;
2.  conectar o repositório a um serviço de hospedagem compatível com
    Node.js, como Render;
3.  configurar o comando de inicialização definido pelo projeto;
4.  cadastrar `GEMINI_API_KEY` como variável de ambiente no serviço;
5.  validar a aplicação publicada, incluindo os fluxos de geração e o
    tratamento de erros.

A plataforma de hospedagem, seus planos gratuitos, limites e
comportamento operacional podem mudar. Confirme as condições atuais
diretamente na documentação do provedor antes de realizar a implantação.

## 10. Evolução arquitetural

Caso o projeto avance para uma aplicação multiusuário ou para um produto
SaaS, serão necessárias decisões e componentes adicionais, por exemplo:

-   autenticação e autorização;
-   banco de dados centralizado;
-   isolamento dos dados por usuário;
-   gestão de sessões e recuperação de conta;
-   limitação de requisições por usuário;
-   observabilidade, logs e monitoramento;
-   política de privacidade, retenção e exclusão de dados;
-   estratégia de custos, cotas e disponibilidade.

Esses itens são possibilidades de evolução e não devem ser interpretados
como funcionalidades já implementadas.

## 11. Escopo e precisão desta documentação

Este documento descreve a arquitetura conhecida da versão atual do
EstudaIA. Detalhes de implementação --- como validações exatas, formato
integral do payload HTTP, esquema completo das respostas e middlewares
ativos --- devem ser confirmados diretamente no código-fonte quando
houver mudanças. A documentação deve acompanhar a implementação real,
evitando declarar como existente qualquer componente que ainda esteja
planejado.