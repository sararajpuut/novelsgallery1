import React from 'react';
import { ExternalLink, Sparkles, BookOpen, Gift } from 'lucide-react';

export const ADSTERRA_SMARTLINK_URL = 'https://arwf.org/4/47a23b76ff34f801ae70b13f8ea8d56c';

interface SmartlinkCTAProps {
  variant?: 'banner' | 'button' | 'inline';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const SmartlinkCTA: React.FC<SmartlinkCTAProps> = ({
  variant = 'banner',
  title = 'Explore Recommended Stories & Exclusive Offers',
  subtitle = 'خصوصی انعامات اور نئی کہانیاں — اسپانسرڈ لنک پر وزٹ کریں',
  className = '',
}) => {
  if (variant === 'button') {
    return (
      <a
        href={ADSTERRA_SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{title}</span>
        <ExternalLink className="w-3 h-3 opacity-70" />
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={ADSTERRA_SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-xs text-[#C8A45D] hover:text-[#173F35] font-semibold underline decoration-dotted transition-colors ${className}`}
      >
        <span>{title}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#173F35] to-[#4A3025] text-[#F8F4EA] border border-[#C8A45D]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] flex items-center justify-center text-[#C8A45D] shrink-0">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold">
              Featured Partner Offer · اسپانسر
            </span>
          </div>
          <h4 className="font-serif-display text-sm sm:text-base font-bold text-white mt-0.5">
            {title}
          </h4>
          <p className="font-urdu text-xs text-[#C8A45D] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <a
        href={ADSTERRA_SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-xs rounded-md whitespace-nowrap shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>Open Offer / مفت رسائی</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
