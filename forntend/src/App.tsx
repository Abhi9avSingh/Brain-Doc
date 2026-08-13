import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import type { BrainDoc, Page } from '@/types';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { ChatPage } from '@/pages/ChatPage';
import { SearchPage } from '@/pages/SearchPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuroraBackground } from '@/components/AuroraBackground';
import { UploadPanel } from '@/components/UploadPanel';
import { mockDocuments } from '@/lib/mockData';

const pageMeta: Record<Page, { title: string; subtitle?: string }> = {
  landing: { title: '', subtitle: '' },
  login: { title: 'Sign In', subtitle: 'Welcome  to BrainDoc' },
  register: { title: 'Create Account', subtitle: 'Start building your second brain' },
  dashboard: { title: 'Dashboard', subtitle: 'Your knowledge base at a glance' },
  documents: { title: 'Documents', subtitle: 'Upload and manage your files' },
  documentDetail: { title: 'Document Details', subtitle: 'View and manage document' },
  chat: { title: 'AI Chat', subtitle: 'Ask questions about your documents' },
  search: { title: 'Search', subtitle: 'Find information across your knowledge base' },
  integrations: { title: 'Integrations', subtitle: 'Connect your tools and services' },
  settings: { title: 'Settings', subtitle: 'Manage your account and preferences' },
};

function pageFromHash(): Page {
  const candidate = window.location.hash.replace('#', '') as Page;
  return candidate && candidate in pageMeta ? candidate : 'landing';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(pageFromHash);
  const [globalSearch, setGlobalSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadSession, setUploadSession] = useState(0);
  const [pageKey, setPageKey] = useState(0);
  const [documents, setDocuments] = useState<BrainDoc[]>(() => {
    try {
      const stored = localStorage.getItem('braindoc-documents');
      return stored ? JSON.parse(stored) : mockDocuments;
    } catch {
      return mockDocuments;
    }
  });

  useEffect(() => {
    localStorage.setItem('braindoc-documents', JSON.stringify(documents));
  }, [documents]);

  const navigate = (page: Page) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    const commit = () => {
      setCurrentPage(page);
      setPageKey((k) => k + 1);
      if (window.location.hash !== `#${page}`) window.history.pushState({ page }, '', `#${page}`);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    const transition = (document as Document & { startViewTransition?: (update: () => void) => void }).startViewTransition;
    if (transition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.call(document, () => flushSync(commit));
    } else {
      commit();
    }
  };

  useEffect(() => {
    const meta = pageMeta[currentPage];
    document.title = currentPage === 'landing' ? 'BrainDoc — Your knowledge, alive' : `${meta?.title ?? 'BrainDoc'} — BrainDoc`;
  }, [currentPage]);

  useEffect(() => {
    const syncPage = () => {
      setCurrentPage(pageFromHash());
      setPageKey((key) => key + 1);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', syncPage);
    window.addEventListener('popstate', syncPage);
    return () => {
      window.removeEventListener('hashchange', syncPage);
      window.removeEventListener('popstate', syncPage);
    };
  }, []);

  const openUpload = (files: File[] = []) => {
    setPendingFiles(files);
    setUploadSession((session) => session + 1);
    setUploadOpen(true);
  };

  const handleUploaded = (newDocuments: BrainDoc[]) => {
    setDocuments((current) => [...newDocuments, ...current]);
    setUploadOpen(false);
    setPendingFiles([]);
    navigate('documents');

    window.setTimeout(() => {
      const uploadedIds = new Set(newDocuments.map((document) => document.id));
      setDocuments((current) =>
        current.map((document) =>
          uploadedIds.has(document.id)
            ? { ...document, status: 'indexed', updatedAt: new Date().toISOString() }
            : document,
        ),
      );
    }, 2600);
  };

  // Landing page - full screen, no layout
  if (currentPage === 'landing') {
    return (
      <ThemeProvider>
        <LandingPage onNavigate={navigate} />
      </ThemeProvider>
    );
  }

  // Auth pages - full screen, no layout
  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <ThemeProvider>
        <div className="relative min-h-screen">
          <AuroraBackground />
          <div className="relative z-10">
            <AuthPage mode={currentPage} onNavigate={navigate} />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // 404
  if (currentPage === 'documentDetail' || !pageMeta[currentPage]) {
    return (
      <ThemeProvider>
        <div className="relative min-h-screen">
          <AuroraBackground />
          <div className="relative z-10">
            <NotFoundPage onNavigate={navigate} />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // App pages with layout
  const meta = pageMeta[currentPage];
  const showUpload = currentPage === 'dashboard' || currentPage === 'documents';

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <AuroraBackground />
        <div className="relative z-10">
          <AppLayout
            current={currentPage}
            onNavigate={navigate}
            title={meta.title}
            subtitle={meta.subtitle}
            onUpload={showUpload ? () => openUpload() : undefined}
            searchValue={globalSearch}
            onSearchChange={(value) => {
              setGlobalSearch(value);
              if (value && currentPage !== 'search') navigate('search');
            }}
          >
            <div key={pageKey} className="page-enter">
              {currentPage === 'dashboard' && <DashboardPage documents={documents} onNavigate={navigate} onUpload={() => openUpload()} />}
              {currentPage === 'documents' && <DocumentsPage documents={documents} setDocuments={setDocuments} onUpload={openUpload} />}
              {currentPage === 'chat' && <ChatPage />}
              {currentPage === 'search' && <SearchPage initialQuery={globalSearch} />}
              {currentPage === 'integrations' && <IntegrationsPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </div>
          </AppLayout>
        </div>
      </div>

      {/* Global Upload Modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Documents">
        <UploadPanel
          key={uploadSession}
          initialFiles={pendingFiles}
          onUploaded={handleUploaded}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>
    </ThemeProvider>
  );
}

export default App;
