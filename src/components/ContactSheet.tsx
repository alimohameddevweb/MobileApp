import { useEffect, useState } from "react";
import { digitsOnly, type Contact, type ContactDraft } from "../lib";
import { CheckIcon, PhoneIcon, PinIcon, WarnIcon, XIcon } from "../icons";

interface Props {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (draft: ContactDraft) => void;
}

interface Errors {
  name?: string;
  phone?: string;
}

export function ContactSheet({ open, contact, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (open) {
      setName(contact?.name ?? "");
      setPhone(contact?.phone ?? "");
      setAddress(contact?.address ?? "");
      setErrors({});
    }
  }, [open, contact]);

  if (!open) return null;

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Entrez un nom (2 caractères minimum).";
    const d = digitsOnly(phone);
    if (d.length < 8 || d.length > 15) e.phone = "Numéro invalide — entre 8 et 15 chiffres.";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ name, phone, address });
  };

  const inputClass = (err?: string) =>
    `w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-[15px] font-medium text-ink outline-none transition placeholder:text-ink/30 focus:ring-4 ${
      err
        ? "border-coral focus:ring-coral/15"
        : "border-ink/12 focus:border-butter focus:ring-butter/25"
    }`;

  return (
    <div className="absolute inset-0 z-40" role="dialog" aria-modal="true" aria-label={contact ? "Modifier le contact" : "Nouveau contact"}>
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="anim-fade absolute inset-0 w-full cursor-default bg-pine-950/65"
      />
      <div className="anim-sheet absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[1.7rem] border-t-4 border-butter bg-paper px-5 pb-8 pt-3 shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.55)]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/15" aria-hidden />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-ink/40">
              {contact ? "Modifier la fiche" : "Nouvelle fiche"}
            </p>
            <h2 className="mt-0.5 font-display text-[24px] font-extrabold leading-none text-ink">
              {contact ? contact.name : "Nouveau contact"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le formulaire"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink/45 transition hover:bg-ink/5 hover:text-ink active:scale-90"
          >
            <XIcon className="size-4.5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <div>
            <label htmlFor="f-name" className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wider text-ink/55">
              Nom complet <span className="text-coral">*</span>
            </label>
            <input
              id="f-name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Ex. Camille Dupont"
              className={inputClass(errors.name)}
            />
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-coral">
                <WarnIcon className="size-3.5 shrink-0" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-phone" className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wider text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <PhoneIcon className="size-3.5" /> Téléphone <span className="text-coral">*</span>
              </span>
            </label>
            <input
              id="f-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
              }}
              placeholder="Ex. 06 12 34 56 78"
              className={`${inputClass(errors.phone)} tabular-nums`}
            />
            {errors.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-coral">
                <WarnIcon className="size-3.5 shrink-0" /> {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-address" className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wider text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <PinIcon className="size-3.5" /> Adresse
              </span>
            </label>
            <input
              id="f-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="N°, rue, code postal, ville"
              className={inputClass()}
            />
            <p className="mt-1.5 text-[12px] text-ink/35">Facultatif — laissez vide si vous préférez.</p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-ink/12 px-4 py-3 text-[14px] font-bold text-ink/60 transition hover:border-ink/30 hover:text-ink active:scale-[0.98]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex flex-[1.6] items-center justify-center gap-2 rounded-xl bg-butter px-4 py-3 text-[14px] font-bold text-ink shadow-[0_4px_0_var(--color-butter-deep)] transition hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-butter-deep)]"
            >
              <CheckIcon className="size-4.5" strokeWidth={2.6} />
              {contact ? "Enregistrer" : "Ajouter au carnet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
