type IconProps = { className?: string };

const base = "h-6 w-6";

export function CreateIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" strokeDasharray="3 3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlaceIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ConnectIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.8 15.4 16.2 8.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CustomizeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6h10M4 12h16M4 18h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ExploreIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m16.2 16.2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m13 9-4 2 4-2-2 4 2-4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function SpaceIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="11" cy="12" rx="8" ry="3.2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="15" cy="8.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function TimeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8v8M12 6v12M17 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function ConnectionsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="5" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8.2C10 11 13 13 17 15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
