import { useEffect, useMemo, useRef, useState } from "react";
import { useContacts } from "./hooks/useContacts";
import { ContactCard } from "./components/ContactCard";
import { ContactSheet } from "./components/ContactSheet";
import { EmptyState, LetterRail, StatusBar, Toast, type ToastData } from "./components/bits";
import { AsteriskMark, LockIcon, PhoneIcon, PinIcon, PlusIcon, SearchIcon, XIcon } from "./icons";
import { digitsOnly, formatPhone, groupLetter, normalize, sortContacts, type Contact, type ContactDraft } from "./lib";

type Tab = "all" | "fav";

export default function App() {
  const { contacts, add, update, remove, restore, toggleFavorite, loadSamples } = useContacts();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [sheet, setSheet] = useState<{ open: boolean; contact: Contact | null }>({ open: false, contact: null });
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const showToast = (message: string, opts?: Partial<Omit<ToastData, "id" | "message">>) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, ...opts });
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  };

  /* ----- données dérivées ----- */
  const sorted = useMemo(() => sortContacts(contacts), [contacts]);
  const favCount = useMemo(() => contacts.filter((c) => c.favorite).length, [contacts]);

  const visible = useMemo(() => {
    const nq = normalize(query);
    const dq = digitsOnly(query);
    return sorted.filter((c) => {
      if (tab === "fav" && !c.favorite) return false;
      if (!nq && !dq) return true;
      return (
        normalize(c.name).includes(nq) ||
        normalize(c.address).includes(nq) ||
        (dq.length > 0 && digitsOnly(c.phone).includes(dq))
      );
    });
  }, [sorted, query, tab]);

  const groups = useMemo(() => {
    const m = new Map<string, Contact[]>();
    for (const c of visible) {
      const l = groupLetter(c.name);
      const arr = m.get(l);
      if (arr) arr.push(c);
      else m.set(l, [c]);
    }
    return m;
  }, [visible]);

  const letters = useMemo(() => new Set(groups.keys()), [groups]);

  /* ----- actions ----- */
  const openAdd = () => setSheet({ open: true, contact: null });
  const openEdit = (c: Contact) => setSheet({ open: true, contact: c });

  const handleSave = (draft: ContactDraft) => {
    if (sheet.contact) {
      update(sheet.contact.id, draft);
      showToast(`Modifications enregistrées pour « ${draft.name.trim()} ».`);
    } else {
      add(draft);
      showToast(`« ${draft.name.trim()} » a rejoint votre carnet.`);
    }
    setSheet({ open: false, contact: null });
  };

  const handleDelete = (c: Contact) => {
    remove(c.id);
    showToast(`« ${c.name} » supprimé du carnet.`, { actionLabel: "Annuler", onAction: () => restore(c) });
  };

  const handleCopy = async (c: Contact) => {
    const value = formatPhone(c.phone);
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Numéro de ${c.name} copié — prêt à coller.`);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast(`Numéro de ${c.name} copié — prêt à coller.`);
      } catch {
        showToast("Copie impossible sur ce navigateur.");
      }
    }
  };

  const handleJump = (letter: string) => {
    const el = document.getElementById(`grp-${letter}`);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  let cardIndex = 0;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-pine-950 font-body">
      {/* ===== fond ambiant (visible autour du téléphone) ===== */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 halftone opacity-60" />
        <div className="absolute -top-44 left-1/4 size-[540px] rounded-full bg-pine-700/45 blur-[130px]" />
        <div className="absolute -bottom-32 -right-20 size-[420px] rounded-full bg-lagoon/15 blur-[120px]" />
        <div className="absolute bottom-1/4 left-[-80px] size-[360px] rounded-full bg-butter/8 blur-[110px]" />
        <span className="absolute -right-24 -top-52 hidden select-none font-display text-[30rem] font-extrabold leading-none text-pine-800/55 lg:block">
          R
        </span>
        <AsteriskMark className="anim-float absolute bottom-24 left-12 hidden size-14 text-pine-700 lg:block" strokeWidth={2.4} />
        <span className="anim-float absolute right-16 top-32 hidden lg:block" style={{ animationDelay: "1.4s" }}>
          <span className="grid size-14 place-items-center rounded-full border-2 border-dashed border-pine-700 text-pine-200/50">
            <PinIcon className="size-6" />
          </span>
        </span>
        <span className="anim-float absolute right-28 bottom-40 hidden lg:block" style={{ animationDelay: "0.7s" }}>
          <span className="grid size-11 place-items-center rounded-full border-2 border-dashed border-pine-700 text-pine-200/40">
            <PhoneIcon className="size-5" />
          </span>
        </span>
      </div>

      {/* légendes latérales (grand écran) */}
      <div className="pointer-events-none absolute left-9 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex" aria-hidden>
        <span className="h-16 w-px bg-pine-700" />
        <span
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-pine-700"
          style={{ writingMode: "vertical-rl" }}
        >
          Annuaire personnel — éd. 2026
        </span>
        <span className="h-16 w-px bg-pine-700" />
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden text-center text-[12px] text-pine-200/40 md:block">
        Vos contacts restent enregistrés sur cet appareil — aucune donnée n'est envoyée en ligne.
      </p>
      <div className="pointer-events-none absolute left-9 top-7 z-10 hidden items-center gap-2.5 md:flex" aria-hidden>
        <span className="grid size-9 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink shadow-[0_4px_0_var(--color-butter-deep)]">
          R
        </span>
        <span>
          <span className="block font-display text-[15px] font-bold leading-tight text-card">Répertoire</span>
          <span className="block text-[11px] text-pine-200/55">carnet de contacts privé</span>
        </span>
      </div>

      {/* ===== le téléphone ===== */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center">
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-pine-900 md:h-[min(860px,94vh)] md:w-[402px] md:rounded-[2.7rem] md:border-[6px] md:border-pine-800 md:shadow-[0_60px_110px_-28px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.05)]">
          <StatusBar />

          {/* en-tête annuaire */}
          <header className="noise relative shrink-0 overflow-hidden bg-pine-800 pb-9">
            <div className="halftone absolute inset-0" aria-hidden />
            <AsteriskMark className="absolute -right-3 top-5 size-16 rotate-12 text-butter/15" strokeWidth={2.6} aria-hidden />
            <div className="relative px-5 pt-3.5">
              <div className="flex items-center justify-between">
                <span className="anim-stamp inline-flex items-center gap-1.5 rounded border border-butter/45 px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.24em] text-butter">
                  <LockIcon className="size-3" /> Carnet privé
                </span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-pine-200/50">
                  A → Z
                </span>
              </div>
              <h1 className="mt-3 font-display text-[36px] font-extrabold leading-none tracking-tight text-card">
                Répertoire<span className="text-butter">.</span>
              </h1>
              <p className="mt-1.5 text-[13px] font-medium text-pine-200/80">
                {contacts.length === 0 ? (
                  "Prêt à accueillir vos proches."
                ) : (
                  <>
                    <strong className="font-bold text-card">{contacts.length}</strong>{" "}
                    {contacts.length > 1 ? "contacts" : "contact"}
                    {favCount > 0 && (
                      <>
                        {" · "}
                        <strong className="font-bold text-butter">{favCount}</strong>{" "}
                        {favCount > 1 ? "favoris" : "favori"}
                      </>
                    )}
                    {" — rien qu'à vous."}
                  </>
                )}
              </p>
            </div>
          </header>

          {/* recherche, en chevauchement */}
          <div className="relative z-30 -mt-5 shrink-0 px-4">
            <label className="flex h-[50px] items-center gap-2.5 rounded-xl border border-ink/10 bg-card px-3.5 shadow-[0_18px_36px_-16px_rgba(0,0,0,0.65)] transition focus-within:border-butter focus-within:ring-4 focus-within:ring-butter/25">
              <SearchIcon className="size-[18px] shrink-0 text-ink/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chercher un nom, un numéro, une ville…"
                aria-label="Rechercher un contact"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-ink/35"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Effacer la recherche"
                  className="grid size-7 shrink-0 place-items-center rounded-md text-ink/40 transition hover:bg-ink/5 hover:text-ink active:scale-90"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </label>
          </div>

          {/* onglets */}
          <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5">
            {(
              [
                { key: "all", label: "Tous", count: contacts.length },
                { key: "fav", label: "Favoris", count: favCount },
              ] as const
            ).map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  aria-pressed={active}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-butter text-ink shadow-[0_3px_0_var(--color-butter-deep)]"
                      : "border border-pine-200/20 text-pine-200/70 hover:border-pine-200/45 hover:text-card"
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 tabular-nums ${active ? "text-ink/55" : "text-pine-200/45"}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto hidden text-[11px] font-medium text-pine-200/40 min-[380px]:block">
              trié de A à Z
            </span>
          </div>

          {/* liste */}
          <main className="phone-scroll relative flex-1 overflow-y-auto px-4 pb-32 pr-6 pt-3">
            {visible.length === 0 ? (
              <EmptyState
                variant={contacts.length === 0 ? "empty" : tab === "fav" && !query.trim() ? "favorites" : "search"}
                query={query}
                onAdd={openAdd}
                onSamples={() => {
                  loadSamples();
                  showToast("6 contacts d'exemple ajoutés — à vous de jouer.");
                }}
                onClear={() => setQuery("")}
                showSamples
              />
            ) : (
              [...groups.entries()].map(([letter, list]) => (
                <section key={letter} id={`grp-${letter}`} className="scroll-mt-1">
                  <div className="sticky top-0 z-10 -ml-4 -mr-6 flex items-center gap-3 bg-pine-900/95 py-1.5 pl-4 pr-6 backdrop-blur-[2px]">
                    <span className="w-7 font-display text-[22px] font-extrabold leading-none text-butter">
                      {letter}
                    </span>
                    <span className="h-px flex-1 bg-pine-200/15" />
                    <span className="text-[11px] font-semibold text-pine-200/45">
                      {list.length} {list.length > 1 ? "fiches" : "fiche"}
                    </span>
                  </div>
                  <div className="space-y-3 pb-2 pt-1.5">
                    {list.map((c) => (
                      <ContactCard
                        key={c.id}
                        contact={c}
                        index={cardIndex++}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onToggleFav={(fc) => {
                          toggleFavorite(fc.id);
                          if (!fc.favorite) showToast(`${fc.name} ajouté aux favoris.`);
                        }}
                        onCopy={handleCopy}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>

          {/* index alphabétique */}
          {contacts.length > 0 && <LetterRail available={letters} onJump={handleJump} />}

          {/* bouton flottant */}
          <button
            onClick={openAdd}
            aria-label="Ajouter un contact"
            className="absolute bottom-7 right-5 z-30 grid size-14 place-items-center rounded-full bg-butter text-ink shadow-[0_14px_30px_-8px_rgba(255,200,56,0.55),0_4px_0_var(--color-butter-deep)] transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-90 active:translate-y-[2px] active:shadow-[0_8px_20px_-8px_rgba(255,200,56,0.5),0_1px_0_var(--color-butter-deep)]"
          >
            <span className="fab-pulse absolute inset-0 rounded-full" aria-hidden />
            <PlusIcon className="relative size-6" strokeWidth={2.6} />
          </button>

          {/* barre d'accueil */}
          <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-card/25" aria-hidden />

          <ContactSheet
            open={sheet.open}
            contact={sheet.contact}
            onClose={() => setSheet({ open: false, contact: null })}
            onSave={handleSave}
          />

          {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
        </div>
      </div>
    </div>
  );
}
