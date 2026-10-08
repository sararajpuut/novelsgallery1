import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Users, Star, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NovelCard } from '../components/common/NovelCard';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';

interface AuthorDetailPageProps {
  authorId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const AuthorDetailPage: React.FC<AuthorDetailPageProps> = ({ authorId, navigate }) => {
  const { authors, novels, ebooks } = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'ongoing' | 'premium' | 'ebooks'>('all');

  const author = authors.find(a => a.id === authorId) || authors[0];
  const authorNovels = novels.filter(n => n.authorId === author?.id);
  const authorEbooks = ebooks.filter(eb => eb.authorId === author?.id || eb.author.toLowerCase().includes(author?.name.toLowerCase() || ''));

  if (!author) return null;

  const filteredNovels = authorNovels.filter(n => {
    if (filterTab === 'completed') return n.status === 'Completed';
    if (filterTab === 'ongoing') return n.status === 'Ongoing';
    if (filterTab === 'premium') return n.isPremium;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <button
        onClick={() => navigate('authors')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Authors Directory</span>
      </button>

      {/* Author Bio Header Card */}
      <div className="bg-white rounded-xl border border-[#173F35]/15 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#EEE8D8] border-4 border-[#C8A45D]/40 shadow-md shrink-0">
            <img
              src={author.photoUrl}
              alt={author.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35]">
              <Award className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Distinguished Urdu Author</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35]">
              {author.name}
            </h1>

            <p className="font-urdu text-2xl text-[#4A3025] font-bold">
              {author.urduName}
            </p>

            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-[#6B6B6B] pt-1">
              <span className="flex items-center gap-1 text-[#173F35] font-medium">
                <BookOpen className="w-4 h-4" />
                <span className="tabular-nums">{authorNovels.length} Novels in Library</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-[#4A3025]">
                <Users className="w-4 h-4" />
                <span className="tabular-nums">{(author.followersCount / 1000).toFixed(0)}k Readers</span>
              </span>
            </div>

            <p className="text-sm text-[#252525] leading-relaxed pt-2">
              {author.bio}
            </p>

            <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8] mt-3">
              <p className="font-urdu text-base text-[#4A3025] font-semibold text-right leading-loose">
                {author.urduBio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADSTERRA LEADERBOARD / MOBILE BANNER */}
      <ResponsiveAdBanner />

      {/* Author Catalog Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#173F35]/15 gap-4">
          <div>
            <h2 className="font-serif-display text-2xl font-bold text-[#173F35]">
              Published Works & Bibliography
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Explore novels, ongoing series, and digital publications by {author.name}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#EEE8D8] p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterTab === 'all' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
            >
              All Works ({authorNovels.length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterTab === 'completed' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterTab('premium')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterTab === 'premium' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
            >
              Premium Editions
            </button>
            {authorEbooks.length > 0 && (
              <button
                onClick={() => setFilterTab('ebooks')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterTab === 'ebooks' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#4A3025] hover:text-[#173F35]'
                }`}
              >
                E-Books ({authorEbooks.length})
              </button>
            )}
          </div>
        </div>

        {filterTab === 'ebooks' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authorEbooks.map(eb => (
              <div key={eb.id} className="bg-white rounded-lg p-5 border border-[#173F35]/15 shadow-xs">
                <h4 className="font-serif-display text-base font-bold text-[#173F35]">{eb.title}</h4>
                <p className="font-urdu text-sm text-[#4A3025] text-right mt-1">{eb.urduTitle}</p>
                <p className="text-xs text-[#6B6B6B] mt-2">{eb.description}</p>
              </div>
            ))}
          </div>
        ) : filteredNovels.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6B6B6B] bg-white rounded-xl border">
            No novels found in this specific category for this author.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNovels.map(novel => (
              <NovelCard
                key={novel.id}
                novel={novel}
                onSelect={(id) => navigate('novel-detail', { id })}
                onReadNow={(id) => navigate('reader', { novelId: id })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
