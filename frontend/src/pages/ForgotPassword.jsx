import { Mail, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setResetUrl("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSuccessMessage(
        data?.message ||
          "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha."
      );
      setResetUrl(data?.resetUrl || "");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Não foi possível iniciar a recuperação de senha."
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
              Recuperação de acesso
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Recuperar senha
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Informe seu e-mail para gerar um link de redefinição em ambiente de desenvolvimento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="forgot-password-email"
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              icon={Mail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {error && (
              <ErrorMessage title="Erro ao solicitar recuperação" message={error} />
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                <p>{successMessage}</p>
                {resetUrl && (
                  <p className="mt-3 break-all">
                    Link de teste:{" "}
                    <a
                      href={resetUrl}
                      className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
                    >
                      {resetUrl}
                    </a>
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Lembrou da senha?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Voltar para login
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
}
