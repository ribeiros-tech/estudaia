# EstudaIA 

> Assistente de estudos com inteligência artificial, desenvolvido para demonstrar a aplicação prática de IA generativa em uma plataforma web.

**O EstudaIA** é uma aplicação web que utiliza a API do Google Gemini para auxiliar estudantes na organização e revisão de conteúdos acadêmicos.

A plataforma permite gerar resumos, questões e flashcards a partir de conteúdos fornecidos pelo usuário, além de organizar matérias e acompanhar indicadores básicos de utilização.

O projeto foi desenvolvido como iniciativa prática de aprendizado e portfólio, demonstrando integração entre frontend, backend e serviços externos de inteligência artificial.

 **Aplicação publicada:** https://estudaia.onrender.com/

##  Status do projeto

**Versão 1.0.0 — Publicada**

O EstudaIA possui uma versão funcional hospedada na Render, com integração à API do Google Gemini.

Esta versão representa uma primeira etapa do projeto, com funcionalidades operacionais e arquitetura cliente-servidor.

O projeto ainda não constitui um SaaS comercial completo.

Evoluções futuras poderão incluir autenticação, banco de dados, gerenciamento multiusuário, monitoramento e controles adicionais de segurança.

##  Funcionalidades

### Dashboard
- Visualização de indicadores de utilização.
- Contagem de matérias, resumos, questões e flashcards.

### Minhas Matérias
- Cadastro de matérias de estudo.
- Consulta das matérias registradas.
- Persistência local dos dados.

### Resumos com IA
- Geração automática de resumos utilizando Google Gemini.
- Organização do conteúdo em estruturas didáticas.
- Apresentação dos principais conceitos estudados.

### Questões com IA
- Geração de questões de múltipla escolha.
- Quatro alternativas por questão.
- Gabarito e explicações das respostas.

### Flashcards com IA
- Geração automática de cartões de estudo.
- Perguntas e respostas sobre o conteúdo informado.
- Controle da quantidade de cartões solicitados.

### Persistência de dados
- Armazenamento local utilizando LocalStorage.
- Recuperação dos dados durante novas visitas no mesmo navegador.

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura da interface |
| CSS3 | Estilização e responsividade |
| JavaScript | Lógica e interatividade do frontend |
| Node.js | Ambiente de execução do backend |
| Express.js | Servidor e gerenciamento de requisições HTTP |
| Google Gemini API | Geração de conteúdo por inteligência artificial |
| Google GenAI SDK | Comunicação com a API Gemini |
| dotenv | Gerenciamento de variáveis de ambiente |
| Git | Versionamento de código |
| GitHub | Hospedagem do código-fonte |
| Render | Hospedagem da aplicação |

##  Arquitetura da aplicação

O EstudaIA utiliza uma arquitetura cliente-servidor.

O funcionamento ocorre da seguinte maneira:

1. O navegador solicita e carrega a interface disponibilizada pelo servidor Express.
2. Os módulos JavaScript gerenciam as interações do usuário.
3. Quando uma funcionalidade de IA é solicitada, o frontend envia uma requisição HTTP para o endpoint `POST /api/gemini`.
4. O backend recebe e valida os dados enviados.
5. O servidor utiliza a variável de ambiente `GEMINI_API_KEY` para autenticar a comunicação com o Google Gemini.
6. O resultado é devolvido ao frontend e apresentado na interface.
7. Os dados de utilização são armazenados localmente no navegador por meio do LocalStorage.

**Fluxo simplificado:**

```text
Usuário
   |
   v
Frontend (HTML, CSS e JavaScript)
   |
   v
Backend (Node.js + Express)
   |
   v
Endpoint /api/gemini
   |
   v
Google Gemini API
   |
   v
Resposta gerada pela IA
   |
   v
Frontend
```

## Estrutura do projeto

```text
estudaia/
│
├── public/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── app.js
│       ├── gemini.js
│       ├── quiz.js
│       └── storage.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

##  Instalação e execução local

### Pré-requisitos

- Node.js.
- npm.
- Git.
- Chave de API do Google Gemini.

### 1. Clonar o repositório

```bash
git clone <https://github.com/ribeiros-tech/estudaia.git>
```

Entre na pasta:

```bash
cd estudaia
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

