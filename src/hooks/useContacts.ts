import { useCallback, useEffect, useState } from "react";
import { AVATAR_STYLES, SAMPLE_CONTACTS, hashHue, uid, type Contact, type ContactDraft } from "../lib";

const KEY = "repertoire:contacts:v1";

function load(): Contact[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is Contact =>
        c && typeof c.id === "string" && typeof c.name === "string" && typeof c.phone === "string"
    );
  } catch {
    return [];
  }
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(load);
  const [hasSeeded, setHasSeeded] = useState(() => localStorage.getItem(KEY) !== null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(contacts));
      setHasSeeded(true);
    } catch {
      /* stockage plein ou indisponible : on continue en mémoire */
    }
  }, [contacts]);

  const add = useCallback((draft: ContactDraft): Contact => {
    const contact: Contact = {
      id: uid(),
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      favorite: false,
      createdAt: Date.now(),
      hue: hashHue(draft.name.trim()),
    };
    setContacts((prev) => [...prev, contact]);
    return contact;
  }, []);

  const update = useCallback((id: string, draft: ContactDraft) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: draft.name.trim(),
              phone: draft.phone.trim(),
              address: draft.address.trim(),
              hue: hashHue(draft.name.trim()),
            }
          : c
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const restore = useCallback((contact: Contact) => {
    setContacts((prev) => (prev.some((c) => c.id === contact.id) ? prev : [...prev, contact]));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));
  }, []);

  const loadSamples = useCallback(() => {
    const stamped = SAMPLE_CONTACTS.map((c, i) => ({
      ...c,
      id: uid(),
      hue: i % AVATAR_STYLES.length,
    }));
    setContacts((prev) => [...prev, ...stamped]);
  }, []);

  return { contacts, hasSeeded, add, update, remove, restore, toggleFavorite, loadSamples };
}
