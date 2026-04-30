import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Tags, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../services/categoryService";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório."),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const defaultValues = {
  name: "",
  type: "EXPENSE",
  color: "#2563eb",
  icon: "",
};

const defaultValuesByType = {
  INCOME: {
    ...defaultValues,
    type: "INCOME",
    color: "#059669",
  },
  EXPENSE: {
    ...defaultValues,
    type: "EXPENSE",
    color: "#e11d48",
  },
};

const categorySuggestions = {
  INCOME: ["Salário", "Freelance"],
  EXPENSE: ["Alimentação", "Transporte", "Moradia", "Lazer"],
};

const iconSuggestions = {
  INCOME: [
    "💰",
    "💼",
    "📈",
    "💵",
    "🎁",
    "🏦",
    "🧾",
    "💻",
    "🤝",
    "🏆",
    "📊",
    "🪙",
  ],
  EXPENSE: [
    "🍽️",
    "🚌",
    "🏠",
    "🎮",
    "💳",
    "🛒",
    "🏥",
    "📚",
    "⛽",
    "⚡",
    "📱",
    "💊",
    "🎬",
    "✈️",
    "👕",
    "🐾",
  ],
};

export function Categories() {
  const { confirmDelete, isCompact } = useSettings();
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const selectedType = useWatch({ control, name: "type" });
  const suggestions = categorySuggestions[selectedType] || [];
  const icons = iconSuggestions[selectedType] || [];
  const namePlaceholder = selectedType === "INCOME" ? "Salário" : "Alimentação";

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listCategories(filterType ? { type: filterType } : {});
      setCategories(data);
    } catch {
      setError("Erro ao carregar categorias.");
      toast.error("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError("");

      try {
        const data = await listCategories(filterType ? { type: filterType } : {});
        setCategories(data);
      } catch {
        setError("Erro ao carregar categorias.");
        toast.error("Erro ao carregar categorias.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [filterType]);

  function openCreateModal() {
    setEditingCategory(null);
    reset(defaultValuesByType[filterType] || defaultValues);
    setIsModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    reset({
      name: category.name,
      type: category.type,
      color: category.color || "#2563eb",
      icon: category.icon || "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset(defaultValues);
  }

  async function onSubmit(formData) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Categoria atualizada com sucesso.");
      } else {
        await createCategory(formData);
        toast.success("Categoria criada com sucesso.");
      }

      closeModal();
      await loadCategories();
    } catch {
      toast.error("Erro ao salvar categoria.");
    }
  }

  async function handleDelete(category) {
    const confirmed =
      !confirmDelete ||
      window.confirm("Tem certeza que deseja excluir esta categoria?");

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);

    try {
      await deleteCategory(category.id);
      toast.success("Categoria excluída com sucesso.");
      await loadCategories();
    } catch {
      toast.error("Erro ao excluir categoria.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Categorias"
        description="Crie categorias personalizadas para organizar receitas e despesas"
        action={
          <Button onClick={openCreateModal}>
            <Plus size={18} />
            Nova categoria
          </Button>
        }
      />

      <Card className="border-cyan-400/20">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="category-filter"
              className="text-sm font-medium text-slate-300"
            >
              Tipo
            </label>
            <select
              id="category-filter"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
            >
              <option value="">Todas</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" onClick={() => setFilterType("")} className="w-full sm:w-auto">
              Limpar filtro
            </Button>
          </div>
        </div>
      </Card>

      {error && <ErrorMessage title="Erro em categorias" message={error} />}

      {loading ? (
        <Loading message="Carregando categorias..." />
      ) : categories.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma categoria encontrada"
            description="Crie categorias para deixar suas transações mais organizadas."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={18} />
                Nova categoria
              </Button>
            }
          />
        </Card>
      ) : (
        <section className={`grid ${isCompact ? "gap-3" : "gap-4"} sm:grid-cols-2 xl:grid-cols-3`}>
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden transition hover:-translate-y-0.5 hover:border-cyan-400/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-1 shrink-0 rounded-full border border-white/70 shadow-sm"
                      style={{ backgroundColor: category.color || "#2563eb" }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Categoria personalizada
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <TransactionBadge type={category.type} />
                    {category.icon && (
                      <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-sm font-semibold text-slate-300">
                        {category.icon}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900/60 text-slate-400 transition group-hover:bg-cyan-400/10 group-hover:text-blue-600">
                  <Tags size={20} />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(category)}
                  disabled={Boolean(deletingId)}
                  className="h-9 w-9 px-0"
                  title="Editar categoria"
                  aria-label="Editar categoria"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(category)}
                  disabled={Boolean(deletingId)}
                  className="h-9 w-9 px-0"
                  title="Excluir categoria"
                  aria-label="Excluir categoria"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}

      {isModalOpen && (
        <Modal
          title={editingCategory ? "Editar categoria" : "Nova categoria"}
          description="Categorias ajudam a classificar receitas e despesas."
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="category-name"
              label="Nome"
              placeholder={namePlaceholder}
              list="category-name-suggestions"
              error={errors.name?.message}
              {...register("name")}
            />
            <datalist id="category-name-suggestions">
              {suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="category-type"
                  className="text-sm font-medium text-slate-300"
                >
                  Tipo
                </label>
                <select
                  id="category-type"
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                  {...register("type")}
                >
                  <option value="INCOME">Receita</option>
                  <option value="EXPENSE">Despesa</option>
                </select>
              </div>
              <Input
                id="category-color"
                label="Cor"
                type="color"
                className="h-11 p-1"
                {...register("color")}
              />
              <div className="space-y-2">
                <label
                  htmlFor="category-icon"
                  className="text-sm font-medium text-slate-300"
                >
                  Ícone
                </label>
                <select
                  id="category-icon"
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                  {...register("icon")}
                >
                  <option value="">Sem ícone</option>
                  {icons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar categoria"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

