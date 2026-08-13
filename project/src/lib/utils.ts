export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}

export function getFileIcon(type: string): string {
  const icons: Record<string, string> = {
    pdf: 'PDF',
    docx: 'DOC',
    txt: 'TXT',
    md: 'MD',
  };
  return icons[type] ?? 'FILE';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    uploading: 'text-accent-600 bg-accent-50',
    processing: 'text-warning-600 bg-warning-50',
    indexed: 'text-success-600 bg-success-50',
    failed: 'text-error-600 bg-error-50',
  };
  return colors[status] ?? 'text-ink-500 bg-ink-100';
}

export function uid(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-brand-100 text-brand-800 rounded px-0.5">$1</mark>');
}
