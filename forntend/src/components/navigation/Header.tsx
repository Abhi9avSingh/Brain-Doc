import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Bell, Upload, Moon, Sun, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import type { Page } from '@/types';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenSidebar: () => void;
  onNavigate: (page: Page) => void;
  onUpload?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({
  title,
  subtitle,
  onOpenSidebar,
  onNavigate,
  onUpload,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notificationsOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
      if (event instanceof MouseEvent && notificationsRef.current?.contains(event.target as Node)) return;
      setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [notificationsOpen]);

  return (
    <header className="workspace-header sticky top-0 z-20 glass border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="workspace-header-inner flex items-center gap-3 px-4 py-3 md:px-6">
        <button onClick={onOpenSidebar} className="btn-ghost !p-2 lg:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold text-primary-c md:text-xl">{title}</h1>
          {subtitle && <p className="truncate text-xs text-secondary-c md:text-sm">{subtitle}</p>}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary-c" />
            <input
              type="text"
              value={searchValue ?? ''}
              onChange={(e) => {
                onSearchChange?.(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('search')}
              placeholder="Search knowledge base..."
              aria-label="Search knowledge base"
              className="input-field w-56 pl-9 pr-3 transition-all focus:w-72"
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="btn-ghost !p-2 transition-transform hover:scale-110"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {onUpload && (
          <button onClick={onUpload} className="btn-primary hidden md:inline-flex">
            <Upload className="h-4 w-4" />
            Upload
          </button>
        )}

        <div className="relative" ref={notificationsRef}>
          <button
            className="relative btn-ghost !p-2 transition-transform hover:scale-110"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label={unread ? `Open notifications, ${unread} unread` : 'Open notifications'}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" style={{ ['--tw-ring-color' as string]: 'var(--bg-surface)' }} />}
          </button>
          {notificationsOpen && (
            <div className="workspace-notifications absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-default-c surface shadow-xl animate-scale-in" role="dialog" aria-label="Notifications">
              <div className="flex items-center justify-between border-b border-default-c px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-primary-c">Notifications</p>
                  <p className="text-xs text-secondary-c">{unread ? `${unread} new updates` : 'All caught up'}</p>
                </div>
                <button className="text-xs font-medium text-brand-600" onClick={() => setUnread(0)}>Mark read</button>
              </div>
              <div className="space-y-1 p-2">
                <button className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-ink-50" onClick={() => setUnread(Math.max(0, unread - 1))}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success-50 text-success-600"><CheckCircle2 className="h-4 w-4" /></span>
                  <span><strong className="block text-sm text-primary-c">Document indexed</strong><small className="text-xs text-secondary-c">Board Review is ready to ask about.</small></span>
                </button>
                <button className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-ink-50" onClick={() => setUnread(Math.max(0, unread - 1))}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Sparkles className="h-4 w-4" /></span>
                  <span><strong className="block text-sm text-primary-c">New connection found</strong><small className="text-xs text-secondary-c">3 documents mention retention.</small></span>
                </button>
                <button className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-ink-50" onClick={() => setUnread(Math.max(0, unread - 1))}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><FileText className="h-4 w-4" /></span>
                  <span><strong className="block text-sm text-primary-c">Summary generated</strong><small className="text-xs text-secondary-c">Q3 report summary is available.</small></span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-sm font-semibold text-white transition-transform hover:scale-110">
          AM
        </div>
      </div>
    </header>
  );
}
