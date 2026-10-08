import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Bookmark, Share2, 
  Settings2, Sun, Moon, Sparkles, Lock, 
  ChevronLeft, ChevronRight, CheckCircle2, BookOpen, List,
  FileText, Download
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShareModal } from '../components/common/ShareModal';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { 
  isPdfOnlineReadingEnabled, 
  isPdfDownloadEnabled, 
  triggerPdfDownload 
} from '../utils/pdfHelper';

interface ReaderPageProps {
  novelId: string;
  episodeId?: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({ novelId, episodeId, navigate }) => {
  const { 
    novels, 
    episodes, 
    canAccessEpisode, 
    openPurchaseModal, 
    saveBookmark, 
    bookmarks,
    updateReadingProgress,
    openPdfReader
  } = useStore();

  const novel = novels.find(n => n.id === novelId) || novels[0];
  const novelEpisodes = episodes
    .filter(e => e.novelId === novel?.id)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const activeEpisode = episodeId 
    ? novelEpisodes.find(e => e.id === episodeId) || novelEpisodes[0]
    : novelEpisodes[0];

  // Reader Customization State
  const [fontSize, setFontSize] = useState<number>(22);
  const [lineHeight, setLineHeight] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [readingWidth, setReadingWidth] = useState<'narrow' | 'medium' | 'wide'>('medium');
  const [readerTheme, setReaderTheme] = useState<'ivory' | 'light' | 'dark'>('ivory');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [bookmarkNotification, setBookmarkNotification] = useState<string>('');

  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Check access permissions
  const hasAccess = novel && activeEpisode ? canAccessEpisode(activeEpisode, novel) : true;

  // Next / Previous calculation
  const currentIndex = novelEpisodes.findIndex(e => e.id === activeEpisode?.id);
  const prevEpisode = currentIndex > 0 ? novelEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < novelEpisodes.length - 1 ? novelEpisodes[currentIndex + 1] : null;

  // Scroll Progress Listener & Auto-save
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        const bounded = Math.min(100, Math.max(0, current));
        setScrollProgress(bounded);

        if (novel && activeEpisode) {
          updateReadingProgress(novel.id, activeEpisode.id, activeEpisode.episodeNumber, bounded);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [novel, activeEpisode, updateReadingProgress]);

  // Scroll to top on episode change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeEpisode?.id]);

  const handleBookmarkParagraph = (index: number) => {
    if (novel && activeEpisode) {
      saveBookmark(novel.id, activeEpisode.id, index, `Bookmarked paragraph #${index + 1}`);
      setBookmarkNotification('Reading position saved!');
      setTimeout(() => setBookmarkNotification(''), 2500);
    }
  };

  if (!novel || !activeEpisode) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-sm text-[#6B6B6B]">Episode content not available.</p>
        <button
          onClick={() => navigate('novels')}
          className="px-4 py-2 bg-[#173F35] text-white text-xs font-semibold rounded"
        >
          Back to Novels
        </button>
      </div>
    );
  }

  // Paragraph splitting for Urdu content
  const paragraphs = activeEpisode.contentUrdu.split('\n\n').filter(p => p.trim());

  // Theme styling classes
  const themeClasses = {
    ivory: 'bg-[#F8F4EA] text-[#252525]',
    light: 'bg-white text-[#1a1a1a]',
    dark: 'bg-[#121A16] text-[#E0E7E3]',
  };

