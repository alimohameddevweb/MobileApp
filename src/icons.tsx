import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function base(props: P): P {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 3.5h3l1.7 4.2-2.1 1.6a12.5 12.5 0 0 0 6.6 6.6l1.6-2.1 4.2 1.7v3a1.9 1.9 0 0 1-2.1 1.9A16.8 16.8 0 0 1 3.6 5.6a1.9 1.9 0 0 1 1.9-2.1Z" />
  </svg>
);

export const PinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.7" r="2.3" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3.6 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 6.9 19l1.1-5.6-4.2-3.9 5.7-.7L12 3.6Z" />
  </svg>
);

export const PencilIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20h4.2L19.5 8.7a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8V20Z" />
    <path d="m13.8 6 4.2 4.2" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5m3.5 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9l-.8-12" />
    <path d="M10 10.5v5.5M14 10.5v5.5" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5.5 14.5A1.5 1.5 0 0 1 4 13V5.5A1.5 1.5 0 0 1 5.5 4H13a1.5 1.5 0 0 1 1.5 1.5" />
  </svg>
);

export const UndoIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9h9.5a5.5 5.5 0 0 1 0 11H8" />
    <path d="m8 5-4 4 4 4" />
  </svg>
);

export const WarnIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4.2 2.8 19.5h18.4L12 4.2Z" />
    <path d="M12 10v4M12 16.8v.2" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/* --- barre d'état du téléphone --- */
export const SignalIcon = (p: P) => (
  <svg {...base({ strokeWidth: 0, fill: "currentColor", ...p })}>
    <rect x="1" y="13" width="3.4" height="5" rx="1" />
    <rect x="6.4" y="10" width="3.4" height="8" rx="1" />
    <rect x="11.8" y="7" width="3.4" height="11" rx="1" />
    <rect x="17.2" y="4" width="3.4" height="14" rx="1" opacity="0.35" />
  </svg>
);

export const WifiIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 9.5a13.5 13.5 0 0 1 18 0M6.2 13a9 9 0 0 1 11.6 0M9.4 16.4a4.5 4.5 0 0 1 5.2 0" />
    <path d="M12 19.5v.1" strokeWidth="2.6" />
  </svg>
);

export const BatteryIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2" y="7.5" width="17" height="9" rx="2.5" />
    <path d="M21.5 10.5v3" strokeWidth="2.4" />
    <rect x="4" y="9.5" width="10.5" height="5" rx="1.2" fill="currentColor" stroke="none" />
  </svg>
);

/* --- petits croquis décoratifs --- */
export const DoodleBook = (p: P) => (
  <svg viewBox="0 0 120 96" fill="none" aria-hidden {...p}>
    <rect x="18" y="10" width="84" height="72" rx="8" fill="#ffc838" />
    <rect x="18" y="10" width="84" height="72" rx="8" stroke="#1c2a23" strokeWidth="3" />
    <path d="M60 10v72" stroke="#1c2a23" strokeWidth="3" />
    <path d="M30 28h20M30 40h16M30 52h20M30 64h12" stroke="#1c2a23" strokeWidth="3" strokeLinecap="round" />
    <path
      d="m81 34 4 8 9 1.2-6.6 6.2 1.7 8.8L81 53.5l-8.1 4.7 1.7-8.8L68 43.2l9-1.2 4-8Z"
      fill="#e4572e"
      stroke="#1c2a23"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="24" r="3" fill="#e4572e" />
    <circle cx="110" cy="70" r="4" fill="#2f7fa3" />
    <circle cx="104" cy="18" r="2.5" fill="#7fb069" />
  </svg>
);

export const AsteriskMark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
  </svg>
);
