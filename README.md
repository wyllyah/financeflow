# FinanceFlow

FinanceFlow e uma aplicacao full stack de controle financeiro pessoal, desenvolvida com React, Node.js, Express, Prisma e PostgreSQL. O sistema permite cadastro e login de usuarios, controle de receitas e despesas, dashboard financeiro e gerenciamento completo de transacoes.

## Status

Projeto em desenvolvimento.

## Funcionalidades

- Cadastro de usuario
- Login com JWT
- Rotas protegidas
- Dashboard financeiro
- Dashboard avancado com dados mensais e comparativos
- Cadastro de receitas
- Cadastro de despesas
- Categorias personalizadas
- Listagem de transacoes
- Edicao de transacoes
- Exclusao de transacoes
- Filtros por tipo
- Filtros por mes e ano
- Filtros por categoria, busca, periodo e ordenacao
- Pagina de perfil do usuario
- Pagina de configuracoes
- Preferencias visuais salvas no navegador
- Resumo de saldo, receitas e despesas
- Graficos financeiros

## Tecnologias utilizadas

Backend:

- Node.js
- Express
- Prisma
- PostgreSQL
- Supabase PostgreSQL
- JWT
- bcrypt
- Zod
- dotenv
- CORS

Frontend:

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React
- React Hook Form
- Zod

## Estrutura do projeto

```text
financeflow/
├── backend/
└── frontend/
```

## Como rodar localmente

### 1. Clonar o repositorio

```bash
git clone URL_DO_REPOSITORIO
cd financeflow
```

### 2. Configurar backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` em `backend/`:

```env
PORT=3333
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?sslmode=require"
JWT_SECRET="sua_chave_jwt"
```

Rode o Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Rode o backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:3333
```

### 3. Configurar frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie um arquivo `.env` em `frontend/`:

```env
VITE_API_URL=http://localhost:3333
```

Rode o frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Configuracao do banco

O projeto usa PostgreSQL. Durante o desenvolvimento foi usado Supabase PostgreSQL.

O Prisma gerencia o schema e as migrations. Para Supabase Session Pooler, o usuario costuma seguir o formato:

```text
postgres.PROJECT_REF
```

Nao coloque senha real, URL real de banco ou segredos em arquivos versionados.

## Rotas principais da API

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Transactions:

- `GET /transactions`
- `GET /transactions?type=EXPENSE&categoryId=ID&search=mercado`
- `GET /transactions?startDate=2026-04-01&endDate=2026-04-30`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

Categories:

- `GET /categories`
- `GET /categories?type=INCOME`
- `POST /categories`
- `GET /categories/:id`
- `PUT /categories/:id`
- `DELETE /categories/:id`

Users:

- `GET /users/profile`
- `PUT /users/profile`

Dashboard:

- `GET /dashboard`

Frontend:

- `/settings` para configurar tema, cor de destaque, densidade, moeda e confirmacoes de exclusao.

## Exemplos de payload

Cadastro:

```json
{
  "name": "Gustavo Wyllyah",
  "email": "gustavo@email.com",
  "password": "123456"
}
```

Login:

```json
{
  "email": "gustavo@email.com",
  "password": "123456"
}
```

Criar transacao:

```json
{
  "title": "Salario",
  "amount": 3000,
  "type": "INCOME",
  "category": "Trabalho",
  "date": "2026-04-29",
  "description": "Recebimento mensal"
}
```

Criar categoria:

```json
{
  "name": "Alimentacao",
  "type": "EXPENSE",
  "color": "#f43f5e",
  "icon": "cartao"
}
```

## Seguranca

- Senhas sao salvas com hash usando bcrypt.
- Autenticacao usa JWT.
- Rotas financeiras sao protegidas.
- Usuarios so acessam suas proprias transacoes.
- Arquivos `.env` nao devem ser enviados ao GitHub.
- Preferencias visuais ficam no `localStorage`; dados financeiros principais nao devem ser salvos no `localStorage`.

## Configuracoes do frontend

A pagina `/settings` permite ajustar preferencias locais da interface:

- Tema: sistema, claro ou escuro.
- Cor de destaque: azul, ciano, verde ou roxo.
- Densidade: confortavel ou compacta.
- Moeda: BRL, USD ou EUR.
- Confirmacao antes de excluir transacoes e categorias.

Essas preferencias sao salvas apenas no navegador usando `localStorage`.

## Aprendizados do projeto

- Criacao de API REST
- Autenticacao com JWT
- Integracao frontend/backend
- Prisma ORM
- PostgreSQL
- CRUD completo
- Categorias personalizadas por usuario
- Filtros avancados em listagens
- Perfil do usuario
- Configuracoes locais de interface
- Dashboard com dados reais
- Dashboard com comparativos mensais
- Rotas protegidas
- Organizacao de projeto full stack

## Proximas melhorias

- Deploy do backend
- Deploy do frontend
- Refresh token
- Cookies HTTP-only
- Relatorios mensais
- Exportacao CSV/PDF
- Testes automatizados

## Autor

Gustavo Wyllyah

GitHub:

https://github.com/wyllyah

LinkedIn:

Adicionar link futuramente
