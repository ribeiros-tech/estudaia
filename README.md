# EstudaIA

> Assistente de estudos com inteligência artificial, desenvolvido como
> projeto prático de aplicação de IA generativa em um ambiente web.

O **EstudaIA** é uma aplicação web em desenvolvimento que utiliza a API
do Google Gemini para apoiar atividades de estudo. A aplicação permite
gerar resumos, questões e flashcards a partir de um conteúdo informado
pelo usuário, além de organizar matérias e acompanhar indicadores
básicos de utilização.

O projeto tem finalidade educacional e de portfólio: demonstrar
integração entre frontend, backend e um serviço externo de IA
generativa, com separação de responsabilidades, persistência local de
dados e configuração segura de credenciais no servidor.

## Situação do projeto

O EstudaIA deve ser entendido como uma **aplicação em desenvolvimento**,
e não como um SaaS pronto para operação comercial. Esta versão
representa uma etapa funcional do projeto, destinada a demonstrar
conceitos de desenvolvimento web e integração com IA. Evoluções futuras
poderão incluir autenticação, persistência em banco de dados, gestão
multiusuário, monitoramento e controles operacionais mais completos.

## Funcionalidades

-   **Dashboard:** apresenta indicadores de matérias, resumos, questões
    e flashcards registrados na aplicação.
-   **Minhas Matérias:** permite cadastrar e consultar matérias de
    estudo.
-   **Resumos com IA:** envia conteúdo ao backend e solicita ao Gemini a
    geração de um resumo.
-   **Questões:** gera questões de revisão com alternativas e
    informações de resposta, conforme a estrutura definida na aplicação.
-   **Flashcards:** gera cartões de pergunta e resposta para apoiar a
    revisão.
-   **Persistência local:** mantém os dados do usuário no navegador por
    meio de `localStorage`.

> A disponibilidade e a qualidade das respostas geradas por IA dependem
> do serviço Gemini, da conectividade, dos limites da API e do conteúdo
> enviado.

## Tecnologias utilizadas

  -----------------------------------------------------------------------
  Tecnologia                          Responsabilidade
  ----------------------------------- -----------------------------------
  HTML5                               Estrutura das páginas e componentes
                                      da interface

  CSS3                                Estilização e apresentação visual

  JavaScript                          Navegação, interação, lógica do
                                      frontend e persistência local

  Node.js                             Ambiente de execução do backend

  Express                             Servidor HTTP e disponibilização
                                      dos arquivos da aplicação

  Google GenAI SDK (`@google/genai`)  Comunicação do backend com a API
                                      Gemini

  Google Gemini API                   Geração de conteúdo educacional por
                                      IA

  dotenv                              Carregamento de variáveis de
                                      ambiente durante o desenvolvimento

  Git e GitHub                        Versionamento e publicação do
                                      código-fonte
  -----------------------------------------------------------------------

## Arquitetura em alto nível

A aplicação utiliza uma arquitetura cliente-servidor simples:

1.  O navegador carrega a interface estática disponibilizada pelo
    servidor Node.js/Express.
2.  Os módulos JavaScript do frontend tratam as ações do usuário.
3.  Quando uma funcionalidade de IA é solicitada, o frontend envia uma
    requisição HTTP para `POST /api/gemini`.
4.  O backend valida o tipo de geração, utiliza a chave `GEMINI_API_KEY`
    e chama o serviço Gemini por meio do SDK oficial.
5.  O backend devolve o resultado ao frontend, que o apresenta na
    interface.
6.  Os dados locais da aplicação são armazenados no navegador por
    `localStorage`.

A chave da API deve permanecer exclusivamente no ambiente do servidor.
Ela não deve ser inserida em arquivos HTML/JavaScript públicos nem
versionada no Git.

Consulte [`docs/Arquitetura.md`](docs/Arquitetura.md) para a descrição
técnica detalhada.

## Pré-requisitos

