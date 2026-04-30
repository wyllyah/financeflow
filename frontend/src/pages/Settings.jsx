import {
  DollarSign,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Settings as SettingsIcon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { SettingsCard } from "../components/SettingsCard";
import { SettingsOption } from "../components/SettingsOption";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useSettings } from "../contexts/useSettings";
import { accentStyles } from "../contexts/settings";

const themeOptions = [
  {
    value: "system",
    label: "Sistema",
    description: "Segue a preferência do seu sistema operacional.",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Claro",
    description: "Interface clara para ambientes com mais luz.",
    icon: Sun,
  },
  {
    value: "blue-dark",
    label: "Azul escuro",
    description: "Base preta com brilho frio e identidade mais tecnológica.",
    icon: Moon,
  },
];

const densityOptions = [
  {
    value: "comfortable",
    label: "Confortável",
    description: "Mais espaço entre cards, inputs e ações.",
  },
  {
    value: "compact",
    label: "Compacta",
    description: "Interface mais densa para ver mais informações.",
  },
];

const currencyOptions = [
  {
    value: "BRL",
    label: "BRL — Real brasileiro",
    description: "Exibe valores no padrão R$ 1.000,00.",
  },
  {
    value: "USD",
    label: "USD — Dólar americano",
    description: "Exibe valores no padrão US$ 1,000.00.",
  },
  {
    value: "EUR",
    label: "EUR — Euro",
    description: "Exibe valores no padrão €1.000,00.",
  },
];

export function Settings() {
  const {
    accent,
    confirmDelete,
    currency,
    density,
    getAccentClasses,
    resetSettings,
    setAccent,
    setConfirmDelete,
    setCurrency,
    setDensity,
    setTheme,
    theme,
    isCompact,
  } = useSettings();
  const activeAccent = getAccentClasses();

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Configurações"
        description="Personalize sua experiência no FinanceFlow"
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SettingsCard
          title="Aparência"
          description="Controle tema, destaque visual e densidade da interface."
          icon={Palette}
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Tema da interface
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`group relative overflow-hidden rounded-xl border p-4 text-left transition ${
                      isActive
                        ? `${activeAccent.border} ${activeAccent.soft} shadow-[0_0_30px_rgba(34,211,238,0.08)]`
                        : "border-slate-800 bg-slate-950/45 hover:border-slate-700 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                          isActive
                            ? `${activeAccent.border} ${activeAccent.soft} ${activeAccent.text}`
                            : "border-slate-800 bg-slate-900 text-slate-400"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      {isActive && (
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${activeAccent.soft} ${activeAccent.text}`}
                        >
                          <Check size={14} />
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      {option.label}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Cor de destaque
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(accentStyles).map(([value, option]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAccent(value)}
                  className={`rounded-lg border p-3 text-left transition ${
                    accent === value
                      ? `${option.border} ${option.soft}`
                      : "border-slate-800 bg-slate-950/45 hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-4 w-4 rounded-full ${option.dot}`} />
                    <span className="text-sm font-semibold text-white">
                      {option.name}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs text-slate-400">
                    Destaques e botões principais.
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Densidade
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {densityOptions.map((option) => (
                <SettingsOption
                  key={option.value}
                  active={density === option.value}
                  description={option.description}
                  label={option.label}
                  onClick={() => setDensity(option.value)}
                />
              ))}
            </div>
          </div>
        </SettingsCard>

        <div className="space-y-4">
          <SettingsCard
            title="Preferências financeiras"
            description="Defina como valores monetários aparecem na interface."
            icon={DollarSign}
          >
            <div className="grid gap-3">
              {currencyOptions.map((option) => (
                <SettingsOption
                  key={option.value}
                  active={currency === option.value}
                  description={option.description}
                  label={option.label}
                  onClick={() => setCurrency(option.value)}
                />
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Segurança e ações"
            description="Ajustes locais para ações sensíveis na interface."
            icon={ShieldCheck}
          >
            <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950/45 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Confirmação antes de excluir
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Quando ativo, transações e categorias pedem confirmação.
                </p>
              </div>
              <ToggleSwitch
                checked={confirmDelete}
                label="Ativar confirmação antes de excluir"
                onChange={setConfirmDelete}
              />
            </div>

            <Button
              variant="secondary"
              onClick={resetSettings}
              className="w-full justify-center border-rose-400/30 text-rose-200 hover:border-rose-400/50 hover:bg-rose-400/10"
            >
              <RotateCcw size={18} />
              Restaurar configurações padrão
            </Button>
          </SettingsCard>
        </div>
      </section>

      <section
        className={`rounded-xl border ${activeAccent.border} ${activeAccent.soft} p-4`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${activeAccent.soft} ${activeAccent.text}`}
          >
            <SettingsIcon size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Preferências salvas neste navegador
            </p>
            <p className="text-xs leading-5 text-slate-400">
              Essas opções ficam apenas no localStorage e não alteram dados
              financeiros nem configurações do backend.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
