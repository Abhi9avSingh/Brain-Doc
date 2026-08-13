import { useEffect, useRef, useState } from 'react';
import { Check, FileText, Trash2, UploadCloud } from 'lucide-react';
import type { BrainDoc, DocumentType } from '@/types';
import { cn, formatBytes, uid } from '@/lib/utils';

interface UploadPanelProps {
  initialFiles?: File[];
  onUploaded: (documents: BrainDoc[]) => void;
  onCancel?: () => void;
}

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  error?: string;
};

const allowedTypes = new Set<DocumentType>(['pdf', 'docx', 'txt', 'md']);

function fileType(file: File): DocumentType | null {
  const extension = file.name.split('.').pop()?.toLowerCase() as DocumentType | undefined;
  return extension && allowedTypes.has(extension) ? extension : null;
}

export function UploadPanel({ initialFiles = [], onUploaded, onCancel }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [items, setItems] = useState<UploadItem[]>(() =>
    initialFiles.map((file) => ({ id: uid(), file, progress: 4 })),
  );

  const addFiles = (incoming: File[]) => {
    const next = incoming.map((file) => {
      const type = fileType(file);
      const error = !type
        ? 'Unsupported format'
        : file.size > 25 * 1024 * 1024
          ? 'File is larger than 25MB'
          : undefined;

      return { id: uid(), file, progress: error ? 0 : 4, error };
    });
    setItems((current) => [...current, ...next]);
  };

  useEffect(() => {
    if (!items.some((item) => !item.error && item.progress < 100)) return;

    const timer = window.setInterval(() => {
      setItems((current) =>
        current.map((item) => {
          if (item.error || item.progress >= 100) return item;
          const increment = 8 + Math.round(Math.random() * 18);
          return { ...item, progress: Math.min(100, item.progress + increment) };
        }),
      );
    }, 260);

    return () => window.clearInterval(timer);
  }, [items]);

  const validItems = items.filter((item) => !item.error);
  const allReady = validItems.length > 0 && validItems.every((item) => item.progress === 100);

  const finishUpload = () => {
    if (!allReady) return;
    const timestamp = new Date().toISOString();
    const documents: BrainDoc[] = validItems.map((item) => ({
      id: `upload-${uid()}`,
      name: item.file.name,
      type: fileType(item.file) ?? 'txt',
      size: item.file.size,
      status: 'processing',
      createdAt: timestamp,
      updatedAt: timestamp,
      summary: 'BrainDoc is extracting, chunking, and connecting this file to your knowledge graph.',
      tags: ['new'],
    }));
    onUploaded(documents);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn('upload-zone-3d', dragActive && 'is-dragging')}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <div className="upload-cube" aria-hidden="true">
          <UploadCloud />
        </div>
        <p className="font-semibold text-primary-c">Drop documents into your knowledge space</p>
        <p className="mt-1 text-sm text-secondary-c">PDF, DOCX, TXT or MD · up to 25MB</p>
        <button type="button" className="btn-primary mt-4" onClick={() => inputRef.current?.click()}>
          <FileText className="h-4 w-4" />
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="sr-only"
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="space-y-2" aria-live="polite">
          {items.map((item) => (
            <div key={item.id} className="upload-file-row">
              <div className="upload-file-icon">
                {item.progress === 100 && !item.error ? <Check /> : <FileText />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-primary-c">{item.file.name}</p>
                  <span className={cn('text-xs', item.error ? 'text-error-500' : 'text-secondary-c')}>
                    {item.error ?? (item.progress === 100 ? 'Ready' : `${item.progress}%`)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-tertiary-c">{formatBytes(item.file.size)}</p>
                {!item.error && (
                  <div className="upload-progress" aria-label={`${item.progress}% uploaded`}>
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}
                className="btn-ghost !p-2"
                aria-label={`Remove ${item.file.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="button" className="btn-primary" disabled={!allReady} onClick={finishUpload}>
          <UploadCloud className="h-4 w-4" />
          Add to BrainDoc
        </button>
      </div>
    </div>
  );
}
