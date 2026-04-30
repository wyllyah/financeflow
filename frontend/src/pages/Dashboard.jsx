import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { PageHeader } from "../components/PageHeader";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionBadge } from "../components/TransactionBadge";
import { useSettings } from "../contexts/useSettings";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatters";

const categoryColors = [
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
];

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/65 px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-slate-100">{item.name}</p>
      <p className="text-slate-400">{formatCurrency(item.value, currency)}</p>
    </div>
  );
}

export function Dashboard() {
  const { currency, isCompact } = useSettings();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/dashboard");
        setDashboard(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Não foi possível carregar o dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className={isCompact ? "space-y-5" : "space-y-6"}>
        <PageHeader
          title="Dashboard"
          description="Acompanhe o resumo das suas finanças"
        />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {["balance", "income", "expense", "transactions"].map((item) => (
            <Card key={item}>
              <div className="h-20 animate-pulse rounded-lg bg-slate-800" />
            </Card>
          ))}
        </section>
        <Loading message="Carregando dashboard..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar dashboard" message={error} />;
  }

  const recentTransactions = dashboard?.recentTransactions || [];
  const expensesByCategory =
    dashboard?.transactionsByCategory || dashboard?.expensesByCategory || [];
  const incomeExpenseByMonth = dashboard?.incomeExpenseByMonth || [];
  const transactionsByType =
    dashboard?.transactionsByType?.map((item) => ({
      name: item.type,
      amount: Number(item.amount || 0),
      fill: item.type === "Receitas" ? "#10b981" : "#f43f5e",
    })) || [];
  const hasIncomeExpenseData = transactionsByType.some(
    (item) => item.amount > 0
  );
  const hasMonthlyData = incomeExpenseByMonth.some(
    (item) => Number(item.income) > 0 || Number(item.expense) > 0
  );
  const hasCategoryData = expensesByCategory.some(
    (item) => Number(item.amount) > 0
  );
  const monthBalance = Number(dashboard?.currentMonthBalance || 0);

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Dashboard"
        description="Acompanhe o resumo das suas finanças"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Saldo atual"
          value={formatCurrency(dashboard?.balance, currency)}
          icon={Wallet}
          color="slate"
        />
        <SummaryCard
          title="Total de receitas"
          value={formatCurrency(dashboard?.totalIncome, currency)}
          icon={TrendingUp}
          color="emerald"
        />
        <SummaryCard
          title="Total de despesas"
          value={formatCurrency(dashboard?.totalExpense, currency)}
          icon={TrendingDown}
          color="rose"
        />
        <SummaryCard
          title="Total de transações"
          value={dashboard?.totalTransactions || 0}
          icon={ReceiptText}
          color="amber"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Saldo do mês"
          value={formatCurrency(dashboard?.currentMonthBalance, currency)}
          icon={Wallet}
          color={monthBalance >= 0 ? "emerald" : "rose"}
        />
        <SummaryCard
          title="Receita do mês"
          value={formatCurrency(dashboard?.currentMonthIncome, currency)}
          icon={TrendingUp}
          color="emerald"
        />
        <SummaryCard
          title="Despesa do mês"
          value={formatCurrency(dashboard?.currentMonthExpense, currency)}
          icon={TrendingDown}
          color="rose"
        />
        <SummaryCard
          title="Maior despesa"
          value={formatCurrency(dashboard?.highestExpense?.amount, currency)}
          icon={ReceiptText}
          color="rose"
        />
        <SummaryCard
          title="Categoria destaque"
          value={dashboard?.topExpenseCategory?.category || "Sem dados"}
          icon={ReceiptText}
          color="amber"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="min-h-[24rem] border-cyan-400/20">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Últimos 6 meses
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Evolução mensal de receitas e despesas.
            </p>
          </div>

          {hasMonthlyData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeExpenseByMonth}
                  margin={{ left: 0, right: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value, currency)}
                    width={88}
                  />
                  <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: "#eff6ff" }} />
                  <Bar
                    name="Receitas"
                    dataKey="income"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    name="Despesas"
                    dataKey="expense"
                    fill="#f43f5e"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="Sem movimentações para comparar"
              description="Cadastre receitas ou despesas para visualizar este gráfico."
            />
          )}
        </Card>

        <Card className="min-h-[24rem] border-cyan-400/20">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Despesas por categoria
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Distribuição dos seus gastos cadastrados.
            </p>
          </div>

          {hasCategoryData ? (
            <div className="grid gap-4 lg:grid-cols-[220px_1fr] lg:items-center">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={56}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={categoryColors[index % categoryColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {expensesByCategory.map((item, index) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[index % categoryColors.length],
                        }}
                      />
                      <p className="truncate text-sm font-medium text-slate-300">
                        {item.category}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-white">
                      {formatCurrency(item.amount, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Nenhuma despesa categorizada"
              description="Quando houver despesas, elas aparecerão agrupadas por categoria."
            />
          )}
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-cyan-400/20">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Receitas x despesas total
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Comparativo geral das movimentações cadastradas.
            </p>
          </div>

          {hasIncomeExpenseData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsByType} margin={{ left: 0, right: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value, currency)}
                    width={88}
                  />
                  <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: "#eff6ff" }} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {transactionsByType.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="Sem dados para comparar"
              description="Cadastre receitas ou despesas para visualizar o gráfico."
            />
          )}
        </Card>

        <Card className="border-cyan-400/20">
          <h2 className="text-base font-semibold text-white">Insights</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/65 p-4 text-sm text-slate-400">
              {dashboard?.highestExpense ? (
                <>
                  Sua maior despesa foi{" "}
                  <strong className="text-white">
                    {dashboard.highestExpense.title}
                  </strong>
                  , no valor de{" "}
                  <strong className="text-rose-300">
                    {formatCurrency(dashboard.highestExpense.amount, currency)}
                  </strong>
                  .
                </>
              ) : (
                "Ainda não há despesas para destacar."
              )}
            </div>
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/65 p-4 text-sm text-slate-400">
              {dashboard?.topExpenseCategory ? (
                <>
                  Categoria com maior gasto:{" "}
                  <strong className="text-white">
                    {dashboard.topExpenseCategory.category}
                  </strong>{" "}
                  ({formatCurrency(dashboard.topExpenseCategory.amount, currency)}).
                </>
              ) : (
                "Nenhuma categoria de despesa encontrada."
              )}
            </div>
            <div
              className={`rounded-lg border p-4 text-sm ${
                monthBalance >= 0
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-300"
              }`}
            >
              Seu saldo do mês está {monthBalance >= 0 ? "positivo" : "negativo"}{" "}
              em <strong>{formatCurrency(monthBalance, currency)}</strong>.
            </div>
          </div>
        </Card>
      </section>

      <Card className="border-cyan-400/20">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Últimas transações
            </h2>
            <p className="text-sm text-slate-400">
              Movimentações mais recentes da sua conta.
            </p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="Nenhuma transação encontrada"
            description="As últimas movimentações aparecem aqui assim que forem cadastradas."
          />
        ) : (
          <>
            <div className="grid gap-3 sm:hidden">
              {recentTransactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="rounded-lg border border-slate-800/70 bg-slate-900/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-100">
                        {transaction.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {transaction.category}
                      </p>
                    </div>
                    <TransactionBadge type={transaction.type} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-400">
                      {formatDate(transaction.date)}
                    </span>
                    <span
                      className={`font-semibold ${
                        transaction.type === "INCOME"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {formatCurrency(transaction.amount, currency)}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-lg border border-slate-800/70 sm:block">
              <table className="w-full table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/75 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Categoria
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Tipo
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-800/70 transition last:border-0 hover:bg-slate-900/65"
                    >
                      <td className="px-4 py-3">
                        <p className="truncate font-medium text-slate-100">
                          {transaction.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400 sm:hidden">
                          {transaction.category}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">
                        {transaction.category}
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <TransactionBadge type={transaction.type} />
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                        {formatDate(transaction.date)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          transaction.type === "INCOME"
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }`}
                      >
                        {formatCurrency(transaction.amount, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

