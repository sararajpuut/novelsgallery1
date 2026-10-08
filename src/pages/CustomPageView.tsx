import React, { useEffect } from 'react';
import { 
  Calendar, Clock, Share2, ArrowLeft, ExternalLink, 
  BookOpen, Video, CheckCircle2, FileText, Globe 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ResponsiveAdBanner } from '../components/ads/ResponsiveAdBanner';

interface CustomPageViewProps {
  slug: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ slug, navigate }) => {
  const { pages } = useStore();
  const page = pages.find(p => p.slug === slug);

  // Dynamic SEO title & schema update
  useEffect(() => {
    if (page) {
      document.title = `${page.metaTitle || page.title} | Novels Gallery`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', page.metaDescription || page.title);
      }
    }
  }, [page]);

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#173F35]/10 text-[#173F35] rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#173F35] mb-3">Page Not Found</h1>
        <p className="text-[#6B6B6B] mb-8">The requested page "{slug}" could not be found or has not been published yet.</p>
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#173F35] text-white rounded-lg hover:bg-[#12332B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: page.metaDescription || page.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Page link copied to clipboard!');
    }
  };

  // Helper to extract YouTube embed URL
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const embedVideoUrl = getEmbedVideoUrl(page.videoUrl);

  return (
    <div className="min-h-screen bg-[#F8F4EA] py-8">
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <button onClick={() => navigate('home')} className="hover:text-[#173F35]">Home</button>
          <span>/</span>
          <span>Pages</span>
          <span>/</span>
          <span className="text-[#173F35] font-semibold truncate">{page.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-[#EEE8D8] shadow-sm overflow-hidden">
          {/* Header Banner */}
          {page.featuredImage && (
            <div className="w-full h-64 md:h-80 relative overflow-hidden bg-[#173F35]/5 border-b border-[#EEE8D8]">
              <img 
                src={page.featuredImage} 
                alt={page.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="inline-block px-2.5 py-1 bg-[#C8A45D] text-[#173F35] text-xs font-bold rounded mb-2 uppercase tracking-wider">
                  Official Page
                </span>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-md">
                  {page.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* If no image banner, render title here */}
            {!page.featuredImage && (
              <div className="mb-6 pb-6 border-b border-[#EEE8D8]">
                <span className="inline-block px-2.5 py-1 bg-[#173F35]/10 text-[#173F35] text-xs font-bold rounded mb-3 uppercase tracking-wider">
                  Official Publication
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#173F35] mb-2">
                  {page.title}
                </h1>
                {page.urduTitle && (
                  <h2 className="text-2xl font-urdu text-[#C8A45D] mt-2 font-semibold">
                    {page.urduTitle}
                  </h2>
                )}
              </div>
            )}

            {/* Urdu Title if image banner was present */}
            {page.featuredImage && page.urduTitle && (
              <div className="mb-6 pb-4 border-b border-[#EEE8D8] text-right">
                <h2 className="text-2xl font-urdu text-[#C8A45D] font-semibold">
                  {page.urduTitle}
                </h2>
              </div>
            )}

            {/* Publication Date, Time & Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-[#F8F4EA] rounded-xl mb-8 text-xs text-[#6B6B6B]">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 font-medium text-[#173F35]">
                  <Calendar className="w-4 h-4 text-[#C8A45D]" />
                  <span>Published: {page.publicationDate}</span>
                </div>
                {page.publicationTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{page.publicationTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Public Record</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EEE8D8] rounded-lg text-[#173F35] hover:bg-[#173F35] hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Embedded Video (if provided) */}
            {embedVideoUrl && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[#173F35]">
                  <Video className="w-4 h-4 text-[#C8A45D]" />
                  <span>Featured Video Presentation</span>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#EEE8D8] bg-black">
                  <iframe
                    src={embedVideoUrl}
                    title={page.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Main Content Body */}
            <div className="prose prose-lg max-w-none text-[#252525] leading-relaxed mb-8">
              {page.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-xl font-serif font-bold text-[#173F35] mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-serif font-bold text-[#173F35] mt-8 mb-4 border-b border-[#EEE8D8] pb-2">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n- ');
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-[#3F3F3F]">
                          {item.replace(/^- /, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="mb-4 text-[#333333]">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Urdu Content Translation Block */}
            {page.urduContent && (
              <div className="mt-8 p-6 bg-[#F8F4EA] border border-[#C8A45D]/30 rounded-xl">
                <div className="flex items-center justify-between mb-3 border-b border-[#C8A45D]/20 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#173F35]">اردو مواد (Urdu Version)</span>
                  <BookOpen className="w-4 h-4 text-[#C8A45D]" />
                </div>
                <div className="font-urdu text-xl text-right leading-loose text-[#173F35]">
                  {page.urduContent}
                </div>
              </div>
            )}

            {/* Action / Related Links */}
            {page.links && page.links.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#EEE8D8]">
                <h4 className="text-sm font-semibold text-[#173F35] mb-3 uppercase tracking-wider">
                  Related Navigation & External Links:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {page.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      onClick={(e) => {
                        if (link.url.startsWith('/')) {
                          e.preventDefault();
                          const target = link.url.replace('/', '');
                          navigate(target || 'home');
                        }
                      }}
                      target={link.url.startsWith('/') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F4EA] hover:bg-[#173F35] text-[#173F35] hover:text-white border border-[#EEE8D8] rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monetization / Ad banner */}
        <div className="mt-8">
          <ResponsiveAdBanner className="my-4" />
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#173F35] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Library Overview
          </button>
        </div>
      </article>
    </div>
  );
};
