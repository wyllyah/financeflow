import { Card } from "./Card";

export function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <Card className="border-cyan-400/20">
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}
