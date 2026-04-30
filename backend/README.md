# FinanceFlow Backend

## Supabase Session Pooler

For Supabase Session Pooler, the database user must use the format:

```text
postgres.PROJECT_REF
```

In this project:

```text
postgres.ysimzxyfyzhtaocmjkks
```

Replace `YOUR_PASSWORD` in `.env` with the real database password before running Prisma migrations.

The pooled `DATABASE_URL` is used by the application. The `DIRECT_URL` is used by Prisma migrations.
