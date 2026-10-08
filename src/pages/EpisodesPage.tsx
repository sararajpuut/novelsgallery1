import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, Lock, ArrowRight, Search, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';

interface EpisodesPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const EpisodesPage: React.FC<EpisodesPageProps> = ({ navigate }) => {
  const { episodes, novels, authors } = useStore();
  const [selectedNovel, setSelectedNovel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep => {
      if (selectedNovel !== 'all' && ep.novelId !== selectedNovel) return false;
      if (pricingFilter === 'free' && ep.isPremium) return false;
      if (pricingFilter === 'premium' && !ep.isPremium) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const novel = novels.find(n => n.id === ep.novelId);
        const matchesTitle = ep.title.toLowerCase().includes(q) || ep.urduTitle.includes(q);
        const matchesNovel = novel ? novel.title.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesNovel) return false;
      }
      return true;
    });
  }, [episodes, novels, selectedNovel, pricingFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#173F35]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
            Chronological Archive
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35] mt-1">
            Episodes & Chapters Directory
          </h1>
          <p className="font-urdu text-base text-[#4A3025] font-semibold mt-1">
            تمام اردو ناولز کی سلسلہ وار اور تازہ ترین اقساط
          </p>
        </div>
        <div className="text-xs text-[#6B6B6B]">
          Showing <strong className="text-[#173F35] tabular-nums">{filteredEpisodes.length}</strong> chapters
        </div>
      </div>

      {/* ADSTERRA 468x60 BANNER (Unit 31602912) & Mobile 320x50 */}
      <div className="flex justify-center">
        <div className="hidden sm:flex">
          <AdsterraBanner type="468x60" />
        </div>
        <div className="flex sm:hidden">
          <AdsterraBanner type="320x50" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#173F35]/15 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search episode or novel title..."
            className="w-full pl-9 pr-3 py-2 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
          />
        </div>

        {/* Filter by Novel */}
        <div>
          <select
            value={selectedNovel}
            onChange={(e) => setSelectedNovel(e.target.value)}
            className="w-full py-2 px-3 bg-[#F8F4EA] border border-[#173F35]/15 rounded-md text-xs text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
          >
            <option value="all">All Novels</option>
            {novels.map(n => (
              <option key={n.id} value={n.id}>{n.title} ({n.urduTitle})</option>
            ))}
          </select>
        </div>

        {/* Access Type */}
        <div className="flex items-center gap-1.5">
          {(['all', 'free', 'premium'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPricingFilter(p)}
              className={`flex-1 py-2 text-xs rounded-md capitalize font-medium transition-colors cursor-pointer ${
                pricingFilter === p ? 'bg-[#173F35] text-white' : 'bg-[#EEE8D8] text-[#4A3025] hover:bg-[#e4ddcc]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes Table / List */}
      <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
        <div className="divide-y divide-[#EEE8D8]">
          {filteredEpisodes.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6B6B6B]">
              No episodes found matching your filter criteria.
            </div>
          ) : (
            filteredEpisodes.map((ep) => {
              const novel = novels.find(n => n.id === ep.novelId);
              return (
                <div
                  key={ep.id}
                  onClick={() => navigate('reader', { novelId: ep.novelId, episodeId: ep.id })}
                  className="p-5 hover:bg-[#F8F4EA] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#173F35] text-[#C8A45D] font-bold text-sm flex items-center justify-center shrink-0 tabular-nums border border-[#C8A45D]/40">
                      {ep.episodeNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-1">
                        <span className="font-semibold text-[#173F35]">{novel?.title}</span>
                        <span aria-hidden="true">·</span>
                        <span>By {novel?.authorName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ep.readTimeMinutes} min
                        </span>
                      </div>

                      <h3 className="font-serif-display text-base font-bold text-[#252525]">
                        {ep.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <span className="font-urdu text-base font-semibold text-[#4A3025]">
                      {ep.urduTitle}
                    </span>

                    <div className="flex items-center gap-3">
                      {ep.isPremium ? (
                        <span className="px-2.5 py-1 bg-[#173F35] text-[#C8A45D] text-xs font-semibold rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B6B6B]">{ep.publishedDate}</span>
                      )}

                      <button className="px-3 py-1.5 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
