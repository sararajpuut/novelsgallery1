import React from 'react';
import { 
  BookOpen, Star, Sparkles, ChevronRight, Lock, 
  ArrowRight, Clock, Feather, Compass, Award 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NovelCard } from '../components/common/NovelCard';
import { AuthorCard } from '../components/common/AuthorCard';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface HomePageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { 
    novels, 
    authors, 
    episodes, 
    ebooks, 
    classicalWorks, 
    siteSettings,
    openPurchaseModal 
  } = useStore();

  // Find featured hero novel
  const heroNovel = novels.find(n => n.id === siteSettings.heroNovelId) || novels[0];

  const featuredNovels = novels.filter(n => n.isFeatured).slice(0, 4);
  const latestNovels = [...novels].reverse().slice(0, 4);
  const popularNovels = [...novels].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4);
  const premiumNovels = novels.filter(n => n.isPremium).slice(0, 3);
  const featuredAuthors = authors.filter(a => a.isFeatured).slice(0, 3);
  const latestEpisodes = episodes.slice(0, 4);
  const classicalPreview = classicalWorks.slice(0, 3);
  const ebooksPreview = ebooks.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. LITERARY HERO SECTION */}
      <section className="relative bg-[#173F35] text-[#F8F4EA] overflow-hidden border-b-4 border-[#C8A45D]">
        {/* Subtle decorative background blend */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/images/hero_library_urdu_1791359887842.jpg')` }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Brand & Hero Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#12322a] border border-[#C8A45D]/40 text-xs font-semibold text-[#C8A45D]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Urdu Literature & Digital Library</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F4EA] leading-tight">
                  Welcome to <span className="text-[#C8A45D] italic">Novels Gallery</span>
                </h1>
                <p className="font-urdu text-xl sm:text-2xl text-[#C8A45D] font-medium leading-relaxed">
                  {siteSettings.urduTagline}
                </p>
              </div>

              <p className="text-base text-[#F8F4EA]/85 max-w-xl leading-relaxed">
                Step into Pakistan and South Asia’s premier digital sanctum for Urdu novels, timeless classical literature, weekly episodic releases, and celebrated literary giants. Read in authentic Nastaliq script with distraction-free comfort.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('reader', { novelId: heroNovel.id })}
                  className="px-6 py-3 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-sm rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Featured Novel</span>
                </button>
                <button
                  onClick={() => navigate('novels')}
                  className="px-6 py-3 bg-[#12322a] hover:bg-[#0e2721] text-[#F8F4EA] border border-[#C8A45D]/40 font-semibold text-sm rounded-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#C8A45D]" />
                  <span>Explore Complete Library</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="pt-6 border-t border-[#F8F4EA]/15 flex items-center gap-6 sm:gap-10 text-xs text-[#F8F4EA]/80">
                <div>
                  <span className="font-serif-display text-lg font-bold text-[#C8A45D] block tabular-nums">
                    {novels.length * 12}+
                  </span>
                  <span>Episodes Available</span>
                </div>
                <div className="border-l border-[#F8F4EA]/20 pl-6 sm:pl-10">
                  <span className="font-serif-display text-lg font-bold text-[#C8A45D] block tabular-nums">
                    100% Free
                  </span>
                  <span>Classical Archive</span>
                </div>
                <div className="border-l border-[#F8F4EA]/20 pl-6 sm:pl-10">
                  <span className="font-serif-display text-lg font-bold text-[#C8A45D] block tabular-nums">
                    Nastaliq
                  </span>
                  <span>RTL Reading Mode</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Spotlight Novel Book Card */}
            {heroNovel && (
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-[#12322a] border-2 border-[#C8A45D]/50 rounded-xl p-5 shadow-2xl relative">
                  <div className="absolute -top-3 right-6 bg-[#C8A45D] text-[#173F35] font-bold text-[11px] px-3 py-0.5 rounded uppercase tracking-wider">
                    Editor's Selection
                  </div>

                  <div className="flex gap-4">
                    <div className="w-32 aspect-[3/4] rounded-md overflow-hidden bg-[#EEE8D8] border border-[#C8A45D]/30 shrink-0 shadow-md">
                      <img
                        src={heroNovel.coverUrl}
                        alt={heroNovel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-[#C8A45D] font-medium block">
                          {heroNovel.genre}
                        </span>
                        <h3 className="font-serif-display text-base font-bold text-white mt-0.5">
                          {heroNovel.title}
                        </h3>
                        <p className="font-urdu text-sm text-[#C8A45D] mt-0.5 font-semibold text-right">
                          {heroNovel.urduTitle}
                        </p>
                        <p className="text-xs text-[#F8F4EA]/70 mt-1">
                          By {heroNovel.authorName}
                        </p>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-1 text-xs text-[#C8A45D]">
                          <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                          <span className="font-bold tabular-nums">{heroNovel.rating.toFixed(2)}</span>
                          <span className="text-[#F8F4EA]/50">({heroNovel.totalReviews} ratings)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#F8F4EA]/80 mt-4 line-clamp-3 leading-relaxed border-t border-[#F8F4EA]/15 pt-3">
                    {heroNovel.synopsis}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate('reader', { novelId: heroNovel.id })}
                      className="flex-1 py-2 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-xs font-bold rounded transition-colors text-center cursor-pointer"
                    >
                      Read Episode 1
                    </button>
                    <button
                      onClick={() => navigate('novel-detail', { id: heroNovel.id })}
                      className="py-2 px-3 border border-[#C8A45D]/40 text-xs font-semibold text-[#F8F4EA] hover:bg-white/10 rounded transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ADSTERRA LEADERBOARD BANNER (728x90 Desktop / 320x50 Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResponsiveAdBanner />
      </div>

      {/* 2. FEATURED NOVELS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#173F35]/15 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C8A45D]">
              Curated Selections
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
              Featured Urdu Novels
            </h2>
          </div>
          <button
            onClick={() => navigate('novels', { filter: 'featured' })}
            className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Novels</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onSelect={(id) => navigate('novel-detail', { id })}
              onReadNow={(id) => navigate('reader', { novelId: id })}
            />
          ))}
        </div>
      </section>

      {/* ADSTERRA SMARTLINK PROMO BANNER (Unit 31602909) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartlinkCTA 
          title="Explore Exclusive Literary Perks & Recommended Stories" 
          subtitle="اسپانسرڈ پارٹنر لنکس — خصوصی کہانیاں اور مفت آفرز وزٹ کریں"
        />
      </div>

      {/* 3. LATEST EPISODES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EEE8D8] rounded-xl p-6 sm:p-8 border border-[#173F35]/15">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#4A3025]">
                Fresh Chapters
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
                Latest Released Episodes
              </h2>
            </div>
            <button
              onClick={() => navigate('episodes')}
              className="text-xs font-semibold text-[#173F35] hover:text-[#4A3025] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>All Episodes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestEpisodes.map((ep) => {
              const novel = novels.find(n => n.id === ep.novelId);
              return (
                <div
                  key={ep.id}
                  onClick={() => navigate('reader', { novelId: ep.novelId, episodeId: ep.id })}
                  className="bg-white rounded-lg p-4 border border-[#173F35]/10 shadow-xs hover:shadow-md hover:border-[#173F35] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
                      <span className="font-medium text-[#173F35]">{novel?.title || 'Urdu Novel'}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {ep.readTimeMinutes} min
                      </span>
                    </div>

                    <h4 className="font-serif-display text-sm font-bold text-[#252525] line-clamp-1">
                      {ep.title}
                    </h4>

                    <p className="font-urdu text-sm text-[#4A3025] font-semibold mt-1 text-right line-clamp-1">
                      {ep.urduTitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between text-xs">
                    <span className="text-[#6B6B6B]">{ep.publishedDate}</span>
                    <span className="font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1">
                      Read Episode
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. POPULAR NOVELS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#173F35]/15 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C8A45D]">
              Reader Favorites
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
              Most Read Urdu Novels
            </h2>
          </div>
          <button
            onClick={() => navigate('novels', { sort: 'popular' })}
            className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Browse All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onSelect={(id) => navigate('novel-detail', { id })}
              onReadNow={(id) => navigate('reader', { novelId: id })}
            />
          ))}
        </div>
      </section>

      {/* ADSTERRA NATIVE BANNER WIDGET (Unit 31602911) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NativeBannerAd />
      </div>

      {/* 5. LUXURIOUS PREMIUM NOVELS SECTION */}
      <section className="bg-gradient-to-br from-[#173F35] via-[#12322a] to-[#4A3025] text-[#F8F4EA] py-14 border-y-2 border-[#C8A45D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#C8A45D]/30 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] text-xs font-semibold text-[#C8A45D] mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Novels Gallery VIP Vault</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Premium & Exclusive Editions
              </h2>
              <p className="text-xs text-[#F8F4EA]/75 mt-1 max-w-lg">
                Support original Urdu novelists and gain lifetime access to complete uncensored editions, author commentary, and early episode access.
              </p>
            </div>
            <button
              onClick={() => navigate('premium')}
              className="px-4 py-2 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-xs font-bold rounded transition-colors self-start md:self-auto cursor-pointer"
            >
              Explore All Premium Content
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumNovels.map((novel) => (
              <div
                key={novel.id}
                className="bg-[#173F35]/80 backdrop-blur-md rounded-xl border border-[#C8A45D]/40 p-5 flex flex-col justify-between hover:border-[#C8A45D] transition-all"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-4 border border-[#C8A45D]/30">
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#C8A45D] text-[#173F35] font-bold text-xs px-2.5 py-1 rounded shadow-md">
                      PKR {novel.price}
                    </div>
                  </div>

                  <span className="text-xs text-[#C8A45D] font-medium block">{novel.genre}</span>
                  <h3 className="font-serif-display text-lg font-bold text-white mt-1">
                    {novel.title}
                  </h3>
                  <p className="font-urdu text-sm text-[#C8A45D] font-semibold text-right mt-1">
                    {novel.urduTitle}
                  </p>
                  <p className="text-xs text-[#F8F4EA]/75 mt-2 line-clamp-2">
                    {novel.synopsis}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#C8A45D]/20 flex gap-2">
                  <button
                    onClick={() => openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price })}
                    className="flex-1 py-2.5 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Unlock Edition
                  </button>
                  <button
                    onClick={() => navigate('novel-detail', { id: novel.id })}
                    className="py-2.5 px-3 border border-[#C8A45D]/40 text-xs text-[#F8F4EA] hover:bg-white/10 rounded transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED AUTHORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#173F35]/15 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C8A45D]">
              Masters of the Pen
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
              Renowned Urdu Novelists
            </h2>
          </div>
          <button
            onClick={() => navigate('authors')}
            className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Authors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAuthors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              onSelect={(id) => navigate('author-detail', { id })}
            />
          ))}
        </div>
      </section>

      {/* 7. CLASSICAL URDU LITERATURE ARCHIVE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#173F35]/15 rounded-xl bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-[#EEE8D8] gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A3025] uppercase tracking-wider">
                <Feather className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Public Domain Archive</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
                Classical Urdu Literature
              </h2>
            </div>
            <button
              onClick={() => navigate('classical')}
              className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Explore Ghazals & Afsanay</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classicalPreview.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('classical')}
                className="bg-[#F8F4EA] rounded-lg p-5 border border-[#173F35]/10 hover:border-[#173F35] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
                    <span className="font-semibold text-[#173F35]">{item.category}</span>
                    <span>{item.era}</span>
                  </div>

                  <h3 className="font-serif-display text-base font-bold text-[#173F35]">
                    {item.title}
                  </h3>
                  <p className="font-urdu text-sm text-[#4A3025] font-semibold mt-1 text-right">
                    {item.urduTitle}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-1 font-medium">
                    By {item.author} ({item.urduAuthor})
                  </p>

                  <div className="mt-4 p-3 bg-white rounded border border-[#EEE8D8]">
                    <p className="urdu-reading-text text-sm text-[#252525] line-clamp-3 leading-loose">
                      {item.contentUrdu}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between text-xs font-semibold text-[#173F35]">
                  <span>Read Full Classic</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A45D]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FEATURED E-BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#173F35]/15 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C8A45D]">
              Digital Formats
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-0.5">
              Urdu E-Books
            </h2>
          </div>
          <button
            onClick={() => navigate('ebooks')}
            className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All E-Books</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ebooksPreview.map((eb) => (
            <div
              key={eb.id}
              className="bg-white rounded-lg border border-[#173F35]/15 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className="w-24 aspect-[3/4] bg-[#EEE8D8] rounded overflow-hidden border border-[#173F35]/10 shrink-0">
                  <img
                    src={eb.coverUrl}
                    alt={eb.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-[#C8A45D] font-medium block">
                    {eb.category}
                  </span>
                  <h3 className="font-serif-display text-sm font-bold text-[#173F35] truncate mt-0.5">
                    {eb.title}
                  </h3>
                  <p className="font-urdu text-xs text-[#4A3025] font-semibold text-right mt-0.5">
                    {eb.urduTitle}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    {eb.author} · {eb.pages} pages
                  </p>
                  <div className="mt-2 text-xs font-bold text-[#173F35]">
                    {eb.isPremium ? `PKR ${eb.price}` : 'Free E-Book'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between">
                <button
                  onClick={() => navigate('ebooks')}
                  className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] cursor-pointer"
                >
                  Read Online
                </button>
                <span className="text-[11px] text-[#6B6B6B]">{eb.fileSize}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
