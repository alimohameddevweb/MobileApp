import { AVATAR_STYLES, addedOn, digitsOnly, formatPhone, initials, type Contact } from "../lib";
import { CopyIcon, PencilIcon, PhoneIcon, PinIcon, StarIcon, TrashIcon } from "../icons";

export function ContactCard({
  contact,
  index,
  onEdit,
  onDelete,
  onToggleFav,
  onCopy,
}: {
  contact: Contact;
  index: number;
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  onToggleFav: (c: Contact) => void;
  onCopy: (c: Contact) => void;
}) {
  const style = AVATAR_STYLES[contact.hue % AVATAR_STYLES.length];
  const telHref = `tel:${digitsOnly(contact.phone) || contact.phone}`;

  return (
    <article
      className="anim-rise group rounded-xl border border-ink/10 bg-card p-3.5 shadow-[0_1px_0_rgba(28,42,35,0.05),0_14px_28px_-18px_rgba(7,27,19,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_2px_0_rgba(28,42,35,0.05),0_22px_36px_-18px_rgba(7,27,19,0.6)]"
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      <div className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full font-display text-[15px] font-extrabold ring-2 ring-ink/5"
          style={{ background: style.bg, color: style.fg }}
        >
          {initials(contact.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[16px] font-bold leading-tight text-ink">
            {contact.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/35">
            Fiche du {addedOn(contact.createdAt)}
          </p>
        </div>
        <button
          onClick={() => onToggleFav(contact)}
          aria-label={contact.favorite ? `Retirer ${contact.name} des favoris` : `Ajouter ${contact.name} aux favoris`}
          aria-pressed={contact.favorite}
          className={`grid size-9 shrink-0 place-items-center rounded-lg transition-all duration-200 active:scale-75 ${
            contact.favorite
              ? "text-butter drop-shadow-[0_1px_0_rgba(168,127,18,0.5)]"
              : "text-ink/25 hover:bg-butter/15 hover:text-butter"
          }`}
        >
          <StarIcon filled={contact.favorite} className="size-5" />
        </button>
      </div>

      <div className="mt-3 space-y-1.5 pl-1">
        <a
          href={telHref}
          className="group/tel flex items-center gap-2 text-[14.5px] font-semibold tabular-nums text-ink/85 transition hover:text-lagoon"
        >
          <PhoneIcon className="size-4 shrink-0 text-ink/35 transition group-hover/tel:text-lagoon" />
          <span className="truncate">{formatPhone(contact.phone)}</span>
        </a>
        {contact.address ? (
          <p className="flex items-start gap-2 text-[13px] leading-snug text-ink/55">
            <PinIcon className="mt-0.5 size-4 shrink-0 text-ink/35" />
            <span>{contact.address}</span>
          </p>
        ) : (
          <p className="flex items-start gap-2 text-[13px] italic text-ink/30">
            <PinIcon className="mt-0.5 size-4 shrink-0 text-ink/20" />
            <span>Aucune adresse enregistrée</span>
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 border-t border-dashed border-ink/10 pt-2.5">
        <a
          href={telHref}
          title="Appeler"
          aria-label={`Appeler ${contact.name}`}
          className="grid size-9 place-items-center rounded-lg text-lagoon transition hover:bg-lagoon/10 active:scale-90"
        >
          <PhoneIcon className="size-[17px]" />
        </a>
        <button
          onClick={() => onCopy(contact)}
          title="Copier le numéro"
          aria-label={`Copier le numéro de ${contact.name}`}
          className="grid size-9 place-items-center rounded-lg text-ink/45 transition hover:bg-ink/5 hover:text-ink active:scale-90"
        >
          <CopyIcon className="size-[17px]" />
        </button>
        <button
          onClick={() => onEdit(contact)}
          title="Modifier la fiche"
          aria-label={`Modifier ${contact.name}`}
          className="grid size-9 place-items-center rounded-lg text-ink/45 transition hover:bg-butter/25 hover:text-butter-deep active:scale-90"
        >
          <PencilIcon className="size-[17px]" />
        </button>
        <button
          onClick={() => onDelete(contact)}
          title="Supprimer la fiche"
          aria-label={`Supprimer ${contact.name}`}
          className="grid size-9 place-items-center rounded-lg text-ink/45 transition hover:bg-coral/10 hover:text-coral active:scale-90"
        >
          <TrashIcon className="size-[17px]" />
        </button>
      </div>
    </article>
  );
}
