import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import type { Page } from '@/types';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Search,
  Settings,
  Plug,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { page: 'documents', label: 'Documents', icon: <FileText className="h-[18px] w-[18px]" /> },
  { page: 'chat', label: 'AI Chat', icon: <MessageSquare className="h-[18px] w-[18px]" /> },
  { page: 'search', label: 'Search', icon: <Search className="h-[18px] w-[18px]" /> },
  { page: 'integrations', label: 'Integrations', icon: <Plug className="h-[18px] w-[18px]" /> },
  { page: 'settings', label: 'Settings', icon: <Settings className="h-[18px] w-[18px]" /> },
];

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden animate-fade-in"
          style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'workspace-sidebar fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r transition-all duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="workspace-sidebar-brand flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <button onClick={() => onNavigate('landing')} className="transition-transform hover:scale-105" aria-label="Go to BrainDoc home">
            <Logo />
          </button>
          <button onClick={onCloseMobile} className="btn-ghost !p-1.5 lg:hidden" aria-label="Close navigation">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="workspace-sidebar-nav flex-1 space-y-1 overflow-y-auto p-3" aria-label="Workspace navigation">
          <div className="mb-2 px-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-tertiary-c">Workspace</span>
          </div>
          {navItems.map((item, i) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={cn(
                'nav-link w-full stagger-in',
                current === item.page && 'nav-link-active',
              )}
              style={{ animationDelay: `${i * 0.04}s` }}
              aria-current={current === item.page ? 'page' : undefined}
            >
              <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
              {item.label}
              {current === item.page && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
              )}
            </button>
          ))}
        </nav>

        <div className="workspace-upgrade border-t p-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(135deg, var(--aurora-1), var(--aurora-2))',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-semibold text-primary-c">Upgrade to Pro</span>
            </div>
            <p className="mb-3 text-xs text-secondary-c">
              Unlock unlimited documents, advanced AI models, and team collaboration.
            </p>
            <button className="w-full rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-700 hover:scale-[1.02]">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="workspace-user-card flex items-center gap-3 border-t px-4 py-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-sm font-semibold text-white transition-transform hover:scale-110">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary-c">Alex Morgan</p>
            <p className="truncate text-xs text-secondary-c">alex.morgan@example.com</p>
          </div>
        </div>
      </aside>
    </>
  );
}
