import React, { useState } from 'react';
import { Feather, BookOpen, Share2, Eye, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClassicalWork, ClassicalCategory } from '../types';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';

interface ClassicalPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const ClassicalPage: React.FC<ClassicalPageProps> = ({ navigate }) => {
  const { classicalWorks } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeReadingWork, setActiveReadingWork] = useState<ClassicalWork | null>(null);

  const categories = [
    'all',
    'Ghazals',
    'Urdu Poetry',
    'Afsanay',
    'Classical Urdu Novels',
    'Literary Articles'
  ];

  const filteredWorks = classicalWorks.filter(w => {
    if (selectedCategory === 'all') return true;
    return w.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#173F35]/15 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3025] uppercase tracking-wider mb-2">
          <Feather className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>Heritage Archive</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35]">
          Classical Urdu Literature
        </h1>
        <p className="font-urdu text-xl text-[#4A3025] font-semibold mt-1">
          کلاسیکی اردو شاعری، شاہکار غزلیات، اور لافانی افسانے
        </p>
        <p className="text-xs text-[#6B6B6B] mt-2 max-w-2xl leading-relaxed">
          Preserving historical, public-domain masterpieces by legends like Mirza Asadullah Khan Ghalib, Allama Muhammad Iqbal, Saadat Hasan Manto, and Mir Taqi Mir with authentic Nastaliq calligraphy typography.
        </p>
      </div>

      {/* ADSTERRA LEADERBOARD / MOBILE BANNER */}
      <ResponsiveAdBanner />

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-[#173F35]/15">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'bg-[#EEE8D8] text-[#4A3025] hover:bg-[#e4ddcc]'
            }`}
          >
            {cat === 'all' ? 'All Classical Works' : cat}
          </button>
        ))}
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredWorks.map((work) => (
          <article
            key={work.id}
            className="bg-white rounded-xl border border-[#173F35]/15 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6B6B6B] border-b border-[#EEE8D8] pb-3">
                <span className="font-semibold text-[#173F35]">{work.category}</span>
                <span>{work.era}</span>
              </div>

              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#173F35]">
                  {work.title}
                </h3>
                <p className="font-urdu text-lg font-bold text-[#4A3025] mt-1 text-right">
                  {work.urduTitle}
                </p>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  By <strong>{work.author}</strong> ({work.urduAuthor})
                </p>
              </div>

              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                {work.description}
              </p>

              {/* Sample Box */}
              <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8]">
                <p className="urdu-reading-text text-base text-[#252525] line-clamp-4 leading-loose whitespace-pre-line">
                  {work.contentUrdu}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EEE8D8] flex items-center justify-between">
              <span className="text-[11px] text-[#C8A45D] font-semibold">
                ✓ Public Domain Archive
              </span>
              <button
                onClick={() => setActiveReadingWork(work)}
                className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read Full Text</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ADSTERRA NATIVE BANNER (Unit 31602911) */}
      <NativeBannerAd />

      {/* Classical Reading Fullscreen Modal */}
      {activeReadingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-3xl rounded-xl shadow-2xl border border-[#C8A45D]/40 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#173F35] text-[#F8F4EA] p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#C8A45D] font-medium block">{activeReadingWork.era} · {activeReadingWork.category}</span>
                <h3 className="font-serif-display text-lg font-bold text-white">{activeReadingWork.title}</h3>
                <span className="font-urdu text-sm text-[#C8A45D]">{activeReadingWork.urduAuthor}</span>
              </div>
              <button onClick={() => setActiveReadingWork(null)} className="p-1 hover:bg-[#12322a] rounded text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="text-center border-b border-[#EEE8D8] pb-4">
                <h2 className="font-urdu text-2xl font-bold text-[#173F35]">{activeReadingWork.urduTitle}</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">از {activeReadingWork.urduAuthor} ({activeReadingWork.author})</p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-[#EEE8D8] shadow-xs">
                <div className="urdu-reading-text text-xl text-[#252525] leading-[2.8] whitespace-pre-line text-right">
                  {activeReadingWork.contentUrdu}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#EEE8D8] border-t border-[#173F35]/15 flex items-center justify-between text-xs">
              <span className="text-[#6B6B6B]">Heritage Literature Preserved by Novels Gallery</span>
              <button
                onClick={() => setActiveReadingWork(null)}
                className="px-4 py-1.5 bg-[#173F35] text-[#F8F4EA] font-semibold rounded cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
