import { useEffect, useState } from "react";
import { BatteryIcon, DoodleBook, SearchIcon, SignalIcon, StarIcon, UndoIcon, WifiIcon, XIcon } from "../icons";

/* ---------- Barre d'état façon iOS ---------- */
export function StatusBar() {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date())
  );
  useEffect(() => {
    const t = setInterval(
      () =>
        setTime(new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date())),
      15_000
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative z-20 flex items-center justify-between px-6 pt-3 text-[12px] font-semibold text-card">
      <span className="tabular-nums tracking-wide">{time}</span>
      <span className="flex items-center gap-1.5">
        <SignalIcon className="size-3.5" />
        <WifiIcon className="size-3.5" />
        <BatteryIcon className="size-4.5" />
      </span>
    </div>
  );
}

/* ---------- Toast ---------- */
export interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  return (
    <div className="anim-toast pointer-events-auto absolute inset-x-4 bottom-24 z-50">
      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink px-4 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)]">
        <UndoIcon className="size-4 shrink-0 text-butter" />
        <p className="flex-1 text-[13.5px] font-medium leading-snug text-paper">{toast.message}</p>
        {toast.actionLabel && (
          <button
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
            className="rounded-md px-2 py-1 text-[12px] font-bold uppercase tracking-wider text-butter transition hover:bg-butter hover:text-ink active:scale-95"
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          onClick={onDismiss}
          aria-label="Fermer la notification"
          className="grid size-7 shrink-0 place-items-center rounded-md text-paper/50 transition hover:bg-white/10 hover:text-paper active:scale-90"
        >
          <XIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- États vides ---------- */
export function EmptyState({
  variant,
  query,
  onAdd,
  onSamples,
  onClear,
  showSamples,
}: {
  variant: "empty" | "favorites" | "search";
  query?: string;
  onAdd: () => void;
  onSamples: () => void;
  onClear: () => void;
  showSamples: boolean;
}) {
  if (variant === "search") {
    return (
      <div className="anim-rise mx-auto mt-10 max-w-[260px] text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-dashed border-pine-200/30 text-pine-200/60">
          <SearchIcon className="size-6" />
        </div>
        <p className="mt-4 font-display text-lg font-bold text-card">
          Aucun résultat{query ? <> pour «&nbsp;{query}&nbsp;»</> : null}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-pine-200/70">
          Vérifiez l'orthographe, ou cherchez par numéro ou par ville.
        </p>
        <button
          onClick={onClear}
          className="mt-4 rounded-lg border border-pine-200/25 px-4 py-2 text-[13px] font-semibold text-pine-200 transition hover:border-butter hover:text-butter active:scale-95"
        >
          Effacer la recherche
        </button>
      </div>
    );
  }

  if (variant === "favorites") {
    return (
      <div className="anim-rise mx-auto mt-10 max-w-[250px] text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-dashed border-pine-200/30 text-butter/70">
          <StarIcon className="size-6" />
        </div>
        <p className="mt-4 font-display text-lg font-bold text-card">Aucun favori pour l'instant</p>
        <p className="mt-1 text-[13px] leading-relaxed text-pine-200/70">
          Touchez l'étoile d'une fiche pour garder vos proches sous la main.
        </p>
      </div>
    );
  }

  return (
    <div className="anim-rise mx-auto mt-8 w-full max-w-[300px] rounded-2xl border-2 border-dashed border-pine-200/25 bg-pine-800/40 px-6 py-8 text-center">
      <DoodleBook className="mx-auto w-28" />
      <h2 className="mt-5 font-display text-xl font-extrabold text-card">Votre carnet est vide</h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-pine-200/75">
        Enregistrez vos proches en toute confidentialité&nbsp;: nom, téléphone, adresse. Tout reste sur cet
        appareil.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 w-full rounded-xl bg-butter px-4 py-3 text-[14px] font-bold text-ink shadow-[0_4px_0_var(--color-butter-deep)] transition hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-butter-deep)]"
      >
        Ajouter mon premier contact
      </button>
      {showSamples && (
        <button
          onClick={onSamples}
          className="mt-2.5 w-full rounded-xl border border-pine-200/25 px-4 py-2.5 text-[13px] font-semibold text-pine-200 transition hover:border-butter/60 hover:text-butter active:scale-[0.98]"
        >
          Parcourir avec 6 exemples
        </button>
      )}
    </div>
  );
}

/* ---------- Index alphabétique ---------- */
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

export function LetterRail({
  available,
  onJump,
}: {
  available: Set<string>;
  onJump: (letter: string) => void;
}) {
  return (
    <nav aria-label="Index alphabétique" className="absolute right-0.5 top-1/2 z-20 -translate-y-1/2">
      <ul className="flex flex-col items-center gap-[1px] py-1">
        {LETTERS.map((l) => {
          const on = available.has(l);
          return (
            <li key={l}>
              <button
                onClick={() => on && onJump(l)}
                tabIndex={on ? 0 : -1}
                aria-label={`Aller à la lettre ${l}`}
                className={`grid h-[13px] w-5 place-items-center font-display text-[9.5px] font-bold leading-none transition-all duration-150 ${
                  on
                    ? "text-pine-200/80 hover:scale-150 hover:text-butter active:scale-125"
                    : "cursor-default text-pine-200/20"
                }`}
              >
                {l}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
