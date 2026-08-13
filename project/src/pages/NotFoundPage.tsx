import type { Page } from '@/types';
import { Logo } from '@/components/Logo';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: Page) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 p-4">
      <Logo className="mb-8" />
      <div className="text-center">
        <h1 className="font-display text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 font-display text-xl font-bold text-ink-900">Page not found</h2>
        <p className="mt-2 text-sm text-ink-500">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => onNavigate('landing')} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <button onClick={() => onNavigate('dashboard')} className="btn-primary">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
