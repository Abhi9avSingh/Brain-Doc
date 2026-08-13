import { useState, useRef, useEffect } from 'react';
import { mockConversations } from '@/lib/mockData';
import { formatRelativeTime, cn, uid } from '@/lib/utils';
import type { ChatMessage, Conversation } from '@/types';
import {
  Send,
  MessageSquare,
  Plus,
  Brain,
  Sparkles,
  FileText,
  ChevronDown,
  Trash2,
  Search,
  X,
} from 'lucide-react';

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string | null>(mockConversations[0]?.id ?? null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [convSearch, setConvSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const messages = activeConversation?.messages ?? [];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(convSearch.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: uid(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    let convId = activeId;
    if (!activeConversation) {
      convId = uid();
      const newConv: Conversation = {
        id: convId,
        title: input.slice(0, 40),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(convId);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    }

    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: "Based on your uploaded documents, I found relevant information that addresses your question. The key findings indicate strong growth in enterprise subscriptions, with a 24% year-over-year increase. This was primarily driven by expanded product offerings and improved customer onboarding processes. The data also suggests that customer retention rates have improved significantly, contributing to overall revenue growth.",
        sources: [
          {
            documentId: 'd1',
            documentName: 'Q3 Financial Report.pdf',
            chunkId: 'ch1',
            page: 12,
            text: 'Enterprise subscriptions grew 24% year-over-year...',
            score: 0.94,
          },
        ],
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date().toISOString() }
            : c,
        ),
      );
      setIsTyping(false);
    }, 1800);
  };

  const handleNewChat = () => {
    setActiveId(null);
    setSidebarOpen(false);
  };

  const handleDeleteConv = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <div className="workspace-chat flex h-[calc(100vh-9rem)] gap-0 overflow-hidden lg:gap-4">
      {/* Sidebar - conversations */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-ink-100 bg-white transition-transform lg:relative lg:translate-x-0 lg:rounded-2xl lg:border',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )} style={{ top: 'auto' }}>
        <div className="flex h-full flex-col lg:rounded-2xl">
          <div className="border-b border-ink-100 p-4">
            <button onClick={handleNewChat} className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              New Conversation
            </button>
          </div>
          <div className="border-b border-ink-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-ink-200 py-2 pl-9 pr-3 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-ink-400">No conversations found</div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    activeId === conv.id ? 'bg-brand-50' : 'hover:bg-ink-50',
                  )}
                  onClick={() => { setActiveId(conv.id); setSidebarOpen(false); }}
                >
                  <MessageSquare className={cn('h-4 w-4 shrink-0', activeId === conv.id ? 'text-brand-600' : 'text-ink-400')} />
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', activeId === conv.id ? 'text-brand-900' : 'text-ink-700')}>
                      {conv.title}
                    </p>
                    <p className="text-xs text-ink-400">{formatRelativeTime(conv.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteConv(conv.id); }}
                    className="opacity-0 transition-opacity group-hover:opacity-100 btn-ghost !p-1 !text-ink-400 hover:!text-error-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main chat */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="btn-ghost !p-2 lg:hidden">
              <MessageSquare className="h-5 w-5" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-ink-900">
                {activeConversation?.title ?? 'New Conversation'}
              </h2>
              <p className="flex items-center gap-1 text-xs text-ink-400">
                <Sparkles className="h-3 w-3 text-brand-500" />
                Powered by RAG + LLM
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand shadow-glow animate-float">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">Ask BrainDoc anything</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-500">
                I can answer questions about your uploaded documents, summarize content, and find specific information across your knowledge base.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  'Summarize my Q3 Financial Report',
                  'What are the key product milestones?',
                  'Find information about neural networks',
                  'Compare revenue growth across quarters',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="card card-hover px-4 py-3 text-left text-sm text-ink-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex gap-3 animate-fade-in-up', msg.role === 'user' && 'flex-row-reverse')}
                >
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold',
                    msg.role === 'user' ? 'bg-ink-200 text-ink-700' : 'gradient-brand text-white',
                  )}>
                    {msg.role === 'user' ? 'AM' : <Brain className="h-5 w-5" />}
                  </div>
                  <div className={cn('max-w-[80%]', msg.role === 'user' && 'flex flex-col items-end')}>
                    <div className={cn(
                      'rounded-2xl px-4 py-3 text-sm',
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-br-sm'
                        : 'bg-ink-50 text-ink-800 rounded-bl-sm',
                    )}>
                      {msg.content}
                    </div>

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs font-medium text-ink-400">Sources:</p>
                        {msg.sources.map((source) => (
                          <div
                            key={source.chunkId}
                            className="card card-hover flex items-start gap-3 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-medium text-ink-900">{source.documentName}</p>
                                {source.page && (
                                  <span className="badge bg-ink-100 text-ink-600">p.{source.page}</span>
                                )}
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs text-ink-500">{source.text}</p>
                            </div>
                            {source.score && (
                              <div className="shrink-0">
                                <div className="relative h-10 w-10">
                                  <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-ink-100" />
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3"
                      className="text-brand-500"
                      strokeDasharray={`${source.score * 88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-ink-700">
                    {(source.score * 100).toFixed(0)}
                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-ink-400">{formatRelativeTime(msg.createdAt)}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-brand text-white">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-ink-50 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-subtle" />
                      <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-subtle" style={{ animationDelay: '0.15s' }} />
                      <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce-subtle" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-ink-100 p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-ink-200 bg-white p-2 transition-all focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question about your documents..."
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                style={{ minHeight: '40px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn-primary !rounded-xl !p-2.5 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-ink-400">
              BrainDoc uses RAG to answer from your documents. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