-   Node.js instalado (preferencialmente uma versão LTS compatível com
    as dependências do projeto).
-   npm, instalado junto com o Node.js.
-   Uma chave de API do Google Gemini para utilizar os recursos de
    geração por IA.
-   Git, caso queira clonar o repositório.

## Instalação e execução local

### 1. Obter o código

Clone o repositório:

``` bash
git clone <URL_DO_REPOSITORIO>
cd estudaia
```

Se o projeto já estiver no computador, entre na pasta raiz:

``` bash
cd caminho/para/estudaia
```

### 2. Instalar as dependências

``` bash
npm install
```

### 3. Configurar a variável de ambiente

Crie um arquivo `.env` na raiz do projeto:

``` env
GEMINI_API_KEY=sua_chave_api_aqui
```

Substitua o valor de exemplo pela sua chave. Não compartilhe esse
arquivo e não o envie ao GitHub. O repositório deve conter um
`.gitignore` que exclua, no mínimo:

``` gitignore
node_modules/
.env
```

Se o projeto utilizar outros arquivos locais ou temporários, inclua-os
no `.gitignore` conforme necessário.

### 4. Iniciar o servidor

``` bash
npm start
```

Com o servidor em execução, acesse no navegador:

``` text
http://localhost:3000
```

Para encerrar o servidor, volte ao terminal e pressione `Ctrl + C`.

> Se a porta 3000 estiver ocupada ou se o projeto tiver sido configurado
> com outra porta, utilize a porta indicada pelo próprio servidor.

## Configuração e segurança

-   Mantenha `GEMINI_API_KEY` no ambiente do backend.
-   Não coloque segredos no frontend, no histórico do Git ou em capturas
    de tela públicas.
-   Não publique o arquivo `.env`.
-   Trate os dados gerados pela IA como conteúdo que pode conter
    imprecisões; revise antes de utilizá-los.
-   Respeite os limites, termos e políticas de uso da API Gemini.
-   Antes de disponibilizar a aplicação publicamente, revise validação
    de entradas, tratamento de erros, limites de requisição e exposição
    de informações operacionais.

## Estrutura do projeto

A estrutura abaixo representa a organização considerada nesta etapa:

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
├── .env                  # local; não versionar
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

A presença de arquivos adicionais pode variar conforme a evolução do
repositório. A documentação deve ser atualizada quando a estrutura ou os
contratos da aplicação forem alterados.

## Limitações conhecidas desta etapa

-   A persistência é feita no navegador, por `localStorage`; portanto,
    os dados não são sincronizados entre dispositivos ou navegadores.
-   Não há, nesta etapa documentada, garantia de disponibilidade
    contínua nem SLA.
-   O uso da IA depende da disponibilidade e dos limites do serviço
    Gemini.
-   A aplicação ainda não deve ser apresentada como plataforma SaaS
    multiusuário ou serviço comercial consolidado.

## Próximos passos possíveis

-   Ampliar os testes funcionais e de integração.
-   Revisar validação de entrada, tratamento de erros e proteção contra
    uso abusivo do endpoint.
-   Melhorar a apresentação de conteúdo formatado nos resumos.
-   Evoluir a persistência para um banco de dados, se necessário.
-   Avaliar autenticação e isolamento de dados caso o projeto avance
    para múltiplos usuários.
-   Automatizar verificações e documentar o processo de implantação.

## Hospedagem

A publicação pode ser realizada em uma plataforma compatível com
Node.js, configurando `GEMINI_API_KEY` como variável de ambiente no
serviço de hospedagem. A opção considerada para esta etapa é a
**Render**, com o código-fonte versionado no GitHub. Consulte a
documentação atual da plataforma antes da implantação, pois planos e
limites podem mudar.

## Licença

Nenhuma licença foi especificada nesta documentação. Antes de permitir
reutilização ou distribuição por terceiros, escolha e adicione uma
licença ao repositório.