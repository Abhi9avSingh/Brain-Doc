import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  dark?: boolean;
}

export function Logo({ className, showText = true, dark = false }: LogoProps) {
  return (
    <div className={cn('brain-logo flex items-center gap-2.5', dark && 'brain-logo-dark', className)}>
      <div className="brain-logo-mark relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
          <path
            d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <path
            d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-400 animate-pulse-soft" />
      </div>
      {showText && (
        <span className={cn('brain-logo-word font-display text-xl font-bold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
          Brain<span className="gradient-text">Doc</span>
        </span>
      )}
    </div>
  );
}
