# Agent Guide - FinanceFlow

## 1. Visao geral

FinanceFlow e uma aplicacao full stack para controle financeiro pessoal. O projeto e dividido em backend e frontend, com uma API REST protegida por JWT e uma interface React conectada aos dados reais do backend.

## 2. Objetivo do projeto

O sistema deve permitir:

- Cadastro e login de usuarios
- Registro de receitas e despesas
- Dashboard financeiro
- Gestao de transacoes
- Categorias personalizadas
- Perfil do usuario
- Configuracoes de interface
- Visualizacao de saldo, receitas, despesas e categorias
- Dashboard avancado com dados mensais, comparativos e insights

## 3. Stack obrigatoria

Backend:

- Node.js
- Express
- Prisma
- PostgreSQL
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

## 4. Estrutura do projeto

```text
financeflow/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── agent.md
```

## 5. Regras gerais para futuras alteracoes

- Preservar a arquitetura com backend e frontend separados.
- Nao acessar o banco diretamente pelo frontend.
- Toda regra de negocio deve ficar no backend.
- Toda comunicacao do frontend com backend deve usar Axios.
- Rotas protegidas devem exigir JWT.
- Nao usar dados fake como fonte principal.
- Nao expor variaveis sensiveis.
- Nao colocar `.env` no GitHub.
- Manter codigo simples, organizado e didatico.
- Evitar overengineering.
- Priorizar componentes reutilizaveis no frontend.
- Priorizar controllers e routes separados no backend.

## 6. Backend - regras

- Controllers ficam em `backend/src/controllers`.
- Routes ficam em `backend/src/routes`.
- Middlewares ficam em `backend/src/middlewares`.
- Prisma Client fica em `backend/src/lib/prisma.js`.
- Autenticacao usa JWT.
- Senhas devem ser criptografadas com bcrypt.
- Validacoes devem usar Zod.
- Rotas de transacoes devem sempre usar `authMiddleware`.
- Rotas de categorias devem sempre usar `authMiddleware`.
- Rotas de perfil devem sempre usar `authMiddleware`.
- Cada usuario so acessa as proprias transacoes usando `userId`.
- Cada usuario so acessa as proprias categorias usando `userId`.
- Transacoes podem usar `categoryId` opcional, mas devem manter `category` textual por compatibilidade.
- Nao retornar `passwordHash` nas respostas da API.

## 7. Frontend - regras

- Pages ficam em `frontend/src/pages`.
- Components ficam em `frontend/src/components`.
- Contexts ficam em `frontend/src/contexts`.
- `SettingsContext` fica em `frontend/src/contexts/SettingsContext.jsx`.
- Layouts ficam em `frontend/src/layouts`.
- Services ficam em `frontend/src/services`.
- Helpers ficam em `frontend/src/utils`.
- Axios fica em `frontend/src/services/api.js`.
- Token fica em `localStorage` apenas como solucao MVP.
- Rotas protegidas usam `ProtectedRoute`.
- Dashboard nao deve usar dados mockados.
- Transacoes devem carregar categorias via API REST, nunca via Supabase direto.
- Perfil deve usar `/users/profile`.
- Configuracoes de interface devem usar `/settings`.
- `localStorage` pode armazenar preferencias visuais, mas nao dados financeiros principais.
- Formularios devem preferir React Hook Form + Zod.
- Visual deve usar Tailwind CSS.

## 8. Variaveis de ambiente

Backend `.env`:

```env
PORT=3333
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:3333
```

Nunca expor valores reais de banco, JWT ou tokens em codigo, documentacao publica ou commits.

## 9. Rotas da API

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Transactions:

- `GET /transactions`
- `GET /transactions?type=INCOME`
- `GET /transactions?type=EXPENSE`
- `GET /transactions?month=4&year=2026`
- `GET /transactions?categoryId=abc`
- `GET /transactions?search=mercado`
- `GET /transactions?startDate=2026-04-01&endDate=2026-04-30`
- `GET /transactions?sortBy=amount&order=desc`
- `POST /transactions`
- `GET /transactions/:id`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

Categories:

- `GET /categories`
- `GET /categories?type=INCOME`
- `GET /categories?type=EXPENSE`
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

- `/settings`

## 9.1. Configuracoes locais

A pagina `/settings` usa `SettingsContext` e pode salvar apenas preferencias de interface no `localStorage`:

- `@financeflow:theme`
- `@financeflow:accent`
- `@financeflow:density`
- `@financeflow:currency`
- `@financeflow:confirmDelete`

Essas preferencias nao substituem regras de negocio e nao devem armazenar transacoes, categorias, tokens extras ou dados financeiros principais.

## 10. Banco de dados

Model `User`:

- `id`
- `name`
- `email`
- `passwordHash`
- `transactions`
- `categories`
- `createdAt`
- `updatedAt`

Model `Transaction`:

- `id`
- `title`
- `amount`
- `type`
- `category`
- `categoryId`
- `categoryRef`
- `date`
- `description`
- `userId`
- `createdAt`
- `updatedAt`

Model `Category`:

- `id`
- `name`
- `type`
- `color`
- `icon`
- `userId`
- `transactions`
- `createdAt`
- `updatedAt`

Enum `TransactionType`:

- `INCOME`
- `EXPENSE`

## 11. Padroes visuais

- Interface limpa e moderna.
- Fundo `slate-50`.
- Cards brancos.
- Bordas suaves.
- Layout responsivo.
- Graficos com Recharts.
- Icones com Lucide React.

## 12. Proximas melhorias futuras

- Deploy backend
- Deploy frontend
- Cookies HTTP-only
- Recuperacao de senha
- Perfil do usuario
- Categorias personalizadas
- Relatorios mensais
- Exportacao CSV/PDF
- Testes automatizados
- Melhorias de seguranca
