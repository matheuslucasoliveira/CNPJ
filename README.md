# Consulta CNPJ

Aplicação web para consulta de dados de empresas através do CNPJ, utilizando Node.js e Express.

## Requisitos

- Node.js 14.x ou superior
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd <seu-repositorio>
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Adicione suas variáveis:
```env
PORT=3000
API_TOKEN=seu_token_aqui
```

## Uso

1. Inicie o servidor:
```bash
npm start
# ou
yarn start
```

2. Para desenvolvimento (com hot-reload):
```bash
npm run dev
# ou
yarn dev
```

3. Acesse a aplicação em `http://localhost:3000`

## Funcionalidades

- Consulta de dados cadastrais de empresas por CNPJ
- Exibição de informações detalhadas:
  - Dados básicos da empresa
  - Endereço completo
  - Contatos
  - Atividades principal e secundárias
  - Quadro societário
  - Regimes especiais (Simples Nacional e MEI)
- Interface moderna e responsiva
- Tratamento de erros
- Metadados da consulta

## Tecnologias

- Node.js
- Express
- EJS (template engine)
- Bootstrap 5
- jQuery
- Font Awesome
- Axios

## Estrutura do Projeto

```
.
├── server.js          # Arquivo principal do servidor
├── views/             # Templates EJS
│   └── index.ejs      # Página principal
├── package.json       # Dependências e scripts
└── .env              # Variáveis de ambiente
```

## Endpoints

### GET /
- Página principal da aplicação

### POST /consultar
- Endpoint para consulta de CNPJ
- Parâmetros:
  - `cnpj`: CNPJ a ser consultado (formato: XX.XXX.XXX/XXXX-XX)
- Retorno:
  - Objeto JSON com os dados da empresa e metadados da consulta 