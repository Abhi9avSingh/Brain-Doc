import { cn } from '@/lib/utils';
import type { DocumentStatus } from '@/types';
import { getStatusColor } from '@/lib/utils';
import { FileText, FileType, FileCode, Loader2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import type { DocumentType } from '@/types';

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const icons: Record<DocumentStatus, React.ReactNode> = {
    uploading: <UploadCloud className="h-3 w-3" />,
    processing: <Loader2 className="h-3 w-3 animate-spin" />,
    indexed: <CheckCircle2 className="h-3 w-3" />,
    failed: <AlertCircle className="h-3 w-3" />,
  };

  const labels: Record<DocumentStatus, string> = {
    uploading: 'Uploading',
    processing: 'Processing',
    indexed: 'Indexed',
    failed: 'Failed',
  };

  return (
    <span className={cn('badge', getStatusColor(status), className)}>
      {icons[status]}
      {labels[status]}
    </span>
  );
}

interface FileTypeIconProps {
  type: DocumentType;
  className?: string;
}

export function FileTypeIcon({ type, className }: FileTypeIconProps) {
  const config: Record<DocumentType, { icon: React.ReactNode; color: string }> = {
    pdf: { icon: <FileType className="h-5 w-5" />, color: 'bg-red-50 text-red-600' },
    docx: { icon: <FileText className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600' },
    txt: { icon: <FileText className="h-5 w-5" />, color: 'bg-ink-100 text-ink-600' },
    md: { icon: <FileCode className="h-5 w-5" />, color: 'bg-brand-50 text-brand-600' },
  };

  const { icon, color } = config[type] ?? config.txt;

  return (
    <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', color, className)}>
      {icon}
    </div>
  );
}