  const containerWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
  };

  const lineHeightStyles = {
    compact: 'leading-[2.2]',
    normal: 'leading-[2.6]',
    relaxed: 'leading-[3.0]',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses[readerTheme]}`}>
      {/* Sticky Reader Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#173F35]/15 z-50">
        <div 
          className="h-full bg-[#C8A45D] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Control Bar (Sticky) */}
      <nav className={`sticky top-0 z-40 border-b transition-colors ${
        readerTheme === 'dark' 
          ? 'bg-[#121A16]/95 border-[#173F35]/40 text-[#E0E7E3]' 
          : 'bg-[#F8F4EA]/95 border-[#173F35]/15 text-[#252525]'
      } backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between`}>
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('novel-detail', { id: novel.id })}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Back to Novel Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="font-serif-display text-sm font-bold truncate">
              {novel.title}
            </h2>
            <p className="text-[11px] text-[#C8A45D] truncate">
              Episode {activeEpisode.episodeNumber}: {activeEpisode.title}
            </p>
          </div>
        </div>

        {/* Right: Actions & Customizer */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PDF Mode Trigger */}
          {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && isPdfOnlineReadingEnabled(novel.pdfAccessMode) && (
            <button
              onClick={() => openPdfReader(novel)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#C8A45D]/15 hover:bg-[#C8A45D]/25 text-[#C8A45D] rounded-md transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer border border-[#C8A45D]/30"
              title="Open Complete Novel in Cloud PDF Reader"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full PDF Edition</span>
            </button>
          )}

          {/* Episode List Trigger */}
          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors flex items-center gap-1 text-xs cursor-pointer"
            title="Browse All Episodes"
          >
            <List className="w-4 h-4 text-[#C8A45D]" />
            <span className="hidden sm:inline">Episodes</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Reader Typography & Theme Settings"
          >
            <Settings2 className="w-4 h-4 text-[#C8A45D]" />
          </button>

          {/* Quick Bookmark Trigger */}
          <button
            onClick={() => handleBookmarkParagraph(0)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Bookmark Current Episode"
          >
            <Bookmark className="w-4 h-4 text-[#C8A45D]" />
          </button>

          {/* Share */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Share Episode"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Floating Reader Settings Panel */}
      {showSettings && (
        <div className="fixed top-14 right-4 z-50 w-72 bg-white text-[#252525] rounded-xl shadow-2xl border border-[#173F35]/20 p-4 space-y-4 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-[#173F35]">Reading Preferences</span>
            <button onClick={() => setShowSettings(false)} className="text-[#6B6B6B] hover:text-[#173F35]">✕</button>
          </div>

          {/* Theme Switcher */}
          <div>
            <label className="block text-[#6B6B6B] mb-1.5 font-medium">Page Background</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setReaderTheme('ivory')}
                className={`py-1.5 px-2 rounded border text-center transition-all ${
                  readerTheme === 'ivory' ? 'border-[#173F35] bg-[#F8F4EA] font-bold text-[#173F35]' : 'border-gray-200'
                }`}
              >
                Ivory Warm
              </button>
              <button
                onClick={() => setReaderTheme('light')}
                className={`py-1.5 px-2 rounded border text-center transition-all ${
                  readerTheme === 'light' ? 'border-[#173F35] bg-white font-bold text-[#173F35]' : 'border-gray-200'
                }`}
              >
                Clean White
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`py-1.5 px-2 rounded border text-center transition-all ${
                  readerTheme === 'dark' ? 'border-[#C8A45D] bg-[#121A16] text-[#C8A45D] font-bold' : 'border-gray-200'
                }`}
              >
                Dark Emerald
              </button>
            </div>
          </div>

          {/* Font Size Adjuster */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#6B6B6B] font-medium">Font Size (Urdu)</span>
              <span className="font-bold tabular-nums">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
                className="w-7 h-7 bg-[#EEE8D8] rounded font-bold hover:bg-[#e0d8c4]"
              >
                A-
              </button>
              <input
                type="range"
                min="16"
                max="36"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-[#173F35]"
              />
              <button
                onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
                className="w-7 h-7 bg-[#EEE8D8] rounded font-bold hover:bg-[#e0d8c4]"
              >
                A+
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-[#6B6B6B] mb-1.5 font-medium">Line Spacing</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'relaxed'] as const).map(lh => (
                <button
                  key={lh}
                  onClick={() => setLineHeight(lh)}
                  className={`py-1.5 px-2 rounded border capitalize text-center ${
                    lineHeight === lh ? 'bg-[#173F35] text-white font-bold' : 'bg-[#F8F4EA]'
                  }`}
                >
                  {lh}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Width */}
          <div>
            <label className="block text-[#6B6B6B] mb-1.5 font-medium">Reading Width</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['narrow', 'medium', 'wide'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => setReadingWidth(w)}
                  className={`py-1.5 px-2 rounded border capitalize text-center ${
                    readingWidth === w ? 'bg-[#173F35] text-white font-bold' : 'bg-[#F8F4EA]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Episode Drawer Modal */}
      {showEpisodeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#F8F4EA] text-[#252525] h-full shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#173F35]/20">
              <h3 className="font-serif-display text-base font-bold text-[#173F35]">
                {novel.title} Chapters
              </h3>
              <button onClick={() => setShowEpisodeDrawer(false)} className="p-1 hover:bg-[#EEE8D8] rounded text-[#4A3025]">✕</button>
            </div>

            <div className="divide-y divide-[#EEE8D8]">
              {novelEpisodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    navigate('reader', { novelId: novel.id, episodeId: ep.id });
                    setShowEpisodeDrawer(false);
                  }}
                  className={`w-full text-left py-3 px-2 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    ep.id === activeEpisode.id ? 'bg-[#173F35] text-white font-bold' : 'hover:bg-[#EEE8D8]'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Episode {ep.episodeNumber}: {ep.title}</span>
                    <span className={`block mt-0.5 font-urdu text-right ${ep.id === activeEpisode.id ? 'text-[#C8A45D]' : 'text-[#4A3025]'}`}>
                      {ep.urduTitle}
                    </span>
                  </div>
                  {ep.isPremium && <Lock className="w-3.5 h-3.5 text-[#C8A45D]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {bookmarkNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#173F35] text-[#F8F4EA] border border-[#C8A45D] px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
          <span>{bookmarkNotification}</span>
        </div>
      )}

      {/* Main Reading Container */}
      <main className={`mx-auto px-4 sm:px-6 py-10 ${containerWidthClasses[readingWidth]}`}>
        {/* Episode Header */}
        <header className="mb-10 text-center space-y-3 border-b border-[#C8A45D]/30 pb-8">
          <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-bold">
            Chapter {activeEpisode.episodeNumber} · {novel.title}
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold">
            {activeEpisode.title}
          </h1>
          <h2 className="font-urdu text-3xl sm:text-4xl font-bold text-[#C8A45D] pt-2">
            {activeEpisode.urduTitle}
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs opacity-70 pt-2">
            <span>By {novel.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{activeEpisode.readTimeMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span>Published {activeEpisode.publishedDate}</span>
          </div>
        </header>

        {/* Top Reading Ad Banner (728x90 Desktop / 320x50 Mobile) */}
        <div className="my-6">
          <ResponsiveAdBanner />
        </div>

        {/* Access Check: Premium Gate if locked */}
        {!hasAccess ? (
          <div className="my-12 p-8 sm:p-12 rounded-xl bg-gradient-to-br from-[#173F35] to-[#4A3025] text-[#F8F4EA] text-center border-2 border-[#C8A45D] space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] flex items-center justify-center mx-auto text-[#C8A45D]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-bold">
                Exclusive Content
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-white">
                This Episode is Part of the Premium Collection
              </h3>
              <p className="text-xs text-[#F8F4EA]/80 max-w-md mx-auto pt-1">
                Unlock lifetime access to read this chapter along with the author’s uncensored story arc and high-definition typography.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openPurchaseModal({ 
                  type: 'episode', 
                  id: activeEpisode.id, 
                  title: `${novel.title} - ${activeEpisode.title}`, 
                  price: activeEpisode.price || 50 
                })}
                className="w-full sm:w-auto px-6 py-3 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Unlock This Episode for PKR {activeEpisode.price || 50}
              </button>
              <button
                onClick={() => openPurchaseModal({ 
                  type: 'novel', 
                  id: novel.id, 
                  title: novel.title, 
                  price: novel.price 
                })}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-[#F8F4EA] border border-[#C8A45D]/40 font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Unlock Entire Novel (PKR {novel.price})
              </button>
            </div>
          </div>
        ) : (
          /* Reader Body Content */
          <div ref={contentContainerRef} className="space-y-8">
            {paragraphs.map((para, idx) => (
              <div 
                key={idx}
                className="group relative"
              >
                <p 
                  className={`urdu-reading-text ${lineHeightStyles[lineHeight]}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {para}
                </p>

                {/* Paragraph Bookmark Trigger on hover */}
                <button
                  onClick={() => handleBookmarkParagraph(idx)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer hidden sm:block"
                  title="Bookmark this paragraph"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chapter End Divider */}
        <div className="my-12 flex items-center justify-center gap-4 text-[#C8A45D]">
          <span className="w-16 h-px bg-[#C8A45D]/40"></span>
          <span className="font-urdu text-lg font-bold">ختم شد</span>
          <span className="w-16 h-px bg-[#C8A45D]/40"></span>
        </div>

        {/* Adsterra Native Banner (Unit 31602911) */}
        <NativeBannerAd />

        {/* Adsterra Medium Rectangle (Unit 31602913 - 300x250) */}
        <div className="my-6 flex justify-center">
          <AdsterraBanner type="300x250" />
        </div>

        {/* Adsterra Smartlink CTA (Unit 31602909) */}
        <div className="my-6">
          <SmartlinkCTA 
            title="Read Bonus Chapter Excerpts & Exclusive Sponsor Offers"
            subtitle="نئی کہانیاں، خصوصی تحائف اور اسپانسرڈ ایڈیشنز — ابھی ملاحظہ فرمائیں"
          />
        </div>

        {/* Complete Novel PDF Edition Callout */}
        {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && (
          <div className="my-8 p-5 sm:p-6 rounded-xl bg-[#173F35] text-[#F8F4EA] border border-[#C8A45D]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#C8A45D] uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                <FileText className="w-3.5 h-3.5" />
                Complete Novel PDF Edition
              </span>
              <h4 className="font-serif-display text-base font-bold text-white">
                Read "{novel.title}" in Digital PDF Layout
              </h4>
              <p className="font-urdu text-xs text-amber-200">
                مکمل کتاب کا پی ڈی ایف نسخہ، کتابی لے آؤٹ اور آف لائن ڈاؤن لوڈ کی سہولت کے ساتھ
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPdfOnlineReadingEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => openPdfReader(novel)}
                  className="px-4 py-2 bg-[#C8A45D] hover:bg-[#b8934c] text-[#173F35] font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Read PDF</span>
                </button>
              )}

              {isPdfDownloadEnabled(novel.pdfAccessMode) && (
                <button
                  onClick={() => triggerPdfDownload(novel)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Footer (Prev / Next Chapter) */}
        <div className="pt-8 border-t border-[#173F35]/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevEpisode ? (
            <button
              onClick={() => navigate('reader', { novelId: novel.id, episodeId: prevEpisode.id })}
              className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
                readerTheme === 'dark' 
                  ? 'border-[#173F35]/40 hover:bg-white/5' 
                  : 'border-[#173F35]/15 bg-white hover:bg-[#F8F4EA]'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-[#C8A45D] shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider opacity-60 block">Previous Episode</span>
                <span className="font-serif-display text-sm font-bold block truncate">{prevEpisode.title}</span>
                <span className="font-urdu text-xs text-[#C8A45D] block truncate mt-0.5">{prevEpisode.urduTitle}</span>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 opacity-40 text-xs flex items-center justify-center">
              First Chapter of Novel
            </div>
          )}

          {nextEpisode ? (
            <button
              onClick={() => navigate('reader', { novelId: novel.id, episodeId: nextEpisode.id })}
              className={`p-4 rounded-xl border transition-all text-right flex items-center justify-end gap-3 cursor-pointer ${
                readerTheme === 'dark' 
                  ? 'border-[#173F35]/40 hover:bg-white/5' 
                  : 'border-[#173F35]/15 bg-white hover:bg-[#F8F4EA]'
              }`}
            >
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider opacity-60 block">Next Episode</span>
                <span className="font-serif-display text-sm font-bold block truncate">{nextEpisode.title}</span>
                <span className="font-urdu text-xs text-[#C8A45D] block truncate mt-0.5">{nextEpisode.urduTitle}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C8A45D] shrink-0" />
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 opacity-40 text-xs flex items-center justify-center">
              End of Released Chapters
            </div>
          )}
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${novel.title} - ${activeEpisode.title}`}
      />
    </div>
  );
};
