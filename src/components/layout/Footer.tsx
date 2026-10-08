import React, { useState } from 'react';
import { BookOpen, Mail, Send, Heart, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { siteSettings, pages } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerPages = pages.filter(p => (p.publishStatus === 'published' || p.isPublished) && p.showInFooter);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#173F35] text-[#F8F4EA] border-t-4 border-[#C8A45D]">
      {/* Newsletter Section */}
      <div className="border-b border-[#F8F4EA]/15 py-12 px-4 sm:px-6 lg:px-8 bg-[#12322a]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-semibold">
            Literary Dispatch
          </span>
          <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#F8F4EA]">
            Subscribe to Novels Gallery
          </h3>
          <p className="text-sm text-[#F8F4EA]/80 max-w-xl mx-auto">
            Get instant notifications when new episodes, complete Urdu novels, and classical works are published.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2 pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F4EA]/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#173F35] border border-[#C8A45D]/40 text-sm text-[#F8F4EA] placeholder-[#F8F4EA]/50 focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>

          {subscribed && (
            <div className="inline-flex items-center gap-2 text-xs text-[#C8A45D] bg-[#173F35] px-4 py-1.5 rounded-full border border-[#C8A45D]/30 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Thank you for subscribing to Novels Gallery!
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#C8A45D] flex items-center justify-center text-[#173F35]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-display text-xl font-bold text-[#F8F4EA] block">
                  {siteSettings.siteName}
                </span>
                <span className="font-urdu text-xs text-[#C8A45D] block">
                  ناولز گیلری — اردو کا مستند ڈیجیٹل کتب خانہ
                </span>
              </div>
            </div>

            <p className="text-sm text-[#F8F4EA]/75 leading-relaxed pr-6">
              {siteSettings.tagline} Novels Gallery is a dedicated sanctuary for Urdu literature, preserving masterpieces and celebrating modern narrative voices in an elegant, distraction-free reading experience.
            </p>

            <div className="text-xs text-[#C8A45D] space-y-1 pt-2">
              <p>Email: <span className="text-[#F8F4EA]">{siteSettings.contactEmail}</span></p>
              <p>Location: Lahore, Pakistan & Global Urdu Readers Community</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-semibold text-[#C8A45D] tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#F8F4EA]/80">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('novels')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  All Urdu Novels
                </button>
              </li>
              <li>
                <button onClick={() => navigate('episodes')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Latest Episodes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('authors')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Authors Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('premium')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Premium Editions
                </button>
              </li>
            </ul>
          </div>

          {/* Literature & Formats */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-semibold text-[#C8A45D] tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-[#F8F4EA]/80">
              <li>
                <button onClick={() => navigate('classical')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Classical Literature
                </button>
              </li>
              <li>
                <button onClick={() => navigate('ebooks')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  E-Books Library
                </button>
              </li>
              <li>
                <button onClick={() => navigate('classical')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Urdu Poetry & Ghazals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('classical')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Manto's Afsanay
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  About Our Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-semibold text-[#C8A45D] tracking-wider uppercase">
              Editorial & Pages
            </h4>
            <ul className="space-y-2 text-sm text-[#F8F4EA]/80">
              {footerPages.map((page) => (
                <li key={page.id}>
                  <button 
                    onClick={() => navigate('page', { slug: page.slug })} 
                    className="hover:text-[#C8A45D] transition-colors cursor-pointer text-left flex items-center gap-1"
                  >
                    <span className="text-[#C8A45D]">›</span>
                    <span>{page.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Submissions & Writers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#C8A45D] transition-colors cursor-pointer">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F8F4EA]/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F4EA]/60 gap-4">
          <p>© {new Date().getFullYear()} Novels Gallery. All Urdu literature rights and copyrights belong to their respective authors & publishers.</p>
          <div className="flex items-center gap-1 text-[#F8F4EA]/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span>for Urdu literature lovers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
