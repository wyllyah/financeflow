# FinanceFlow

FinanceFlow é uma aplicação full stack de controle financeiro pessoal. O projeto oferece uma experiência moderna para acompanhar receitas, despesas, saldo, categorias e indicadores financeiros, com autenticação segura e dados isolados por usuário.

## Links finais

- Frontend: https://financeflow-wheat-tau.vercel.app
- Backend: https://financeflow-34u8.onrender.com

## Funcionalidades principais

- Cadastro e login de usuários
- Autenticação com JWT
- Dashboard financeiro com saldo, receitas, despesas e comparativos
- CRUD completo de transações
- Cadastro e gestão de categorias personalizadas
- Filtros de transações por tipo, categoria, busca, período, mês, ano e ordenação
- Perfil do usuário
- Configurações de interface com preferências locais
- Recuperação de senha
- Dados financeiros protegidos por usuário autenticado

## Tecnologias usadas

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
- Lucide React
- Recharts
- React Hook Form
- Zod

Deploy e infraestrutura:

- Vercel para frontend
- Render para backend
- Supabase PostgreSQL para banco de dados

## Como rodar localmente

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
cd financeflow
```

### Backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Crie `backend/.env` a partir de `backend/.env.example`:

```env
PORT=3333
DATABASE_URL="postgresql://..."
JWT_SECRET="sua_chave_jwt"
FRONTEND_URL="http://localhost:5173"
```

Gere o Prisma Client e rode o servidor:

```bash
npx prisma generate
npm run dev
```

Backend local:

```text
http://localhost:3333
```

### Frontend

Em outro terminal, entre na pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

Crie `frontend/.env` a partir de `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

Rode a aplicação:

```bash
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Variáveis de ambiente

Backend:

- `PORT`: porta usada pela API.
- `DATABASE_URL`: URL de conexão do PostgreSQL.
- `JWT_SECRET`: chave usada para assinar tokens JWT.
- `FRONTEND_URL`: URL pública do frontend autorizada no CORS.

Frontend:

- `VITE_API_URL`: URL da API consumida pelo Axios.

## Deploy

### Frontend na Vercel

1. Configure o projeto apontando para a pasta `frontend`.
2. Defina o comando de build como `npm run build`.
3. Defina o diretório de saída como `dist`.
4. Configure a variável `VITE_API_URL` com a URL pública do backend no Render.
5. Faça o deploy.

### Backend no Render

1. Configure o serviço apontando para a pasta `backend`.
2. Defina o comando de build conforme necessário para instalar dependências e gerar o Prisma Client.
3. Defina o comando de start como `npm start`.
4. Configure as variáveis `PORT`, `DATABASE_URL`, `JWT_SECRET` e `FRONTEND_URL`.
5. Use em `FRONTEND_URL` a URL pública do frontend na Vercel.

### Banco no Supabase PostgreSQL

1. Crie o projeto no Supabase.
2. Copie a connection string PostgreSQL.
3. Configure essa URL em `DATABASE_URL` no backend.
4. Rode as migrations do Prisma em ambiente apropriado antes de usar a API em produção.

## Segurança

- Não versionar arquivos `.env`.
- Senhas são armazenadas com hash usando bcrypt.
- A autenticação usa JWT.
- Rotas financeiras exigem autenticação.
- Transações e categorias são protegidas por usuário.
- O frontend não acessa o banco diretamente; toda regra de negócio fica no backend.

## Estrutura

```text
financeflow/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── agent.md
└── README.md
```