Substitua o valor de exemplo pela sua chave de API.

**Importante:** nunca compartilhe sua chave de API ou publique o arquivo `.env` no GitHub.

### 4. Iniciar a aplicação

Execute:

```bash
npm start
```

Acesse no navegador:

```text
http://localhost:3000
```

##  Segurança

O projeto utiliza algumas práticas básicas de segurança:

- A chave da API Gemini permanece no backend.
- As credenciais são carregadas por variáveis de ambiente.
- O arquivo `.env` é excluído do versionamento pelo `.gitignore`.
- O backend valida os dados recebidos antes de solicitar a geração de conteúdo.
- O servidor possui tratamento de erros relacionados à disponibilidade e aos limites da API Gemini.

A aplicação ainda pode evoluir com validação mais abrangente, limitação de requisições e outras medidas de proteção para ambientes públicos.

##  Implantação

O EstudaIA está hospedado na plataforma Render.

**Endereço público:**

https://estudaia.onrender.com/

A implantação utiliza:

- Repositório GitHub conectado à Render.
- Ambiente Node.js.
- Instalação de dependências com `npm install`.
- Inicialização com `npm start`.
- Variável de ambiente `GEMINI_API_KEY`.
- Comunicação HTTPS.

A versão gratuita da hospedagem pode suspender o serviço após períodos de inatividade. Por isso, o primeiro acesso depois de uma suspensão pode apresentar demora no carregamento.

##  Limitações conhecidas

- A persistência utiliza LocalStorage, portanto os dados não são sincronizados entre diferentes dispositivos ou navegadores.
- Não existe autenticação de usuários nesta versão.
- Não existe banco de dados centralizado.
- A disponibilidade da geração de conteúdo depende do serviço Google Gemini e dos limites da API.
- Respostas geradas por inteligência artificial podem conter imprecisões e devem ser revisadas.
- A hospedagem gratuita não oferece garantia de disponibilidade contínua ou SLA.

##  Próximas evoluções

O projeto poderá evoluir com:

- Implementação de banco de dados.
- Sistema de autenticação.
- Gerenciamento de usuários.
- Persistência de dados em nuvem.
- Melhorias na apresentação dos resumos gerados.
- Aprimoramento da experiência de utilização dos flashcards.
- Testes automatizados.
- Monitoramento e melhorias de segurança.
- Evolução gradual para um MVP mais completo.

##  Objetivo educacional e profissional

O EstudaIA foi desenvolvido como projeto prático de aplicação dos conhecimentos de Análise e Desenvolvimento de Sistemas.

Seu desenvolvimento envolveu:

- Desenvolvimento frontend.
- Desenvolvimento backend.
- Integração com API externa.
- Aplicação de inteligência artificial generativa.
- Gerenciamento de variáveis de ambiente.
- Persistência de dados no navegador.
- Versionamento com Git e GitHub.
- Implantação de aplicação Node.js em ambiente de nuvem.

O projeto representa uma etapa de aprendizado contínuo e demonstra a aplicação prática de tecnologias utilizadas no desenvolvimento de software.

##  Licença

O `package.json` declara a licença ISC para o projeto. Recomenda-se manter um arquivo `LICENSE` no repositório com o texto correspondente à licença adotada.

##  Sobre a criadora

Sou Vitória Vasconcelos Ribeiro, estudante de Análise e Desenvolvimento de Sistemas, apaixonada por tecnologia e pelo potencial da inteligência artificial para transformar a maneira como as pessoas aprendem e resolvem problemas.

Desenvolvi o EstudaIA como parte da minha jornada de aprendizado e evolução na área de tecnologia, aplicando conhecimentos de desenvolvimento web, integração com APIs, JavaScript e Node.js. Mais do que construir uma aplicação, meu objetivo foi transformar conhecimentos teóricos em uma solução funcional, enfrentando desafios reais de desenvolvimento, desde a estruturação do projeto até sua publicação na internet.

Acredito no aprendizado contínuo, na criatividade e na capacidade da tecnologia de gerar oportunidades. Este projeto representa uma etapa importante da minha trajetória como desenvolvedora e o início de muitos outros desafios que pretendo transformar em soluções.