import React from 'react';
import { Lock, Sparkles, Award, ShieldCheck, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PremiumPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ navigate }) => {
  const { novels, episodes, ebooks, openPurchaseModal, hasPurchased } = useStore();

  const premiumNovels = novels.filter(n => n.isPremium);
  const premiumEpisodes = episodes.filter(e => e.isPremium);
  const premiumEbooks = ebooks.filter(eb => eb.isPremium);

  return (
    <div className="space-y-16 pb-16">
      {/* Luxury Hero Banner */}
      <section className="bg-gradient-to-br from-[#173F35] via-[#12322a] to-[#4A3025] text-[#F8F4EA] py-16 sm:py-20 border-b-4 border-[#C8A45D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] text-xs font-bold text-[#C8A45D] uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Novels Gallery VIP Collection</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Premium Urdu Literature & Exclusive Masterpieces
          </h1>

          <p className="font-urdu text-xl text-[#C8A45D] font-semibold max-w-xl mx-auto">
            اعلیٰ ادبی معیار، مصنفین کے مکمل ایڈیشن اور خصوصی سلسلہ وار اقساط
          </p>

          <p className="text-sm text-[#F8F4EA]/80 max-w-2xl mx-auto leading-relaxed">
            Gain immediate, unrestricted lifetime access to our premium novel catalogue. Every purchase directly empowers and compensates Urdu novelists, funding authentic literary translations and independent serialization.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-xs text-left">
            <div className="p-4 rounded-lg bg-[#173F35]/80 border border-[#C8A45D]/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C8A45D] shrink-0" />
              <div>
                <strong className="text-white block font-serif-display">Lifetime DRM-Free Access</strong>
                <span className="text-[#F8F4EA]/70">Read whenever and wherever you desire without recurring fees.</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#173F35]/80 border border-[#C8A45D]/30 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#C8A45D] shrink-0" />
              <div>
                <strong className="text-white block font-serif-display">Author Royalties Support</strong>
                <span className="text-[#F8F4EA]/70">100% legitimate publishing supporting original Urdu writers.</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#173F35]/80 border border-[#C8A45D]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C8A45D] shrink-0" />
              <div>
                <strong className="text-white block font-serif-display">VIP Nastaliq Typesetting</strong>
                <span className="text-[#F8F4EA]/70">Tailored calligraphy spacing and distraction-free night mode.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Novels Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#173F35]/15 pb-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
            Full Novel Editions
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#173F35] mt-1">
            Exclusive Premium Novels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumNovels.map((novel) => {
            const unlocked = hasPurchased('novel', novel.id);
            return (
              <div
                key={novel.id}
                className="bg-white rounded-xl border border-[#C8A45D]/50 shadow-md p-6 flex flex-col justify-between hover:border-[#173F35] transition-all"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-5 bg-[#EEE8D8]">
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#173F35] text-[#C8A45D] font-bold text-xs px-3 py-1 rounded border border-[#C8A45D]/40 shadow-xs">
                      {unlocked ? 'Unlocked' : `PKR ${novel.price}`}
                    </div>
                  </div>

                  <span className="text-xs text-[#6B6B6B] block">{novel.authorName} · {novel.genre}</span>
                  <h3 className="font-serif-display text-lg font-bold text-[#173F35] mt-1">
                    {novel.title}
                  </h3>
                  <p className="font-urdu text-sm text-[#4A3025] font-semibold text-right mt-1">
                    {novel.urduTitle}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-3 leading-relaxed">
                    {novel.synopsis}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EEE8D8]">
                  {unlocked ? (
                    <button
                      onClick={() => navigate('reader', { novelId: novel.id })}
                      className="w-full py-2.5 bg-[#173F35] text-[#F8F4EA] font-semibold text-xs rounded hover:bg-[#12322a] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#C8A45D]" />
                      <span>Read Unlocked Edition</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openPurchaseModal({ type: 'novel', id: novel.id, title: novel.title, price: novel.price })}
                      className="w-full py-2.5 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock Access (PKR {novel.price})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Premium Episodes */}
      {premiumEpisodes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#173F35]/15 pb-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
              Individual Chapter Passes
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-[#173F35] mt-1">
              Early Release & Premium Episodes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumEpisodes.map((ep) => {
              const novel = novels.find(n => n.id === ep.novelId);
              const unlocked = hasPurchased('episode', ep.id) || (novel && hasPurchased('novel', novel.id));
              return (
                <div key={ep.id} className="bg-white p-5 rounded-lg border border-[#C8A45D]/40 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#6B6B6B] block">{novel?.title}</span>
                    <h4 className="font-serif-display text-sm font-bold text-[#173F35] mt-0.5">{ep.title}</h4>
                    <p className="font-urdu text-sm text-[#4A3025] font-semibold text-right mt-1">{ep.urduTitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#173F35] tabular-nums">PKR {ep.price || 50}</span>
                    {unlocked ? (
                      <button
                        onClick={() => navigate('reader', { novelId: ep.novelId, episodeId: ep.id })}
                        className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] flex items-center gap-1"
                      >
                        Read Now <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => openPurchaseModal({ type: 'episode', id: ep.id, title: ep.title, price: ep.price || 50 })}
                        className="px-3 py-1 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3 h-3" />
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Premium E-Books */}
      {premiumEbooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#173F35]/15 pb-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
              Digital Downloads
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-[#173F35] mt-1">
              Premium Urdu E-Books & Memoirs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumEbooks.map((eb) => {
              const unlocked = hasPurchased('ebook', eb.id);
              return (
                <div key={eb.id} className="bg-white p-5 rounded-lg border border-[#C8A45D]/40 flex gap-4">
                  <div className="w-24 aspect-[3/4] bg-[#EEE8D8] rounded overflow-hidden shrink-0">
                    <img src={eb.coverUrl} alt={eb.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-[#C8A45D] font-medium block">{eb.category}</span>
                      <h4 className="font-serif-display text-base font-bold text-[#173F35]">{eb.title}</h4>
                      <p className="font-urdu text-sm text-[#4A3025] font-semibold text-right mt-0.5">{eb.urduTitle}</p>
                      <p className="text-xs text-[#6B6B6B] mt-1 line-clamp-2">{eb.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#EEE8D8] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#173F35]">PKR {eb.price}</span>
                      {unlocked ? (
                        <button
                          onClick={() => navigate('ebooks')}
                          className="text-xs font-semibold text-[#173F35] hover:text-[#C8A45D]"
                        >
                          Access E-Book
                        </button>
                      ) : (
                        <button
                          onClick={() => openPurchaseModal({ type: 'ebook', id: eb.id, title: eb.title, price: eb.price })}
                          className="px-3 py-1 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-xs font-bold rounded cursor-pointer"
                        >
                          Unlock E-Book
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
