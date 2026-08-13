import { useEffect, useState } from 'react';
import { mockSearchResults } from '@/lib/mockData';
import { formatScore, highlightMatch, cn } from '@/lib/utils';
import { FileTypeIcon } from '@/components/ui/Badges';
import {
  Search,
  Sparkles,
  FileText,
  TrendingUp,
  Filter,
  ChevronDown,
  Brain,
} from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
}

export function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery.trim()));
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      setHasSearched(true);
    }
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim()) setHasSearched(true);
  };

  let results = hasSearched ? mockSearchResults : [];
  if (typeFilter !== 'all') {
    results = results.filter((r) => r.type === typeFilter);
  }
  if (sortBy === 'date') {
    results = [...results].sort((a, b) => b.score - a.score);
  } else {
    results = [...results].sort((a, b) => b.score - a.score);
  }

  const suggestions = [
    'enterprise subscription growth',
    'Q3 revenue analysis',
    'neural network architecture',
    'product roadmap timeline',
  ];

  return (
    <div className="workspace-page-stack workspace-search space-y-6">
      {/* Search bar */}
      <div className="card p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search across all your documents..."
            className="w-full rounded-2xl border border-ink-200 bg-ink-50 py-4 pl-12 pr-32 text-base text-ink-900 placeholder:text-ink-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Search
          </button>
        </div>

        {!hasSearched && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-400">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); setHasSearched(true); }}
                className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasSearched && (
        <>
          {/* Results header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink-600">
                Found <span className="font-semibold text-ink-900">{results.length} results</span> for
                "<span className="font-semibold text-ink-900">{query}</span>"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-2 py-1.5">
                <Filter className="h-3.5 w-3.5 text-ink-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-sm text-ink-700 focus:outline-none"
                >
                  <option value="all">All types</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="txt">TXT</option>
                  <option value="md">MD</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-2 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-ink-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date')}
                  className="bg-transparent text-sm text-ink-700 focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </div>
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink-900">No results found</h3>
              <p className="mt-1 text-sm text-ink-500">Try different keywords or remove filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, i) => (
                <div
                  key={result.id}
                  className="card card-hover p-5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <FileTypeIcon type={result.type} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-ink-900">{result.documentName}</h3>
                        <span className="badge bg-ink-100 text-ink-600">Page {result.page}</span>
                      </div>
                      <p
                        className="mt-2 text-sm text-ink-600"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(result.text, query) }}
                      />
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                            <div
                              className="h-full gradient-brand rounded-full transition-all"
                              style={{ width: `${result.score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-ink-500">{formatScore(result.score)} match</span>
                        </div>
                        <button className="text-xs text-brand-600 hover:text-brand-700">
                          View in document →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI insight */}
          <div className="card bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-brand">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-ink-900">AI Search Insight</h4>
                <p className="mt-1 text-sm text-ink-600">
                  Your search returned results from {new Set(results.map(r => r.documentId)).size} documents.
                  The top result has a {formatScore(Math.max(...results.map(r => r.score)))} semantic match.
                  Try asking BrainDoc a question about these results for a synthesized answer.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!hasSearched && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <Search className="h-6 w-6" />, title: 'Semantic Search', description: 'Search by meaning, not just keywords. Find information even when exact terms don\'t match.' },
            { icon: <FileText className="h-6 w-6" />, title: 'Cross-Document', description: 'Search across all your uploaded documents simultaneously with relevance ranking.' },
            { icon: <Sparkles className="h-6 w-6" />, title: 'Highlighted Matches', description: 'See exactly where and how your query matches within each document.' },
          ].map((item, i) => (
            <div key={item.title} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {item.icon}
              </div>
              <h3 className="font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
