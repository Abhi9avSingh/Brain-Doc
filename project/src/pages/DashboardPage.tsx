import type { Page } from '@/types';
import type { BrainDoc } from '@/types';
import { mockConversations, mockActivity } from '@/lib/mockData';
import { formatRelativeTime, formatBytes } from '@/lib/utils';
import { StatusBadge, FileTypeIcon } from '@/components/ui/Badges';
import { NeuralScene } from '@/components/experience/NeuralScene';
import {
  FileText,
  MessageSquare,
  Search,
  Upload,
  Brain,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';

interface DashboardPageProps {
  documents: BrainDoc[];
  onNavigate: (page: Page) => void;
  onUpload: () => void;
}

export function DashboardPage({ documents, onNavigate, onUpload }: DashboardPageProps) {
  const indexedCount = documents.filter((d) => d.status === 'indexed').length;
  const processingCount = documents.filter((d) => d.status === 'processing' || d.status === 'uploading').length;
  const totalSize = documents.reduce((sum, d) => sum + d.size, 0);
  const recentDocs = documents.slice(0, 4);
  const recentConversations = mockConversations.filter((c) => c.messages.length > 0).slice(0, 3);

  const stats = [
    {
      label: 'Total Documents',
      value: documents.length,
      sub: `${indexedCount} indexed, ${processingCount} processing`,
      icon: <FileText className="h-5 w-5" />,
      color: 'brand',
      onClick: () => onNavigate('documents'),
    },
    {
      label: 'Conversations',
      value: mockConversations.length,
      sub: '12 this month',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'accent',
      onClick: () => onNavigate('chat'),
    },
    {
      label: 'Searches',
      value: 47,
      sub: '8 this week',
      icon: <Search className="h-5 w-5" />,
      color: 'brand',
      onClick: () => onNavigate('search'),
    },
    {
      label: 'Storage Used',
      value: formatBytes(totalSize),
      sub: 'of 5 GB total',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'accent',
      onClick: () => onNavigate('settings'),
    },
  ];

  const quickActions = [
    {
      label: 'Upload Document',
      description: 'Add files to your knowledge base',
      icon: <Upload className="h-5 w-5" />,
      onClick: onUpload,
    },
    {
      label: 'Ask BrainDoc',
      description: 'Chat with your knowledge base',
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: () => onNavigate('chat'),
    },
    {
      label: 'Semantic Search',
      description: 'Find information across documents',
      icon: <Search className="h-5 w-5" />,
      onClick: () => onNavigate('search'),
    },
  ];

  return (
    <div className="workspace-page-stack space-y-6">
      {/* Spatial knowledge hero */}
      <div className="dashboard-spatial-hero animate-fade-in-up">
        <div className="dashboard-spatial-copy">
          <span className="badge"><Sparkles className="h-3 w-3" /> Knowledge core online</span>
          <h2>Your knowledge is<br />taking shape.</h2>
          <p>{indexedCount} sources are connected and ready to explore. Add another document or ask BrainDoc to trace an idea across your workspace.</p>
          <button onClick={onUpload} className="btn-primary">
            <Upload className="h-4 w-4" />
            Add knowledge
          </button>
        </div>
        <div className="dashboard-spatial-scene">
          <NeuralScene compact showLabels={false} />
        </div>
      </div>

      {/* Stats */}
      <div className="workspace-stats-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            className="card card-hover p-5 text-left animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color === 'brand' ? 'bg-brand-50 text-brand-600' : 'bg-accent-50 text-accent-600'}`}>
                {stat.icon}
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold text-ink-900">{stat.value}</div>
            <div className="text-sm text-ink-500">{stat.label}</div>
            <div className="mt-1 text-xs text-ink-400">{stat.sub}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="workspace-actions-grid grid gap-4 md:grid-cols-3">
        {quickActions.map((action, i) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="card card-hover group flex items-center gap-4 p-5 text-left animate-fade-in-up"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 transition-transform group-hover:scale-110">
              {action.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink-900">{action.label}</div>
              <div className="truncate text-xs text-ink-500">{action.description}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      {/* AI insight banner */}
      <div className="card bg-gradient-to-br from-brand-600 to-brand-700 border-brand-700 p-6 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-white">AI Insight</h3>
              <span className="badge bg-white/15 text-brand-100">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            </div>
            <p className="text-sm text-brand-50">
              You have {processingCount} document(s) being processed. Once indexing is complete, you'll be able to ask questions and search across their content. Your Q3 Financial Report has been frequently referenced in recent conversations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent documents */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">Recent Documents</h3>
            <button onClick={() => onNavigate('documents')} className="text-sm text-brand-600 hover:text-brand-700">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ink-50 cursor-pointer"
                onClick={() => onNavigate('documents')}
              >
                <FileTypeIcon type={doc.type} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{doc.name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                    <span>{formatBytes(doc.size)}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(doc.createdAt)}</span>
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">Recent Activity</h3>
            <Activity className="h-4 w-4 text-ink-400" />
          </div>
          <div className="space-y-1">
            {mockActivity.map((activity, i) => (
              <div key={activity.id} className="relative flex gap-3 pb-4 last:pb-0">
                {i < mockActivity.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-px bg-ink-100" />
                )}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  activity.type === 'upload' ? 'bg-brand-50 text-brand-600' :
                  activity.type === 'chat' ? 'bg-accent-50 text-accent-600' :
                  activity.type === 'search' ? 'bg-blue-50 text-blue-600' :
                  'bg-success-50 text-success-600'
                }`}>
                  {activity.type === 'upload' && <Upload className="h-3.5 w-3.5" />}
                  {activity.type === 'chat' && <MessageSquare className="h-3.5 w-3.5" />}
                  {activity.type === 'search' && <Search className="h-3.5 w-3.5" />}
                  {activity.type === 'index' && <FileText className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-sm font-medium text-ink-900">{activity.title}</p>
                  <p className="text-xs text-ink-500">{activity.description}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent conversations */}
      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-900">Recent Conversations</h3>
          <button onClick={() => onNavigate('chat')} className="text-sm text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {recentConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onNavigate('chat')}
              className="card card-hover p-4 text-left"
            >
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-brand-500" />
                <span className="text-xs text-ink-400">{formatRelativeTime(conv.updatedAt)}</span>
              </div>
              <p className="font-medium text-ink-900">{conv.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-ink-500">
                {conv.messages[conv.messages.length - 1]?.content.slice(0, 100)}...
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
