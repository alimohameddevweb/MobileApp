export interface Contact {
  id: string;
  name: string;
  phone: string;
  address: string;
  favorite: boolean;
  createdAt: number;
  hue: number;
}

export interface ContactDraft {
  name: string;
  phone: string;
  address: string;
}

export const AVATAR_STYLES: { bg: string; fg: string }[] = [
  { bg: "#ffc838", fg: "#1c2a23" },
  { bg: "#e4572e", fg: "#fff6ec" },
  { bg: "#2f7fa3", fg: "#eef7fb" },
  { bg: "#7fb069", fg: "#1c2a23" },
  { bg: "#d9822b", fg: "#1c2a23" },
  { bg: "#35725f", fg: "#eaf4ee" },
];

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Minuscule + sans accents, pour la recherche et les groupes. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function digitsOnly(s: string): string {
  return s.replace(/\D+/g, "");
}

/** 0612345678 -> 06 12 34 56 78 (sinon, tel quel). */
export function formatPhone(raw: string): string {
  const d = digitsOnly(raw);
  const isFrench = (d.length === 10 && d.startsWith("0")) || (d.length === 11 && d.startsWith("33"));
  if (!isFrench) return raw.trim();
  const digits = d.length === 11 ? "0" + d.slice(2) : d;
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + second).toUpperCase();
}

export function hashHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % AVATAR_STYLES.length;
}

export function groupLetter(name: string): string {
  const n = normalize(name);
  const c = n.charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
}

export function sortContacts(list: Contact[]): Contact[] {
  return [...list].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base", numeric: true })
  );
}

export function addedOn(ts: number): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(ts);
}

const DAY = 86_400_000;
const now = Date.now();

export const SAMPLE_CONTACTS: Contact[] = [
  { id: uid(), name: "Amélie Rousseau", phone: "06 12 45 78 90", address: "14 rue des Lilas, 69003 Lyon", favorite: true, createdAt: now - 42 * DAY, hue: 0 },
  { id: uid(), name: "Karim Benali", phone: "07 81 23 44 19", address: "8 avenue Jean Jaurès, 13001 Marseille", favorite: false, createdAt: now - 35 * DAY, hue: 1 },
  { id: uid(), name: "Lucie Morel", phone: "06 55 02 31 87", address: "3 place du Marché, 44000 Nantes", favorite: false, createdAt: now - 21 * DAY, hue: 2 },
  { id: uid(), name: "Théo Lambert", phone: "07 12 98 45 63", address: "27 rue Nationale, 59000 Lille", favorite: false, createdAt: now - 13 * DAY, hue: 3 },
  { id: uid(), name: "Inès Da Costa", phone: "06 74 58 12 30", address: "5 quai de la Daurade, 31000 Toulouse", favorite: true, createdAt: now - 6 * DAY, hue: 4 },
  { id: uid(), name: "Mamadou Diallo", phone: "07 45 61 20 08", address: "19 rue Sainte-Catherine, 33000 Bordeaux", favorite: false, createdAt: now - 2 * DAY, hue: 5 },
];
