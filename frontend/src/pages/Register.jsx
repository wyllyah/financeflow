import { Eye, EyeOff, Lock, Mail, User, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { useAuth } from "../contexts/useAuth";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#051426] px-4 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_75%,rgba(16,185,129,0.12),transparent_34%)]" />
      <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 shadow-[0_0_70px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                  <Wallet size={22} />
                </div>
                <p className="text-xl font-bold uppercase tracking-[0.16em] text-cyan-300">
                  FinanceFlow
                </p>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Comece agora
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Criar conta
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Organize receitas e despesas em um painel simples e visual.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="name"
                label="Nome"
                autoComplete="name"
                placeholder="Seu nome"
                icon={User}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
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
                autoComplete="new-password"
                placeholder="Mínimo de 6 caracteres"
                icon={Lock}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
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

              {error && (
                <ErrorMessage title="Erro ao criar conta" message={error} />
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Criando..." : "Criar conta"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden border-l border-slate-800 bg-slate-950/60 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.1),transparent_32%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
                <Wallet size={24} />
              </div>
              <p className="text-xl font-bold uppercase tracking-[0.16em] text-cyan-300">
                FinanceFlow
              </p>
            </div>
            <h2 className="mt-12 max-w-md text-5xl font-semibold leading-tight tracking-tight">
              Sua vida financeira em uma visão clara
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Cadastre transações, acompanhe gráficos e tome decisões melhores
              com dados sempre organizados.
            </p>
          </div>
          <div className="relative rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="text-sm font-semibold text-white">
              Feito para o dia a dia
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Um MVP direto, moderno e pronto para evoluir com relatórios,
              categorias e melhorias de segurança.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
