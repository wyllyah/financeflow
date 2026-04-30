import { HelpCircle, LifeBuoy, Mail, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { PageHeader } from "../components/PageHeader";
import { useSettings } from "../contexts/useSettings";

const faqItems = [
  {
    question: "O que é o FinanceFlow?",
    answer:
      "O FinanceFlow é um sistema de controle financeiro pessoal para registrar receitas, despesas, categorias e acompanhar seu saldo por meio de dashboard e gráficos.",
  },
  {
    question: "Como cadastrar uma receita?",
    answer:
      "Acesse a página Transações, clique em Nova transação, selecione o tipo Receita, preencha os dados e salve.",
  },
  {
    question: "Como cadastrar uma despesa?",
    answer:
      "Acesse a página Transações, clique em Nova transação, selecione o tipo Despesa, informe valor, categoria, data e salve.",
  },
  {
    question: "Como criar categorias?",
    answer:
      "Acesse a página Categorias, clique em Nova categoria e defina nome, tipo, cor e ícone para organizar suas transações.",
  },
  {
    question: "Como alterar a moeda?",
    answer:
      "Acesse Configurações e escolha a moeda desejada entre BRL, USD ou EUR.",
  },
  {
    question: "Como ativar modo claro ou escuro?",
    answer:
      "Acesse Configurações e escolha entre Sistema, Claro ou Escuro.",
  },
  {
    question: "Meus dados ficam separados dos outros usuários?",
    answer:
      "Sim. Cada usuário acessa apenas suas próprias transações, categorias e informações financeiras.",
  },
  {
    question: "Posso excluir uma transação?",
    answer:
      "Sim. Na página Transações, use a ação de excluir. A confirmação pode ser ativada ou desativada em Configurações.",
  },
  {
    question: "Por que o dashboard não mostra dados?",
    answer:
      "O dashboard depende das transações cadastradas. Cadastre receitas e despesas para visualizar cards, gráficos e insights.",
  },
  {
    question: "Como sair da conta?",
    answer:
      "Clique no botão Sair disponível no menu lateral ou na página de Perfil.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full rounded-xl border text-left transition ${
        isOpen
          ? "border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
          : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/70"
      }`}
      aria-expanded={isOpen}
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
            isOpen
              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
              : "border-slate-800 bg-slate-900 text-slate-400"
          }`}
        >
          <HelpCircle size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white sm:text-base">
              {item.question}
            </p>
            <span
              className={`shrink-0 text-lg leading-none transition ${
                isOpen ? "rotate-45 text-cyan-300" : "text-slate-500"
              }`}
            >
              +
            </span>
          </div>
          <div
            className={`grid transition-all duration-200 ease-out ${
              isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm leading-6 text-slate-400">{item.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function Help() {
  const { isCompact } = useSettings();
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState(faqItems[0].question);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return faqItems;
    }

    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Ajuda e Suporte"
        description="Encontre respostas rápidas sobre o FinanceFlow"
      />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-cyan-400/20">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white">Perguntas frequentes</h2>
              <p className="mt-1 text-sm text-slate-400">
                Pesquise por tema ou abra uma pergunta para ver a resposta.
              </p>
            </div>

            <Input
              id="help-search"
              label="Buscar respostas"
              placeholder="Ex.: moeda, receita, dashboard"
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {filteredItems.length === 0 ? (
              <EmptyState
                title="Nenhuma resposta encontrada"
                description="Tente buscar por outro termo, como transações, categorias ou moeda."
              />
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <FaqItem
                    key={item.question}
                    item={item}
                    isOpen={openQuestion === item.question}
                    onToggle={() =>
                      setOpenQuestion((current) =>
                        current === item.question ? "" : item.question
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-cyan-400/20">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <LifeBuoy size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Suporte rápido</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use esta área como ponto de orientação antes do deploy ou durante o uso diário.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-cyan-400/20">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Contato e suporte</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Se a dúvida não estiver nesta lista, revise também as páginas de Configurações,
                  Perfil e Transações. Para suporte do projeto, centralize as próximas orientações
                  na documentação interna e nos canais definidos para o FinanceFlow.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
