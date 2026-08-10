type IconProps = { size?: number; className?: string };

export function WhatsappIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20.5 5.2 16.4A8 8 0 1 1 8.4 19.6Z" />
      <path d="M9.2 9.8c0 2.9 2.6 5.5 5.4 5.5.6 0 1-.5.9-1.1l-.2-1a.8.8 0 0 0-.7-.6l-1.4-.2a.8.8 0 0 0-.7.3l-.3.4a5 5 0 0 1-2.1-2.1l.4-.3a.8.8 0 0 0 .3-.7l-.2-1.4a.8.8 0 0 0-.6-.7l-1-.2c-.6-.1-1.1.3-1.1.9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
