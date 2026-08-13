import { useState } from 'react';
import { mockIntegrations } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  HardDrive,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Globe,
  Check,
  Plus,
  Loader2,
  X,
  Zap,
  Shield,
  Plug,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Drive: <HardDrive className="h-6 w-6" />,
  Mail: <Mail className="h-6 w-6" />,
  Calendar: <Calendar className="h-6 w-6" />,
  MessageSquare: <MessageSquare className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
};

const categoryColors: Record<string, string> = {
  Storage: 'bg-blue-50 text-blue-600',
  Communication: 'bg-accent-50 text-accent-600',
  Productivity: 'bg-brand-50 text-brand-600',
  Search: 'bg-purple-50 text-purple-600',
};

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (integration?.connected) {
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false } : i)));
    } else {
      setConnecting(id);
      setTimeout(() => {
        setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: true } : i)));
        setConnecting(null);
      }, 1500);
    }
  };

  const connectedCount = integrations.filter((i) => i.connected).length;
  const categories = ['All', 'Storage', 'Communication', 'Productivity', 'Search'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? integrations
    : integrations.filter((i) => i.category === activeCategory);

  return (
    <div className="workspace-page-stack workspace-integrations space-y-6">
      {/* Stats banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Plug className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink-900">{connectedCount}</div>
              <div className="text-sm text-ink-500">Connected</div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink-900">{integrations.length}</div>
              <div className="text-sm text-ink-500">Available</div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink-900">Secure</div>
              <div className="text-sm text-ink-500">OAuth 2.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              activeCategory === cat
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integrations grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration, i) => (
          <div
            key={integration.id}
            className="card card-hover p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', categoryColors[integration.category])}>
                {iconMap[integration.icon] ?? <Plug className="h-6 w-6" />}
              </div>
              {integration.connected ? (
                <span className="badge bg-success-50 text-success-600">
                  <Check className="h-3 w-3" />
                  Connected
                </span>
              ) : (
                <span className="badge bg-ink-100 text-ink-500">Available</span>
              )}
            </div>
            <h3 className="mt-3 font-semibold text-ink-900">{integration.name}</h3>
            <p className="mt-1 text-sm text-ink-500">{integration.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-ink-50 pt-3">
              <span className="text-xs text-ink-400">{integration.category}</span>
              <button
                onClick={() => handleToggle(integration.id)}
                disabled={connecting === integration.id}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  integration.connected
                    ? 'text-error-500 hover:bg-error-50'
                    : 'bg-brand-600 text-white hover:bg-brand-700',
                )}
              >
                {connecting === integration.id ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Connecting...
                  </span>
                ) : integration.connected ? (
                  <span className="flex items-center gap-1.5">
                    <X className="h-3 w-3" />
                    Disconnect
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-3 w-3" />
                    Connect
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-ink-900">Coming Soon</h3>
        <p className="mt-1 text-sm text-ink-500">More integrations are being developed</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['Dropbox', 'OneDrive', 'GitHub', 'Jira'].map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-xl border border-dashed border-ink-200 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-400">
                <Plug className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-600">{name}</p>
                <p className="text-xs text-ink-400">In development</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
