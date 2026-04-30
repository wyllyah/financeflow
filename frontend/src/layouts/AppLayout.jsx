import {
  LifeBuoy,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
  Tags,
  UserCircle,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/useAuth";
import { useSettings } from "../contexts/useSettings";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ReceiptText },
  { to: "/categories", label: "Categorias", icon: Tags },
  { to: "/profile", label: "Perfil", icon: UserCircle },
];

const footerNavigation = [
  { to: "/settings", label: "Configurações", icon: Settings },
  { to: "/help", label: "Ajuda e Suporte", icon: LifeBuoy },
];

function NavigationLink({ item, onClick }) {
  const Icon = item.icon;
  const { getAccentClasses } = useSettings();
  const accent = getAccentClasses();

  return (
    <NavLink to={item.to} end={item.to === "/"} onClick={onClick}>
      {({ isActive }) => (
        <div
          className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
            isActive
              ? `border ${accent.border} ${accent.soft} ${accent.text} shadow-[0_0_24px_rgba(34,211,238,0.08)]`
              : "border border-transparent text-slate-500 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-200"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
              isActive
                ? `${accent.border} ${accent.soft} ${accent.text}`
                : "border-slate-800 bg-slate-900/80 text-slate-400 group-hover:border-slate-700 group-hover:text-slate-200"
            }`}
          >
            <Icon size={19} />
          </span>
          <span className="truncate">{item.label}</span>
        </div>
      )}
    </NavLink>
  );
}

function SidebarContent({ user, logout, onNavigate }) {
  const { getAccentClasses } = useSettings();
  const accent = getAccentClasses();

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-7">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.9)]">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${accent.border} ${accent.soft} ${accent.text} shadow-[0_0_30px_rgba(34,211,238,0.16)]`}
          >
            <Wallet size={26} />
          </div>
          <div className="min-w-0">
            <p
              className={`truncate text-[1.35rem] font-extrabold uppercase tracking-[0.18em] ${accent.text}`}
            >
              FinanceFlow
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Financial OS
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2.5 px-4">
        {navigation.map((item) => (
          <NavigationLink key={item.to} item={item} onClick={onNavigate} />
        ))}
      </nav>

      <div className="space-y-4 border-t border-slate-800 p-4">
        <nav className="space-y-2.5">
          {footerNavigation.map((item) => (
            <NavigationLink key={item.to} item={item} onClick={onNavigate} />
          ))}
        </nav>

        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_16px_36px_-28px_rgba(0,0,0,0.9)]">
          <p className="truncate text-[15px] font-semibold text-white">
            {user?.name || "Usuário"}
          </p>
          <p className="mt-1 truncate text-sm text-slate-400">{user?.email}</p>
        </div>

        <Button
          variant="ghost"
          className="h-12 w-full justify-start rounded-xl px-4 text-[15px] font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
          onClick={logout}
        >
          <LogOut size={19} />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { getAccentClasses, theme } = useSettings();
  const accent = getAccentClasses();
  const isTrueDark = theme === "dark";
  const isDarkSurface = theme === "dark" || theme === "blue-dark";
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  return (
    <div
      className={`min-h-screen overflow-x-clip text-slate-100 selection:bg-cyan-400 selection:text-slate-950 ${
        isTrueDark ? "bg-slate-950" : "bg-[#051426]"
      }`}
    >
      <div
        className={`pointer-events-none fixed inset-0 ${
          isTrueDark
            ? "bg-[radial-gradient(circle_at_18%_0%,rgba(148,163,184,0.08),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.9)_100%)]"
            : "bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(37,99,235,0.16),transparent_28%),linear-gradient(180deg,rgba(5,20,38,0)_0%,rgba(1,15,33,0.72)_100%)]"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto border-r border-slate-800 shadow-[4px_0_28px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:block ${
          isDarkSurface ? "bg-black/85" : "bg-slate-950/80"
        }`}
      >
        <SidebarContent user={user} logout={handleLogout} />
      </aside>

      <header
        className={`sticky top-0 z-30 border-b border-slate-800 backdrop-blur-xl lg:hidden ${
          isDarkSurface ? "bg-black/80" : "bg-slate-950/75"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg border ${accent.border} ${accent.soft} ${accent.text}`}
            >
              <Wallet size={20} />
            </div>
            <div>
              <p className={`font-bold uppercase tracking-[0.14em] ${accent.text}`}>
                FinanceFlow
              </p>
              <p className="text-xs text-slate-400">{user?.name}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="h-10 w-10 px-0"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={`relative h-full w-[min(84vw,20rem)] overflow-y-auto border-r border-slate-800 shadow-2xl ${
              isDarkSurface ? "bg-black" : "bg-slate-950"
            }`}
          >
            <div className="absolute right-3 top-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="h-9 w-9 px-0 text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <X size={18} />
              </Button>
            </div>
            <SidebarContent
              user={user}
              logout={handleLogout}
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      )}

      <main className="relative min-w-0 overflow-x-clip lg:pl-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
