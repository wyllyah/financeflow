import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({ title, description, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:py-6">
      <section className="mx-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-cyan-400/20 bg-[#07172a]/95 p-4 text-slate-100 shadow-[0_0_60px_rgba(34,211,238,0.12)] sm:max-h-[92vh] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {description}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar modal"
            className="h-9 w-9 px-0"
          >
            <X size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
