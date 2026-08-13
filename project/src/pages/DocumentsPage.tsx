import { useState, type Dispatch, type SetStateAction } from 'react';
import { formatBytes, formatRelativeTime, cn } from '@/lib/utils';
import { StatusBadge, FileTypeIcon } from '@/components/ui/Badges';
import { Modal, useModal } from '@/components/ui/Modal';
import type { BrainDoc, DocumentStatus } from '@/types';
import {
  Upload,
  Search,
  Grid3x3,
  List,
  Trash2,
  RefreshCw,
  Eye,
  Loader2,
  UploadCloud,
} from 'lucide-react';

interface DocumentsPageProps {
  documents: BrainDoc[];
  setDocuments: Dispatch<SetStateAction<BrainDoc[]>>;
  onUpload: (files?: File[]) => void;
}

export function DocumentsPage({ documents, setDocuments, onUpload }: DocumentsPageProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DocumentStatus | 'all'>('all');
  const [selectedDoc, setSelectedDoc] = useState<BrainDoc | null>(null);
  const deleteModal = useModal();
  const previewModal = useModal();
  const [dragActive, setDragActive] = useState(false);

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || doc.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = () => {
    if (selectedDoc) {
      setDocuments((prev) => prev.filter((d) => d.id !== selectedDoc.id));
      deleteModal.closeModal();
      setSelectedDoc(null);
    }
  };

  const handleReindex = (doc: BrainDoc) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'processing' } : d)),
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const filters: { value: DocumentStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'indexed', label: 'Indexed' },
    { value: 'processing', label: 'Processing' },
    { value: 'uploading', label: 'Uploading' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="workspace-page-stack workspace-documents space-y-6">
      {/* Header actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-ink-200 bg-white p-1">
            <button
              onClick={() => setView('grid')}
              className={cn('rounded-lg p-1.5 transition-colors', view === 'grid' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-600')}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('rounded-lg p-1.5 transition-colors', view === 'list' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-600')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onUpload} className="btn-primary">
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50',
            )}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {documents.filter((d) => d.status === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Documents */}
      {filtered.length === 0 ? (
        <div
          className={cn(
            'card flex flex-col items-center justify-center p-12 text-center transition-all',
            dragActive && 'border-brand-400 bg-brand-50/50 scale-[1.01]',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all',
            dragActive ? 'bg-brand-100 text-brand-600 scale-110' : 'bg-ink-100 text-ink-400',
          )}>
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink-900">
            {search ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            {search ? 'Try adjusting your search or filters' : 'Drag and drop files here, or click upload'}
          </p>
          {!search && (
            <button onClick={onUpload} className="btn-primary mt-4">
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc, i) => (
            <div
              key={doc.id}
              className="card card-hover group p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <FileTypeIcon type={doc.type} />
                <StatusBadge status={doc.status} />
              </div>
              <h3 className="mt-3 truncate font-medium text-ink-900" title={doc.name}>{doc.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-ink-500">
                {doc.summary ?? 'Processing document...'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
                <span>{formatBytes(doc.size)}</span>
                {doc.pageCount && (
                  <>
                    <span>·</span>
                    <span>{doc.pageCount} pages</span>
                  </>
                )}
                <span>·</span>
                <span>{formatRelativeTime(doc.createdAt)}</span>
              </div>
              {doc.tags && doc.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <span key={tag} className="badge bg-ink-100 text-ink-600">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-1 border-t border-ink-100 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => { setSelectedDoc(doc); previewModal.openModal(); }} className="btn-ghost !py-1.5 !text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                {doc.status === 'failed' && (
                  <button onClick={() => handleReindex(doc)} className="btn-ghost !py-1.5 !text-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </button>
                )}
                {doc.status === 'indexed' && (
                  <button onClick={() => handleReindex(doc)} className="btn-ghost !py-1.5 !text-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Re-index
                  </button>
                )}
                <button
                  onClick={() => { setSelectedDoc(doc); deleteModal.openModal(); }}
                  className="btn-ghost !py-1.5 !text-xs ml-auto !text-error-500 hover:!bg-error-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">Name</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500 md:table-cell">Size</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500 lg:table-cell">Pages</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">Status</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500 md:table-cell">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr
                  key={doc.id}
                  className="border-b border-ink-50 transition-colors hover:bg-ink-50/50 animate-fade-in"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileTypeIcon type={doc.type} className="!h-8 !w-8" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{doc.name}</p>
                        <p className="truncate text-xs text-ink-400 md:hidden">{formatBytes(doc.size)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-ink-600 md:table-cell">{formatBytes(doc.size)}</td>
                  <td className="hidden px-4 py-3 text-sm text-ink-600 lg:table-cell">{doc.pageCount ?? '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="hidden px-4 py-3 text-sm text-ink-500 md:table-cell">{formatRelativeTime(doc.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedDoc(doc); previewModal.openModal(); }} className="btn-ghost !p-1.5">
                        <Eye className="h-4 w-4" />
                      </button>
                      {(doc.status === 'failed' || doc.status === 'indexed') && (
                        <button onClick={() => handleReindex(doc)} className="btn-ghost !p-1.5">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedDoc(doc); deleteModal.openModal(); }}
                        className="btn-ghost !p-1.5 !text-error-500 hover:!bg-error-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal open={deleteModal.open} onClose={deleteModal.closeModal} title="Delete Document">
        <p className="text-sm text-ink-600">
          Are you sure you want to delete <span className="font-semibold text-ink-900">{selectedDoc?.name}</span>?
          This will remove it from your knowledge base and cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={deleteModal.closeModal} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-primary !bg-error-500 hover:!bg-error-600">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={previewModal.open} onClose={previewModal.closeModal} title={selectedDoc?.name} className="!max-w-2xl">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FileTypeIcon type={selectedDoc.type} className="!h-16 !w-16" />
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-ink-900">{selectedDoc.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={selectedDoc.status} />
                  <span className="text-xs text-ink-400">{formatBytes(selectedDoc.size)}</span>
                  {selectedDoc.pageCount && <span className="text-xs text-ink-400">· {selectedDoc.pageCount} pages</span>}
                </div>
              </div>
            </div>

            {selectedDoc.summary ? (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-ink-700">AI Summary</h4>
                <p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">{selectedDoc.summary}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-warning-50 p-4 text-sm text-warning-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Document is being processed. Summary will be available once indexing is complete.
              </div>
            )}

            {selectedDoc.tags && selectedDoc.tags.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-ink-700">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.tags.map((tag) => (
                    <span key={tag} className="badge bg-ink-100 text-ink-600">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 border-t border-ink-100 pt-4">
              <div className="flex-1 text-xs text-ink-400">
                Created {formatRelativeTime(selectedDoc.createdAt)}
              </div>
              {selectedDoc.status === 'indexed' && (
                <button onClick={() => handleReindex(selectedDoc)} className="btn-secondary !py-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Re-index
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
