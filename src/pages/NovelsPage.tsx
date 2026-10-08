import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, SlidersHorizontal, RotateCcw, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NovelCard } from '../components/common/NovelCard';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';

interface NovelsPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
  initialFilter?: string;
  initialSort?: string;
}

export const NovelsPage: React.FC<NovelsPageProps> = ({ navigate, initialFilter, initialSort }) => {
  const { novels, authors } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>(initialFilter === 'premium' ? 'premium' : 'all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'pdf'>('all');
  const [sortBy, setSortBy] = useState<string>(initialSort || 'popular');

  // Extract unique genres
  const genres = useMemo(() => {
    const list = Array.from(new Set(novels.map(n => n.genre)));
    return ['all', ...list];
  }, [novels]);

  // Filtering & Sorting
  const filteredNovels = useMemo(() => {
    return novels.filter(n => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q) || n.urduTitle.includes(q);
        const matchesAuthor = n.authorName.toLowerCase().includes(q);
        const matchesGenre = n.genre.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesGenre) return false;
      }

      // Genre
      if (selectedGenre !== 'all' && n.genre !== selectedGenre) return false;

      // Author
      if (selectedAuthor !== 'all' && n.authorId !== selectedAuthor) return false;

      // Status
      if (selectedStatus !== 'all' && n.status !== selectedStatus) return false;

      // Pricing
      if (selectedPricing === 'free' && n.isPremium) return false;
      if (selectedPricing === 'premium' && !n.isPremium) return false;

      // Format (PDF Available)
      if (selectedFormat === 'pdf' && !(n.hasPdf || n.googleDriveUrl || n.pdfUrl)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
      if (sortBy === 'latest') return parseInt(b.publicationDate || '0') - parseInt(a.publicationDate || '0');
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [novels, searchQuery, selectedGenre, selectedAuthor, selectedStatus, selectedPricing, selectedFormat, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedAuthor('all');
    setSelectedStatus('all');
    setSelectedPricing('all');
    setSelectedFormat('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#173F35]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
            Urdu Digital Archive
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35] mt-1">
            Urdu Novels Library
          </h1>
          <p className="font-urdu text-base text-[#4A3025] font-semibold mt-1">
            اردو ناولز، سلسلہ وار اقساط اور کلاسیکی شاہکار
          </p>
        </div>
        <div className="text-xs text-[#6B6B6B] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#173F35]" />
          <span>Showing <strong className="text-[#173F35] tabular-nums">{filteredNovels.length}</strong> of <strong className="tabular-nums">{novels.length}</strong> novels</span>
        </div>
      </div>

      {/* ADSTERRA LEADERBOARD / MOBILE BANNER */}
      <ResponsiveAdBanner />

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-5 rounded-xl border border-[#173F35]/15 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, writer, or genre..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            >
              <option value="all">All Genres</option>
              {genres.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            >
              <option value="all">All Authors</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.urduName})</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            >
              <option value="popular">Sort by: Most Popular</option>
              <option value="latest">Sort by: Publication Year</option>
              <option value="rating">Sort by: Highest Rated</option>
              <option value="title">Sort by: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Secondary Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EEE8D8]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#6B6B6B] font-medium mr-1">Access:</span>
            {['all', 'free', 'premium'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPricing(p)}
                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors cursor-pointer ${
                  selectedPricing === p
                    ? 'bg-[#173F35] text-white font-medium'
                    : 'bg-[#EEE8D8] text-[#4A3025] hover:bg-[#e4ddcc]'
                }`}
              >
                {p === 'all' ? 'All Editions' : p}
              </button>
            ))}

            <span className="text-xs text-[#6B6B6B] font-medium ml-3 mr-1">Status:</span>
            {['all', 'Completed', 'Ongoing'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  selectedStatus === s
                    ? 'bg-[#173F35] text-white font-medium'
                    : 'bg-[#EEE8D8] text-[#4A3025] hover:bg-[#e4ddcc]'
                }`}
              >
                {s === 'all' ? 'All Statuses' : s}
              </button>
            ))}

            <span className="text-xs text-[#6B6B6B] font-medium ml-3 mr-1">Format:</span>
            <button
              onClick={() => setSelectedFormat(selectedFormat === 'pdf' ? 'all' : 'pdf')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedFormat === 'pdf'
                  ? 'bg-[#173F35] text-[#C8A45D] font-bold shadow-xs'
                  : 'bg-[#EEE8D8] text-[#4A3025] hover:bg-[#e4ddcc]'
              }`}
            >
              <FileText className="w-3 h-3 text-[#C8A45D]" />
              <span>PDF Available ({novels.filter(n => n.hasPdf || n.googleDriveUrl || n.pdfUrl).length})</span>
            </button>
          </div>

          {(searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all' || selectedStatus !== 'all' || selectedPricing !== 'all' || selectedFormat !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Novel Cards Grid */}
      {filteredNovels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#173F35]/15 space-y-3">
          <BookOpen className="w-10 h-10 text-[#173F35]/40 mx-auto" />
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            No Novels Match Your Search Criteria
          </h3>
          <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
            Try adjusting your genre, author, or keyword filters to browse other titles in our library.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-[#173F35] text-[#F8F4EA] text-xs font-semibold rounded-md hover:bg-[#12322a] cursor-pointer"
          >
            Show All Novels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onSelect={(id) => navigate('novel-detail', { id })}
              onReadNow={(id) => navigate('reader', { novelId: id })}
            />
          ))}
        </div>
      )}

      {/* ADSTERRA NATIVE BANNER (Unit 31602911) */}
      <NativeBannerAd />
    </div>
  );
};
