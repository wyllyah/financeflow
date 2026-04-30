import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  DollarSign,
  Edit2,
  Plus,
  Trash2,
  Type,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { TransactionBadge } from "../components/TransactionBadge";
import { useSettings } from "../contexts/useSettings";
import { api } from "../services/api";
import { listCategories } from "../services/categoryService";
import { formatCurrency, formatDate, parseCurrencyInput } from "../utils/formatters";

const DEFAULT_FILTER_YEAR = "2026";

const transactionSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório."),
  amount: z.preprocess(
    (value) => (value === "" ? undefined : parseCurrencyInput(value)),
    z
      .number({ error: "Valor obrigatório." })
      .positive("Valor obrigatório e maior que zero.")
  ),
  type: z.enum(["INCOME", "EXPENSE"], {
    error: "Tipo obrigatório.",
  }),
  categoryId: z.string().optional(),
  category: z.string().optional(),
  date: z.string().min(1, "Data obrigatória."),
  description: z.string().optional(),
}).superRefine((data, context) => {
  if (!data.categoryId && !data.category?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["category"],
      message: "Categoria obrigatória.",
    });
  }
});

const months = [
  { value: "", label: "Todos" },
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const sortOptions = [
  { value: "date", label: "Data", icon: CalendarDays },
  { value: "amount", label: "Valor", icon: DollarSign },
  { value: "title", label: "Título", icon: Type },
];

const orderOptions = [
  { value: "desc", label: "Decrescente", icon: ArrowDown },
  { value: "asc", label: "Crescente", icon: ArrowUp },
];

function getDefaultFormValues() {
  return {
    title: "",
    amount: "",
    type: "EXPENSE",
    categoryId: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  };
}

function buildPayload(formData) {
  return {
    title: formData.title.trim(),
    amount: parseCurrencyInput(formData.amount),
    type: formData.type,
    categoryId: formData.categoryId || undefined,
    category: formData.category?.trim() || undefined,
    date: formData.date,
    description: formData.description?.trim() || undefined,
  };
}

function getInputDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function SortIconButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        active
          ? "border-cyan-400/30 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
          : "border-slate-800 bg-slate-950/65 text-slate-400 hover:border-cyan-400/40 hover:bg-slate-900/60 hover:text-slate-100"
      }`}
    >
      <Icon size={17} />
    </button>
  );
}

function getFilterParams(filters) {
  const params = {};

  if (filters.type) {
    params.type = filters.type;
  }

  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  if (filters.month && filters.year) {
    params.month = filters.month;
    params.year = filters.year;
  }

  if (filters.sortBy) {
    params.sortBy = filters.sortBy;
  }

  if (filters.order) {
    params.order = filters.order;
  }

  return params;
}

export function Transactions() {
  const { confirmDelete, currency, isCompact } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    categoryId: "",
    search: "",
    month: "",
    year: DEFAULT_FILTER_YEAR,
    startDate: "",
    endDate: "",
    sortBy: "date",
    order: "desc",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultFormValues(),
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const categoryOptions =
    categories.filter((category) => category.type === selectedType);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch {
        toast.error("Erro ao carregar categorias.");
      }
    }

    loadCategories();
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/transactions", {
        params: getFilterParams(filters),
      });
      setTransactions(data.transactions || []);
    } catch {
      setError("Erro ao carregar transações.");
      toast.error("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/transactions", {
          params: getFilterParams(filters),
        });
        setTransactions(data.transactions || []);
      } catch {
        setError("Erro ao carregar transações.");
        toast.error("Erro ao carregar transações.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [filters]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  function handleFilterChange(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      type: "",
      categoryId: "",
      search: "",
      month: "",
      year: DEFAULT_FILTER_YEAR,
      startDate: "",
      endDate: "",
      sortBy: "date",
      order: "desc",
    });
  }

  function openCreateForm() {
    setEditingTransaction(null);
    setSubmitError("");
    reset(getDefaultFormValues());
    setIsFormOpen(true);
  }

  function openEditForm(transaction) {
    setEditingTransaction(transaction);
    setSubmitError("");
    reset({
      title: transaction.title || "",
      amount: String(transaction.amount || ""),
      type: transaction.type || "EXPENSE",
      categoryId: transaction.categoryId || "",
      category: transaction.category || "",
      date: getInputDate(transaction.date),
      description: transaction.description || "",
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTransaction(null);
    setSubmitError("");
    reset(getDefaultFormValues());
  }

  async function onSubmit(formData) {
    setSubmitError("");

    try {
      const payload = buildPayload(formData);

      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
        toast.success("Transação atualizada com sucesso.");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transação criada com sucesso.");
      }

      closeForm();
      await loadTransactions();
    } catch {
      setSubmitError("Erro ao salvar transação.");
      toast.error("Erro ao salvar transação.");
    }
  }

  async function handleDelete(transaction) {
    const confirmed =
      !confirmDelete ||
      window.confirm("Tem certeza que deseja excluir esta transação?");

    if (!confirmed) {
      return;
    }

    setDeletingId(transaction.id);

    try {
      await api.delete(`/transactions/${transaction.id}`);
      toast.success("Transação excluída com sucesso.");
      await loadTransactions();
    } catch {
      setError("Erro ao excluir transação.");
      toast.error("Erro ao excluir transação.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Transações"
        description="Gerencie suas receitas e despesas"
        action={
          <Button onClick={openCreateForm}>
            <Plus size={18} />
            Nova transação
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-400/20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Total de receitas
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-emerald-300">
            {formatCurrency(summary.totalIncome, currency)}
          </p>
        </Card>
        <Card className="border-rose-400/20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Total de despesas
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-rose-300">
            {formatCurrency(summary.totalExpense, currency)}
          </p>
        </Card>
        <Card className="border-cyan-400/20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Saldo
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {formatCurrency(summary.balance, currency)}
          </p>
        </Card>
      </section>

      <Card className="border-cyan-400/20">
        <div className={`${isCompact ? "mb-4" : "mb-5"} text-center sm:text-left`}>
          <div>
            <h2 className="text-base font-semibold text-white">Filtros</h2>
            <p className="text-sm text-slate-400">
              Refine por tipo, categoria, busca e período.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-end">
          <div>
            <label
              htmlFor="filter-type"
              className="text-sm font-medium text-slate-300"
            >
              Tipo
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(event) => handleFilterChange("type", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
            >
              <option value="">Todos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-category"
              className="text-sm font-medium text-slate-300"
            >
              Categoria
            </label>
            <select
              id="filter-category"
              value={filters.categoryId}
              onChange={(event) =>
                handleFilterChange("categoryId", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
            >
              <option value="">Todas</option>
              {categories
                .filter((category) => !filters.type || category.type === filters.type)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
          </div>

          <Input
            id="filter-search"
            label="Buscar"
            placeholder="Título ou descrição"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
          />

          <div>
            <label
              htmlFor="filter-month"
              className="text-sm font-medium text-slate-300"
            >
              Mês
            </label>
            <select
              id="filter-month"
              value={filters.month}
              onChange={(event) =>
                handleFilterChange("month", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
            >
              {months.map((month) => (
                <option key={month.value || "all"} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="filter-start-date"
            label="Data inicial"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              handleFilterChange("startDate", event.target.value)
            }
          />

          <Input
            id="filter-end-date"
            label="Data final"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              handleFilterChange("endDate", event.target.value)
            }
          />

          <Input
            id="filter-year"
            label="Ano do filtro mensal"
            type="number"
            min="2000"
            max="2100"
            value={filters.year}
            onChange={(event) => handleFilterChange("year", event.target.value)}
          />

          <div className="flex items-end">
            <Button
              variant="secondary"
              size="md"
              onClick={clearFilters}
              className="h-11 w-full border-cyan-400/30 bg-cyan-400/10 px-6 text-cyan-300 hover:bg-cyan-400/15 hover:text-cyan-100 focus-visible:ring-cyan-400"
            >
              <XCircle size={18} />
              Limpar filtros
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <ErrorMessage title="Erro em transações" message={error} />
      )}

      <Card className="overflow-hidden border-cyan-400/20 p-0">
        <div className="flex flex-col gap-4 border-b border-slate-800 bg-slate-900/65 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Ordenar por
              </p>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <div key={option.value} className="text-center">
                    <SortIconButton
                      active={filters.sortBy === option.value}
                      icon={option.icon}
                      label={option.label}
                      onClick={() => handleFilterChange("sortBy", option.value)}
                    />
                    <span className="mt-1 block text-[11px] font-medium text-slate-400">
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Ordem
              </p>
              <div className="flex flex-wrap gap-2">
                {orderOptions.map((option) => (
                  <div key={option.value} className="text-center">
                    <SortIconButton
                      active={filters.order === option.value}
                      icon={option.icon}
                      label={option.label}
                      onClick={() => handleFilterChange("order", option.value)}
                    />
                    <span className="mt-1 block text-[11px] font-medium text-slate-400">
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={isCompact ? "p-4" : "p-5"}>
            <Loading message="Carregando transações..." />
          </div>
        ) : transactions.length === 0 ? (
          <div className={isCompact ? "p-4" : "p-6"}>
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Cadastre sua primeira receita ou despesa para começar a acompanhar suas finanças."
              action={
                <Button onClick={openCreateForm}>
                  <Plus size={18} />
                  Nova transação
                </Button>
              }
            />
          </div>
        ) : (
          <>
          <div className={`grid ${isCompact ? "gap-2 p-3" : "gap-3 p-4"} md:hidden`}>
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {transaction.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {transaction.category} · {formatDate(transaction.date)}
                    </p>
                  </div>
                  <TransactionBadge type={transaction.type} />
                </div>
                {transaction.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                    {transaction.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p
                    className={`font-bold ${
                      transaction.type === "INCOME"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {transaction.type === "EXPENSE" ? "- " : ""}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditForm(transaction)}
                      disabled={Boolean(deletingId)}
                      className="h-9 w-9 px-0"
                      aria-label="Editar transação"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(transaction)}
                      disabled={Boolean(deletingId)}
                      className="h-9 w-9 px-0"
                      aria-label="Excluir transação"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/75 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-3 font-medium">Título</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-800/70 transition last:border-0 hover:bg-slate-900/65"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-100">
                        {transaction.title}
                      </p>
                      {transaction.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {transaction.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <TransactionBadge type={transaction.type} />
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {transaction.category}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td
                      className={`px-5 py-4 text-right font-semibold ${
                        transaction.type === "INCOME"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {transaction.type === "EXPENSE" ? "- " : ""}
                      {formatCurrency(transaction.amount, currency)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditForm(transaction)}
                          disabled={Boolean(deletingId)}
                          className="h-9 w-9 px-0"
                          title="Editar transação"
                          aria-label="Editar transação"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(transaction)}
                          disabled={Boolean(deletingId)}
                          className="h-9 w-9 px-0"
                          title="Excluir transação"
                          aria-label="Excluir transação"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </Card>

      {isFormOpen && (
        <Modal
          title={editingTransaction ? "Editar transação" : "Nova transação"}
          description="Preencha os dados da movimentação."
          onClose={closeForm}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="title"
                  label="Título"
                  placeholder="Salário"
                  error={errors.title?.message}
                  {...register("title")}
                />
                <Input
                  id="amount"
                  label="Valor"
                  inputMode="decimal"
                  placeholder="Ex: 1000,50"
                  error={errors.amount?.message}
                  {...register("amount")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label
                    htmlFor="type"
                    className="text-sm font-medium text-slate-300"
                  >
                    Tipo
                  </label>
                  <select
                    id="type"
                    value={selectedType || "EXPENSE"}
                    onChange={(event) => {
                      setValue("type", event.target.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setValue("categoryId", "");
                      setValue("category", "");
                    }}
                    className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                  >
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                  </select>
                  {errors.type?.message && (
                    <p className="text-sm text-rose-600">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="categoryId"
                    className="text-sm font-medium text-slate-300"
                  >
                    Categoria salva
                  </label>
                  <select
                    id="categoryId"
                    className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                    {...register("categoryId")}
                  >
                    <option value="">Usar categoria textual</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoryOptions.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Crie categorias em Categorias ou use o campo textual.
                    </p>
                  )}
                </div>

                <Input
                  id="date"
                  label="Data"
                  type="date"
                  error={errors.date?.message}
                  {...register("date")}
                />
              </div>

              {!selectedCategoryId && (
                <Input
                  id="category"
                  label="Categoria textual"
                  placeholder={
                    selectedType === "INCOME" ? "Salário" : "Alimentação"
                  }
                  error={errors.category?.message}
                  {...register("category")}
                />
              )}

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-300"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  rows="4"
                  placeholder="Recebimento mensal"
                  className="max-h-40 w-full resize-y rounded-lg border border-slate-800 bg-slate-950/65 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                  {...register("description")}
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-rose-200 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Salvando..."
                    : editingTransaction
                      ? "Salvar alterações"
                      : "Cadastrar transação"}
                </Button>
              </div>
            </form>
        </Modal>
      )}
    </div>
  );
}

