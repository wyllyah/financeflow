import { Eye, EyeOff, Lock, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Token de recuperação não encontrado.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        password,
      });
      setSuccessMessage(data?.message || "Senha redefinida com sucesso.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Não foi possível redefinir a senha."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#051426] px-4 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(37,99,235,0.2),transparent_34%)]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center lg:min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-lg border-cyan-400/20 bg-slate-950/75">
          <div className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <Wallet size={22} />
              </div>
              <p className="text-xl font-bold uppercase tracking-[0.16em] text-cyan-300">
                FinanceFlow
              </p>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Redefinição de acesso
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Criar nova senha
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Defina uma nova senha para voltar a acessar sua conta com segurança.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="reset-password"
              label="Nova senha"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
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

            <Input
              id="reset-confirm-password"
              label="Confirmar senha"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repita a nova senha"
              icon={Lock}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              rightElement={
                <button
                  type="button"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-cyan-200"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
              required
            />

            {error && (
              <ErrorMessage title="Erro ao redefinir senha" message={error} />
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                <p>{successMessage}</p>
                <p className="mt-3">
                  <Link
                    to="/login"
                    className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
                  >
                    Voltar para login
                  </Link>
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>

          {!token && (
            <p className="mt-6 text-center text-sm text-rose-300">
              Abra esta página usando o link de recuperação gerado.
            </p>
          )}
        </Card>
      </section>
    </main>
  );
}
