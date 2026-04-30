import { CalendarDays, LogOut, Mail, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../contexts/useAuth";
import { useSettings } from "../contexts/useSettings";
import { getProfile, updateProfile } from "../services/userService";
import { formatDate } from "../utils/formatters";

export function Profile() {
  const { logout, loadUser } = useAuth();
  const { isCompact } = useSettings();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const user = await getProfile();
        setProfile(user);
        setName(user.name);
      } catch {
        setError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Nome deve ter pelo menos 2 caracteres.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const user = await updateProfile({ name: name.trim() });
      setProfile(user);
      setName(user.name);
      await loadUser();
      toast.success("Perfil atualizado com sucesso.");
    } catch {
      setError("Erro ao atualizar perfil.");
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading message="Carregando perfil..." />;
  }

  return (
    <div className={isCompact ? "space-y-5" : "space-y-7"}>
      <PageHeader
        title="Perfil"
        description="Visualize e atualize suas informações básicas"
      />

      {error && <ErrorMessage title="Erro no perfil" message={error} />}

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Card className="border-cyan-400/20">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm shadow-slate-950/20">
              <UserCircle size={30} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">
                {profile?.name}
              </p>
              <p className="truncate text-sm text-slate-400">{profile?.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-3 rounded-lg border border-slate-800/70 bg-slate-900/65 px-3 py-2.5">
              <Mail size={17} className="text-blue-500" />
              {profile?.email}
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800/70 bg-slate-900/65 px-3 py-2.5">
              <CalendarDays size={17} className="text-blue-500" />
              Conta criada em {formatDate(profile?.createdAt)}
            </div>
          </div>
          <Button variant="secondary" className="mt-6 w-full" onClick={logout}>
            <LogOut size={18} />
            Sair
          </Button>
        </Card>

        <Card className="border-cyan-400/20">
          <h2 className="text-base font-semibold text-white">
            Editar informações
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Por enquanto, apenas o nome pode ser atualizado.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              id="profile-name"
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              id="profile-email"
              label="E-mail"
              value={profile?.email || ""}
              disabled
              className="cursor-not-allowed bg-slate-800 text-slate-400"
            />
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

