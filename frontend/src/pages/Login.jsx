import { Eye, EyeOff, Lock, Mail, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { useAuth } from "../contexts/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#051426] px-4 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(37,99,235,0.2),transparent_34%)]" />
      <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 shadow-[0_0_70px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden border-r border-slate-800 bg-slate-950/60 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.1),transparent_30%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
                <Wallet size={24} />
              </div>
              <p className="text-xl font-bold uppercase tracking-[0.16em] text-cyan-300">
                FinanceFlow
              </p>
            </div>
            <h1 className="mt-12 max-w-md text-5xl font-semibold leading-tight tracking-tight">
              Controle suas finanças com clareza
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Visualize receitas, despesas e saldo em uma experiência simples,
              segura e conectada aos seus dados reais.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-semibold">Dashboard</p>
              <p className="mt-1 text-slate-400">Resumo financeiro</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-semibold">Transações</p>
              <p className="mt-1 text-slate-400">CRUD completo</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-semibold">JWT</p>
              <p className="mt-1 text-slate-400">Rotas protegidas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                  <Wallet size={22} />
                </div>
                <p className="text-xl font-bold uppercase tracking-[0.16em] text-cyan-300">
                  FinanceFlow
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Bem-vindo de volta
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Entrar na conta
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Acesse seu painel financeiro para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="email"
                label="E-mail"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                icon={Mail}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                id="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Sua senha"
                icon={Lock}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                rightElement={
                  <button
                    type="button"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-cyan-200"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
              />

              {error && <ErrorMessage title="Erro ao entrar" message={error} />}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-4 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Não tem conta?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
