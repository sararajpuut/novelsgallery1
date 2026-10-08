import React, { useState } from 'react';
import { 
  Star, Heart, Share2, BookOpen, Clock, Lock, 
  ArrowRight, ArrowUpDown, ChevronRight, CheckCircle2, User,
  FileText, Download, ShieldCheck, Sparkles, ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NovelCard } from '../components/common/NovelCard';
import { ShareModal } from '../components/common/ShareModal';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { 
  isPdfOnlineReadingEnabled, 
  isPdfDownloadEnabled, 
  triggerPdfDownload 
} from '../utils/pdfHelper';

interface NovelDetailPageProps {
  novelId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const NovelDetailPage: React.FC<NovelDetailPageProps> = ({ novelId, navigate }) => {
  const { 
    novels, 
    episodes, 
    authors, 
    isFavorite, 
    toggleFavorite, 
    hasPurchased, 
    openPurchaseModal,
    openPdfReader,
    readingHistory 
  } = useStore();

  const [episodesSortOrder, setEpisodesSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string>('');

  const novel = novels.find(n => n.id === novelId) || novels[0];
  const author = authors.find(a => a.id === novel?.authorId);
  const novelEpisodes = episodes
    .filter(ep => ep.novelId === novel?.id)
    .sort((a, b) => episodesSortOrder === 'asc' ? a.episodeNumber - b.episodeNumber : b.episodeNumber - a.episodeNumber);

  // Check reading progress
  const currentProgress = readingHistory.find(h => h.novelId === novel?.id);

  // Related novels
  const moreByAuthor = novels.filter(n => n.authorId === novel?.authorId && n.id !== novel?.id).slice(0, 3);
  const relatedNovels = novels.filter(n => n.genre === novel?.genre && n.id !== novel?.id && n.authorId !== novel?.authorId).slice(0, 3);

  const favorited = isFavorite(novel?.id || '');
  const purchased = hasPurchased('novel', novel?.id || '');

  if (!novel) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* 1. HERO PRODUCT DETAIL MODULE */}
      <div className="bg-white rounded-xl border border-[#173F35]/15 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cover Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#EEE8D8] border border-[#173F35]/15 shadow-md">
              <img
                src={novel.coverUrl}
                alt={novel.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {novel.isPremium && (
                <div className="absolute top-3 left-3 bg-[#173F35] text-[#C8A45D] text-xs font-semibold px-2.5 py-1 rounded border border-[#C8A45D]/40 flex items-center gap-1 shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                  {purchased ? 'Unlocked Edition' : `PKR ${novel.price}`}
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Quiet unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6B6B] mb-2">
                <button
                  onClick={() => author && navigate('author-detail', { id: author.id })}
                  className="text-[#173F35] font-semibold hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  {novel.authorName}
                </button>
                <span aria-hidden="true">·</span>
                <span>{novel.genre}</span>
                <span aria-hidden="true">·</span>
                <span>Status: {novel.status}</span>
                <span aria-hidden="true">·</span>
                <span>Published: {novel.publicationDate}</span>
              </div>

              <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35]">
                {novel.title}
              </h1>

              <p className="font-urdu text-2xl text-[#4A3025] font-bold mt-2 text-right">
                {novel.urduTitle}
              </p>

              {/* Rating & Stats */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#EEE8D8] text-xs">
                <div className="flex items-center gap-1.5 text-[#173F35]">
                  <Star className="w-4 h-4 fill-[#C8A45D] text-[#C8A45D]" />
                  <span className="font-bold text-sm tabular-nums">{novel.rating.toFixed(2)}</span>
                  <span className="text-[#6B6B6B]">({novel.totalReviews} reviews)</span>
                </div>
                <span className="text-[#EEE8D8]">|</span>
                <div className="text-[#6B6B6B]">
                  <strong className="text-[#173F35] tabular-nums">{novel.episodesCount}</strong> Total Episodes
                </div>
                <span className="text-[#EEE8D8]">|</span>
                <div className="text-[#6B6B6B]">
                  <strong className="text-[#173F35] tabular-nums">{(novel.viewsCount / 1000).toFixed(0)}k</strong> Readers
                </div>
              </div>

              {/* Reading Progress banner if exists */}
              {currentProgress && (
                <div className="mt-4 p-3 bg-[#F8F4EA] border border-[#C8A45D]/40 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#173F35]">Your Reading Progress: </span>
                    <span className="text-[#4A3025]">Episode {currentProgress.episodeNumber} ({currentProgress.progressPercent}%)</span>
                  </div>
                  <button
                    onClick={() => navigate('reader', { novelId: novel.id, episodeId: currentProgress.episodeId })}
                    className="font-bold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1"
                  >
                    Resume
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Synopsis */}
              <div className="mt-6 space-y-3">
                <h3 className="font-serif-display text-sm uppercase tracking-wider font-bold text-[#173F35]">
                  Synopsis & Story Overview
                </h3>
                <p className="text-sm text-[#252525] leading-relaxed">
                  {novel.synopsis}
                </p>
                <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8] mt-3">
                  <p className="urdu-reading-text text-base text-[#4A3025] font-semibold leading-loose">
                    {novel.urduSynopsis}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#EEE8D8] flex flex-wrap items-center gap-3">
              {novel.isPremium && !purchased ? (
                <button
                  onClick={() => openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price })}
                  className="px-6 py-3 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-sm rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Full Edition (PKR {novel.price})</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('reader', { novelId: novel.id, episodeId: novelEpisodes[0]?.id })}
                  className="px-6 py-3 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-bold text-sm rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Reading Episode 1</span>
                </button>
              )}

              {/* PDF SYSTEM: Read Online Button */}
              {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && isPdfOnlineReadingEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => {
                    if (novel.isPremium && !purchased) {
                      openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price });
                    } else {
                      openPdfReader(novel);
                    }
                  }}
                  className="px-5 py-3 bg-white hover:bg-[#EEE8D8] text-[#173F35] border border-[#173F35]/30 hover:border-[#173F35] font-bold text-sm rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Read Complete Book in PDF Viewer"
                >
                  <FileText className="w-4 h-4 text-[#C8A45D]" />
                  <span>Read Online (PDF)</span>
                </button>
              )}

              {/* PDF SYSTEM: Download PDF Button */}
              {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && isPdfDownloadEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => {
                    if (novel.isPremium && !purchased) {
                      openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price });
                    } else {
                      triggerPdfDownload(novel);
                      setDownloadToast(`Starting download for ${novel.pdfFileName || novel.title + '.pdf'}...`);
                      setTimeout(() => setDownloadToast(''), 4000);
                    }
                  }}
                  className="px-5 py-3 bg-[#173F35]/10 hover:bg-[#173F35]/20 text-[#173F35] border border-[#173F35]/25 font-bold text-sm rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Download Complete Novel in PDF format"
                >
                  <Download className="w-4 h-4 text-[#173F35]" />
                  <span>Download PDF {novel.pdfFileSize ? `(${novel.pdfFileSize})` : ''}</span>
                </button>
              )}

              <button
                onClick={() => toggleFavorite(novel.id)}
                className={`px-4 py-3 border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  favorited
                    ? 'bg-[#173F35] text-[#C8A45D] border-[#173F35]'
                    : 'bg-white text-[#4A3025] border-[#173F35]/20 hover:bg-[#EEE8D8]'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-[#C8A45D]' : ''}`} />
                <span>{favorited ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-3 border border-[#173F35]/20 bg-white hover:bg-[#EEE8D8] rounded-md text-xs font-semibold text-[#4A3025] flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Download Notification Toast */}
            {downloadToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadToast}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DEDICATED PDF EDITION FEATURE BOX */}
      {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && (
        <section className="bg-gradient-to-br from-[#173F35] to-[#0e2721] text-[#F8F4EA] rounded-xl p-6 sm:p-8 border border-[#C8A45D]/40 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#C8A45D] text-[#173F35] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <FileText className="w-3.5 h-3.5" />
                  Complete Book PDF
                </span>
                <span className="text-xs text-neutral-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {novel.pdfAccessMode === 'both' && 'Online Reading & Download'}
                  {novel.pdfAccessMode === 'online_only' && 'Online Reading Only'}
                  {novel.pdfAccessMode === 'download_only' && 'Download Only'}
                </span>
                {novel.googleDriveUrl && (
                  <span className="text-xs text-amber-200 bg-[#C8A45D]/20 px-2 py-0.5 rounded border border-[#C8A45D]/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Google Cloud Fast CDN
                  </span>
                )}
              </div>

              <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white">
                {novel.title} - Official Complete PDF Edition
              </h3>

              <p className="font-urdu text-base sm:text-lg text-amber-200">
                مکمل کتاب کا پی ڈی ایف نسخہ، کتابی لے آؤٹ اور خوبصورت نستعلیق طباعت کے ساتھ
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 pt-1">
                <span><strong>File:</strong> {novel.pdfFileName || `${novel.title}.pdf`}</span>
                <span>•</span>
                <span><strong>Size:</strong> {novel.pdfFileSize || '18.4 MB'}</span>
                <span>•</span>
                <span><strong>Length:</strong> {novel.pdfPages || 480} Pages</span>
                <span>•</span>
                <span><strong>Quality:</strong> High-Resolution 300 DPI</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              {isPdfOnlineReadingEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => {
                    if (novel.isPremium && !purchased) {
                      openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price });
                    } else {
                      openPdfReader(novel);
                    }
                  }}
                  className="px-6 py-3 bg-[#C8A45D] hover:bg-[#b8934c] text-[#173F35] font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Read Online (PDF Viewer)</span>
                </button>
              )}

              {isPdfDownloadEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => {
                    if (novel.isPremium && !purchased) {
                      openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price });
                    } else {
                      triggerPdfDownload(novel);
                      setDownloadToast(`Starting download for ${novel.pdfFileName || novel.title + '.pdf'}...`);
                      setTimeout(() => setDownloadToast(''), 4000);
                    }
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Directly</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ADSTERRA RESPONSIVE BANNER (728x90 Desktop / 320x50 Mobile) */}
      <ResponsiveAdBanner />

      {/* 2. EPISODES LIST MODULE */}
      <section className="bg-white rounded-xl border border-[#173F35]/15 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEE8D8] gap-4">
          <div>
            <h2 className="font-serif-display text-2xl font-bold text-[#173F35]">
              Episodes & Chapters ({novelEpisodes.length})
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Browse published chapters in chronological reading sequence
            </p>
          </div>

          <button
            onClick={() => setEpisodesSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 border border-[#173F35]/20 rounded-md text-xs font-medium text-[#173F35] hover:bg-[#EEE8D8] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Order: {episodesSortOrder === 'asc' ? 'Oldest to Newest' : 'Newest to Oldest'}</span>
          </button>
        </div>

        {/* 468x60 Banner above episodes */}
        <div className="hidden sm:flex justify-center my-4">
          <AdsterraBanner type="468x60" />
        </div>
        <div className="flex sm:hidden justify-center my-4">
          <AdsterraBanner type="320x50" />
        </div>

        <div className="divide-y divide-[#EEE8D8] mt-4">
          {novelEpisodes.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B6B6B]">
              No episodes published yet for this title. Check back soon!
            </div>
          ) : (
            novelEpisodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => navigate('reader', { novelId: novel.id, episodeId: ep.id })}
                className="py-4 hover:bg-[#F8F4EA] px-3 rounded-lg transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#173F35]/10 text-[#173F35] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                    {ep.episodeNumber}
                  </div>
                  <div>
                    <h4 className="font-serif-display text-sm font-bold text-[#252525]">
                      {ep.title}
                    </h4>
                    <p className="text-xs text-[#6B6B6B] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{ep.readTimeMinutes} min read</span>
                      <span aria-hidden="true">·</span>
                      <span>Published {ep.publishedDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-urdu text-sm font-semibold text-[#4A3025]">
                    {ep.urduTitle}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#173F35]">
                    {ep.isPremium && !purchased ? (
                      <span className="text-[#C8A45D] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Premium
                      </span>
                    ) : (
                      <span className="text-[#173F35] hover:text-[#C8A45D] flex items-center gap-0.5">
                        Read
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ADSTERRA NATIVE BANNER (Unit 31602911) */}
      <NativeBannerAd />

      {/* ADSTERRA SMARTLINK PROMOTION */}
      <SmartlinkCTA 
        title={`Read Bonus Stories & Special Editions Related to ${novel.title}`}
        subtitle="خصوصی بونس کہانیاں اور پارٹنر آفرز حاصل کرنے کے لیے کلک کریں"
      />

      {/* 3. AUTHOR PROFILE CALLOUT */}
      {author && (
        <section className="bg-[#EEE8D8] rounded-xl p-6 sm:p-8 border border-[#173F35]/15 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-[#C8A45D] shrink-0">
            <img
              src={author.photoUrl}
              alt={author.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider text-[#4A3025] font-bold">About the Author</span>
            <h3 className="font-serif-display text-xl font-bold text-[#173F35] mt-0.5">
              {author.name} <span className="font-urdu text-lg text-[#4A3025]">({author.urduName})</span>
            </h3>
            <p className="text-xs text-[#6B6B6B] mt-1.5 line-clamp-2">
              {author.bio}
            </p>
          </div>
          <button
            onClick={() => navigate('author-detail', { id: author.id })}
            className="px-5 py-2.5 bg-[#173F35] text-[#F8F4EA] rounded-md text-xs font-semibold hover:bg-[#12322a] whitespace-nowrap cursor-pointer"
          >
            View Author Profile
          </button>
        </section>
      )}

      {/* 4. MORE NOVELS BY THIS AUTHOR */}
      {moreByAuthor.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#173F35]/15 pb-3">
            <h3 className="font-serif-display text-xl font-bold text-[#173F35]">
              More Masterpieces by {novel.authorName}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreByAuthor.map(n => (
              <NovelCard
                key={n.id}
                novel={n}
                onSelect={(id) => navigate('novel-detail', { id })}
                onReadNow={(id) => navigate('reader', { novelId: id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. RELATED NOVELS IN THIS GENRE */}
      {relatedNovels.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#173F35]/15 pb-3">
            <h3 className="font-serif-display text-xl font-bold text-[#173F35]">
              Readers Also Explored in {novel.genre}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedNovels.map(n => (
              <NovelCard
                key={n.id}
                novel={n}
                onSelect={(id) => navigate('novel-detail', { id })}
                onReadNow={(id) => navigate('reader', { novelId: id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* ADSTERRA MULTI-FORMAT SPONSORED SHOWCASE (160x600, 300x250, 160x300) */}
      <section className="bg-white rounded-xl border border-[#173F35]/15 p-6 shadow-xs">
        <div className="border-b border-[#EEE8D8] pb-3 mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#173F35]">
            Featured Sponsors & Partner Displays · اسپانسرڈ اشتہارات
          </span>
          <span className="text-[10px] text-[#6B6B6B]/70 uppercase">Adsterra Network</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          <div className="flex flex-col items-center">
            <AdsterraBanner type="160x600" />
          </div>
          <div className="flex flex-col items-center">
            <AdsterraBanner type="300x250" />
            <div className="mt-4">
              <AdsterraBanner type="160x300" />
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={novel.title}
      />
    </div>
  );
};
