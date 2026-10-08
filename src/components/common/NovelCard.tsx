import React from 'react';
import { Star, Heart, BookOpen, Lock, FileText } from 'lucide-react';
import { Novel } from '../../types';
import { useStore } from '../../context/StoreContext';

interface NovelCardProps {
  novel: Novel;
  onSelect: (novelId: string) => void;
  onReadNow?: (novelId: string) => void;
}

export const NovelCard: React.FC<NovelCardProps> = ({ novel, onSelect, onReadNow }) => {
  const { isFavorite, toggleFavorite, hasPurchased } = useStore();
  const favorited = isFavorite(novel.id);
  const purchased = hasPurchased('novel', novel.id);

  return (
    <article className="group bg-white rounded-lg border border-[#173F35]/15 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Cover Image Container */}
      <div 
        onClick={() => onSelect(novel.id)}
        className="relative aspect-[3/4] w-full bg-[#EEE8D8] overflow-hidden cursor-pointer"
      >
        <img
          src={novel.coverUrl}
          alt={`Cover of ${novel.title} by ${novel.authorName}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Elegant CSS fallback container
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('bg-gradient-to-br', 'from-[#173F35]', 'to-[#4A3025]', 'flex', 'items-center', 'justify-center', 'p-6', 'text-center');
              const fallbackContent = document.createElement('div');
              fallbackContent.className = 'text-[#F8F4EA]';
              fallbackContent.innerHTML = `<span class="font-serif-display text-lg block font-bold">${novel.title}</span><span class="font-urdu text-sm block mt-2 text-[#C8A45D]">${novel.urduTitle}</span>`;
              target.parentElement.appendChild(fallbackContent);
            }
          }}
        />

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(novel.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              favorited 
                ? 'bg-[#173F35] text-[#C8A45D]' 
                : 'bg-white/85 text-[#4A3025] hover:bg-white hover:text-rose-600'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-[#C8A45D]' : ''}`} />
          </button>
        </div>

        {/* Premium / Free Tag Indicator (Quiet unboxed flag) */}
        {novel.isPremium ? (
          <div className="absolute top-2.5 left-2.5 bg-[#173F35]/90 backdrop-blur-xs text-[#C8A45D] text-[11px] font-semibold px-2.5 py-1 rounded border border-[#C8A45D]/40 flex items-center gap-1 shadow-xs">
            <Lock className="w-3 h-3 text-[#C8A45D]" />
            {purchased ? 'Unlocked' : `PKR ${novel.price}`}
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 bg-[#173F35]/85 backdrop-blur-xs text-[#F8F4EA] text-[11px] font-medium px-2 py-0.5 rounded">
            Free
          </div>
        )}
      </div>

      {/* Novel Information - Strict Zero-Pill Compliance */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata with typographic separator (NO PILLS) */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-1.5">
            <span className="text-[#173F35] font-medium">{novel.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{novel.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{novel.status}</span>
            {(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#C8A45D] font-bold inline-flex items-center gap-0.5">
                  <FileText className="w-3 h-3" />
                  PDF
                </span>
              </>
            )}
          </div>

          {/* Titles */}
          <h3 
            onClick={() => onSelect(novel.id)}
            className="font-serif-display text-base font-bold text-[#173F35] group-hover:text-[#C8A45D] transition-colors cursor-pointer line-clamp-1"
          >
            {novel.title}
          </h3>

          <p className="font-urdu text-sm text-[#4A3025] font-semibold mt-0.5 line-clamp-1 text-right">
            {novel.urduTitle}
          </p>

          <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-2 leading-relaxed">
            {novel.synopsis}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[#252525]">
            <Star className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span className="font-semibold tabular-nums">{novel.rating.toFixed(1)}</span>
            <span className="text-[#6B6B6B]">({novel.totalReviews})</span>
            <span aria-hidden="true" className="text-[#6B6B6B]">·</span>
            <span className="text-[#6B6B6B] tabular-nums">{novel.episodesCount} eps</span>
          </div>

          <button
            onClick={() => onReadNow ? onReadNow(novel.id) : onSelect(novel.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#173F35] hover:text-[#C8A45D] transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#EEE8D8]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Read Now
          </button>
        </div>
      </div>
    </article>
  );
};
