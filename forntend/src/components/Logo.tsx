import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  dark?: boolean;
}

export function Logo({ className, showText = true, dark = false }: LogoProps) {
  return (
    <div className={cn('brain-logo flex items-center gap-2.5', dark && 'brain-logo-dark', className)}>
      <div className="brain-logo-mark relative flex h-9 w-9 items-center justify-center  ">
        <div>
        <img src="\app-icon-1024 (1).png" alt="Dev app icon"></img>
        </div>
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full  " />
      </div>
      {showText && (
        <span className={cn('brain-logo-word font-display text-xl font-bold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
          Brain<span className="gradient-text">Doc</span>
        </span>
      )}
    </div>
  );
}
