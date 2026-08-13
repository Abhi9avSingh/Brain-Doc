export type DocumentType = 'pdf' | 'docx' | 'txt' | 'md';
export type DocumentStatus = 'uploading' | 'processing' | 'indexed' | 'failed';
export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'documents' | 'documentDetail' | 'chat' | 'search' | 'integrations' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface BrainDoc {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  pageCount?: number;
  tags?: string[];
}

export interface SourceCitation {
  documentId: string;
  documentName: string;
  chunkId: string;
  page?: number;
  text: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  createdAt: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  documentId: string;
  documentName: string;
  text: string;
  page: number;
  score: number;
  type: DocumentType;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: string;
}

export interface ActivityItem {
  id: string;
  type: 'upload' | 'chat' | 'search' | 'index';
  title: string;
  description: string;
  timestamp: string;
}
