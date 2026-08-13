import { useEffect, useMemo, useRef, useState } from 'react';
import { Command, FileText, LayoutDashboard, MessageSquare, Plug, Search, Settings, Upload, X } from 'lucide-react';
import type { Page } from '@/types';

interface WorkspaceCommandPaletteProps {
  onNavigate: (page: Page) => void;
  onUpload?: () => void;
}

const commands: Array<{ label: string; hint: string; page?: Page; action?: 'upload'; icon: typeof Command }> = [
  { label: 'Open dashboard', hint: 'Overview and activity', page: 'dashboard', icon: LayoutDashboard },
  { label: 'Browse documents', hint: 'Search and manage sources', page: 'documents', icon: FileText },
  { label: 'Ask BrainDoc', hint: 'Start a grounded conversation', page: 'chat', icon: MessageSquare },
  { label: 'Semantic search', hint: 'Search every indexed passage', page: 'search', icon: Search },
  { label: 'Connect a source', hint: 'Drive, Notion, Slack and more', page: 'integrations', icon: Plug },
  { label: 'Workspace settings', hint: 'Models, privacy and profile', page: 'settings', icon: Settings },
  { label: 'Upload knowledge', hint: 'Add PDF, DOCX, TXT or MD', action: 'upload', icon: Upload },
];

export function WorkspaceCommandPalette({ onNavigate, onUpload }: WorkspaceCommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(normalized)) : commands;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (!open) return;
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (filtered.length) setActive((value) => Math.min(filtered.length - 1, value + 1));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((value) => Math.max(0, value - 1));
      }
      if (event.key === 'Enter' && filtered[active]) {
        event.preventDefault();
        run(filtered[active]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, active, filtered]);

  const run = (command: (typeof commands)[number]) => {
    if (command.action === 'upload') onUpload ? onUpload() : onNavigate('documents');
    if (command.page) onNavigate(command.page);
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  return (
    <>
      <button ref={triggerRef} className="workspace-command-trigger" onClick={() => setOpen(true)} aria-label="Open command palette">
        <Command />
        <span>Quick actions</span>
        <kbd>⌘ K</kbd>
      </button>
      {open && (
        <div className="workspace-command-overlay" onMouseDown={() => setOpen(false)}>
          <div className="workspace-command-panel" role="dialog" aria-modal="true" aria-label="Workspace commands" onMouseDown={(event) => event.stopPropagation()}>
            <div className="workspace-command-search">
              <Search />
              <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="Navigate or run an action…" />
              <button onClick={() => setOpen(false)} aria-label="Close"><X /></button>
            </div>
            <div className="workspace-command-list" role="listbox" aria-label="Commands">
              {filtered.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button key={command.label} role="option" aria-selected={index === active} className={index === active ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onClick={() => run(command)}>
                    <span><Icon /></span>
                    <div><strong>{command.label}</strong><small>{command.hint}</small></div>
                    <kbd>↵</kbd>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="workspace-command-empty">No matching action</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
