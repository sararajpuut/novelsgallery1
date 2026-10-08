import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, User, BookMarked, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SearchModalProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ navigate }) => {
  const { isSearchOpen, setIsSearchOpen, novels, authors, episodes, ebooks } = useStore();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'novels' | 'authors' | 'episodes' | 'ebooks'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredNovels = trimmed
    ? novels.filter(n => 
        n.title.toLowerCase().includes(trimmed) || 
        n.urduTitle.includes(trimmed) || 
        n.authorName.toLowerCase().includes(trimmed) ||
        n.genre.toLowerCase().includes(trimmed)
      )
    : [];

  const filteredAuthors = trimmed
    ? authors.filter(a => 
        a.name.toLowerCase().includes(trimmed) || 
        a.urduName.includes(trimmed) ||
        a.bio.toLowerCase().includes(trimmed)
      )
    : [];

  const filteredEpisodes = trimmed
    ? episodes.filter(e => 
        e.title.toLowerCase().includes(trimmed) || 
        e.urduTitle.includes(trimmed)
      )
    : [];

  const filteredEbooks = trimmed
    ? ebooks.filter(eb => 
        eb.title.toLowerCase().includes(trimmed) || 
        eb.urduTitle.includes(trimmed) ||
        eb.author.toLowerCase().includes(trimmed)
      )
    : [];

  const hasResults = filteredNovels.length > 0 || filteredAuthors.length > 0 || filteredEpisodes.length > 0 || filteredEbooks.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#F8F4EA] w-full max-w-2xl rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#EEE8D8] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#173F35] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search novels, Urdu authors, episodes, or genres..."
            className="w-full text-base bg-transparent border-none outline-none text-[#252525] placeholder-[#6B6B6B]"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#EEE8D8] rounded text-[#6B6B6B]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs text-[#6B6B6B] hover:text-[#173F35] bg-[#EEE8D8] rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="px-4 py-2 border-b border-[#EEE8D8] bg-[#FAF7F0] flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedFilter === 'all' ? 'bg-[#173F35] text-white' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setSelectedFilter('novels')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedFilter === 'novels' ? 'bg-[#173F35] text-white' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
              }`}
            >
              Novels ({filteredNovels.length})
            </button>
            <button
              onClick={() => setSelectedFilter('authors')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedFilter === 'authors' ? 'bg-[#173F35] text-white' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
              }`}
            >
              Authors ({filteredAuthors.length})
            </button>
            <button
              onClick={() => setSelectedFilter('episodes')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedFilter === 'episodes' ? 'bg-[#173F35] text-white' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
              }`}
            >
              Episodes ({filteredEpisodes.length})
            </button>
            <button
              onClick={() => setSelectedFilter('ebooks')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedFilter === 'ebooks' ? 'bg-[#173F35] text-white' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
              }`}
            >
              E-Books ({filteredEbooks.length})
            </button>
          </div>
        )}

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!query ? (
            <div className="py-8 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-[#173F35]/40 mx-auto" />
              <p className="text-sm font-medium text-[#173F35]">
                Search through Urdu Novels, Classical Works & Writers
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                <span className="text-[#6B6B6B]">Try searching:</span>
                {['Jannat Kay Pattay', 'Peer-e-Kamil', 'Nemrah Ahmed', 'Mirza Ghalib', 'Raja Gidh'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-white border border-[#173F35]/15 rounded hover:border-[#173F35] text-[#173F35] cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-[#6B6B6B]">
              <p className="text-sm font-medium text-[#173F35]">No matches found for "{query}"</p>
              <p className="text-xs mt-1">Try another keyword, author name, or genre.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Novels Results */}
              {(selectedFilter === 'all' || selectedFilter === 'novels') && filteredNovels.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#173F35] tracking-wider mb-2">
                    Novels ({filteredNovels.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredNovels.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('novel-detail', { id: n.id });
                        }}
                        className="p-3 bg-white rounded-lg border border-[#EEE8D8] hover:border-[#173F35] hover:bg-[#FAF7F0] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[#C8A45D]" />
                          <div>
                            <span className="text-sm font-semibold text-[#173F35] block">{n.title}</span>
                            <span className="text-xs text-[#6B6B6B]">{n.authorName} · {n.genre}</span>
                          </div>
                        </div>
                        <span className="font-urdu text-sm text-[#4A3025] font-semibold">{n.urduTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors Results */}
              {(selectedFilter === 'all' || selectedFilter === 'authors') && filteredAuthors.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#173F35] tracking-wider mb-2">
                    Authors ({filteredAuthors.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredAuthors.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('author-detail', { id: a.id });
                        }}
                        className="p-3 bg-white rounded-lg border border-[#EEE8D8] hover:border-[#173F35] hover:bg-[#FAF7F0] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-[#173F35]" />
                          <div>
                            <span className="text-sm font-semibold text-[#173F35] block">{a.name}</span>
                            <span className="text-xs text-[#6B6B6B]">{a.novelsCount} Novels in Library</span>
                          </div>
                        </div>
                        <span className="font-urdu text-sm text-[#4A3025] font-semibold">{a.urduName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodes Results */}
              {(selectedFilter === 'all' || selectedFilter === 'episodes') && filteredEpisodes.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#173F35] tracking-wider mb-2">
                    Episodes ({filteredEpisodes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEpisodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('reader', { novelId: ep.novelId, episodeId: ep.id });
                        }}
                        className="p-3 bg-white rounded-lg border border-[#EEE8D8] hover:border-[#173F35] hover:bg-[#FAF7F0] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookMarked className="w-4 h-4 text-[#C8A45D]" />
                          <div>
                            <span className="text-sm font-semibold text-[#173F35] block">{ep.title}</span>
                            <span className="text-xs text-[#6B6B6B]">{ep.readTimeMinutes} min read</span>
                          </div>
                        </div>
                        <span className="font-urdu text-sm text-[#4A3025]">{ep.urduTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* E-books Results */}
              {(selectedFilter === 'all' || selectedFilter === 'ebooks') && filteredEbooks.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#173F35] tracking-wider mb-2">
                    E-Books ({filteredEbooks.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEbooks.map((eb) => (
                      <div
                        key={eb.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('ebooks');
                        }}
                        className="p-3 bg-white rounded-lg border border-[#EEE8D8] hover:border-[#173F35] hover:bg-[#FAF7F0] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="text-sm font-semibold text-[#173F35] block">{eb.title}</span>
                          <span className="text-xs text-[#6B6B6B]">{eb.author} · {eb.category}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#173F35]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
