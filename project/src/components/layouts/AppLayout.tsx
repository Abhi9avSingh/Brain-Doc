import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { WorkspaceMotion } from '@/components/experience/WorkspaceMotion';
import { WorkspaceCommandPalette } from '@/components/experience/WorkspaceCommandPalette';
import type { Page } from '@/types';

interface AppLayoutProps {
  current: Page;
  onNavigate: (page: Page) => void;
  title: string;
  subtitle?: string;
  onUpload?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}

export function AppLayout({
  current,
  onNavigate,
  title,
  subtitle,
  onUpload,
  searchValue,
  onSearchChange,
  children,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-3d-shell workspace-shell min-h-screen" data-page={current}>
      <WorkspaceMotion />
      <Sidebar
        current={current}
        onNavigate={(page) => {
          onNavigate(page);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="workspace-content lg:pl-64">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenSidebar={() => setMobileOpen(true)}
          onNavigate={onNavigate}
          onUpload={onUpload}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />

        <main id="main-content" tabIndex={-1} className="workspace-main mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <WorkspaceCommandPalette onNavigate={onNavigate} onUpload={onUpload} />
    </div>
  );
}
