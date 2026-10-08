import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Read "${title}" on Novels Gallery:`);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title} - Read on Novels Gallery: ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#F8F4EA] w-full max-w-sm rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden">
        <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#C8A45D]" />
            <h3 className="font-serif-display text-sm font-bold">Share with Readers</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#12322a] rounded">
            <X className="w-4 h-4 text-[#F8F4EA]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-[#6B6B6B]">
            Share <strong>{title}</strong> across social platforms:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <a
              href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-emerald-600 text-white flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-blue-700 text-white flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-black text-white flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-sky-600 text-white flex items-center justify-center gap-1.5 hover:bg-sky-700 transition-colors"
            >
              Telegram
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopy}
              className="w-full py-2 px-3 border border-[#173F35]/30 rounded-md bg-white hover:bg-[#EEE8D8] text-xs font-semibold text-[#173F35] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Page Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
