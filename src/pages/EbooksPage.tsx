import React, { useState } from 'react';
import { BookOpen, Download, Lock, CheckCircle2, X, Eye, FileText, Sparkles, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Ebook, EbookCategory } from '../types';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';
import { 
  isPdfOnlineReadingEnabled, 
  isPdfDownloadEnabled, 
  triggerPdfDownload 
} from '../utils/pdfHelper';

interface EbooksPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const EbooksPage: React.FC<EbooksPageProps> = ({ navigate }) => {
  const { ebooks, openPurchaseModal, hasPurchased, openPdfReader } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadNotification, setDownloadNotification] = useState<string>('');

  const categories = [
    'all',
    'Free E-Books',
    'Premium E-Books',
    'Classical Books',
    'Urdu Literature',
    'Poetry',
    'Philosophy'
  ];

  const filteredEbooks = ebooks.filter(eb => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'Free E-Books') return !eb.isPremium;
    if (selectedCategory === 'Premium E-Books') return eb.isPremium;
    return eb.category === selectedCategory;
  });

  const handleDownload = (ebook: Ebook) => {
    const isUnlocked = !ebook.isPremium || hasPurchased('ebook', ebook.id);
    if (!isUnlocked) {
      openPurchaseModal({ type: 'ebook', id: ebook.id, title: ebook.title, price: ebook.price });
      return;
    }

    triggerPdfDownload(ebook);
    setDownloadNotification(`PDF Download initiated for "${ebook.title}" (${ebook.pdfFileSize || ebook.fileSize})`);
    setTimeout(() => setDownloadNotification(''), 4500);
  };

  const handleReadOnline = (ebook: Ebook) => {
    const isUnlocked = !ebook.isPremium || hasPurchased('ebook', ebook.id);
    if (!isUnlocked) {
      openPurchaseModal({ type: 'ebook', id: ebook.id, title: ebook.title, price: ebook.price });
      return;
    }
    openPdfReader(ebook);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#173F35]/15 pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
          Digital Formats
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35] mt-1">
          Urdu E-Books & Literary Compilations
        </h1>
        <p className="font-urdu text-base text-[#4A3025] font-semibold mt-1">
          مستند اردو کتب، کلیاتِ شعراء، اور منتخب سوانح حیات کا ڈیجیٹل ایڈیشن
        </p>
      </div>

      {/* ADSTERRA LEADERBOARD / MOBILE BANNER */}
      <ResponsiveAdBanner />

      {downloadNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Category Pills */}
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
            {cat === 'all' ? 'All E-Books' : cat}
          </button>
        ))}
      </div>

      {/* ADSTERRA SMARTLINK DOWNLOAD & OFFERS */}
      <SmartlinkCTA
        title="Download Additional Verified Urdu Books & Reader Tools"
        subtitle="مفت پی ڈی ایف کتب اور خصوصی اسپانسرڈ آفرز کے لیے یہاں کلک کریں"
      />

      {/* Grid of E-books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEbooks.map((eb) => {
          const unlocked = !eb.isPremium || hasPurchased('ebook', eb.id);
          return (
            <div
              key={eb.id}
              className="bg-white rounded-xl border border-[#173F35]/15 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4">
                  <div className="w-28 aspect-[3/4] bg-[#EEE8D8] rounded-md overflow-hidden border border-[#173F35]/15 shrink-0 shadow-xs">
                    <img
                      src={eb.coverUrl}
                      alt={eb.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-[#C8A45D] font-semibold uppercase tracking-wider block">
                      {eb.category}
                    </span>
                    <h3 className="font-serif-display text-base font-bold text-[#173F35] mt-0.5 line-clamp-2">
                      {eb.title}
                    </h3>
                    <p className="font-urdu text-sm text-[#4A3025] font-semibold text-right mt-1">
                      {eb.urduTitle}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mt-1.5">
                      By {eb.author}
                    </p>
                    <div className="mt-3 text-xs font-bold text-[#173F35] tabular-nums">
                      {eb.isPremium ? (unlocked ? 'Unlocked' : `PKR ${eb.price}`) : 'Free E-Book'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B6B6B] mt-4 line-clamp-3 leading-relaxed">
                  {eb.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#6B6B6B]">
                  <span className="bg-[#173F35]/10 text-[#173F35] font-semibold px-2 py-0.5 rounded">
                    PDF Edition
                  </span>
                  <span>{eb.pages} Pages</span>
                  <span aria-hidden="true">·</span>
                  <span>{eb.pdfFileSize || eb.fileSize}</span>
                  {eb.googleDriveUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#C8A45D] font-medium flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        Drive CDN
                      </span>
                    </>
                  )}
                </div>

                {/* PDF Access Mode Badge */}
                <div className="mt-2 text-[10px] text-[#6B6B6B] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#173F35]" />
                  <span>
                    Policy: {eb.pdfAccessMode === 'both' && 'Read Online & Download'}
                    {eb.pdfAccessMode === 'online_only' && 'Read Online Only'}
                    {eb.pdfAccessMode === 'download_only' && 'Download Only'}
                    {!eb.pdfAccessMode && 'Read Online & Download'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#EEE8D8] flex items-center gap-2">
                {isPdfOnlineReadingEnabled(eb.pdfAccessMode) && (
                  <button
                    onClick={() => handleReadOnline(eb)}
                    className="flex-1 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Read PDF Online"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Read Online</span>
                  </button>
                )}

                {isPdfDownloadEnabled(eb.pdfAccessMode) && (
                  <button
                    onClick={() => handleDownload(eb)}
                    className={`py-2 px-3 border border-[#173F35]/20 hover:bg-[#EEE8D8] text-xs font-semibold text-[#173F35] rounded flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      !isPdfOnlineReadingEnabled(eb.pdfAccessMode) ? 'flex-1 bg-[#173F35] text-white hover:bg-[#12322a]' : ''
                    }`}
                    title="Download PDF directly"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
