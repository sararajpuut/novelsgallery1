import React, { useState, useEffect } from 'react';
import { 
  X, Download, ExternalLink, Maximize2, Minimize2, 
  ZoomIn, ZoomOut, RotateCw, FileText, BookOpen, 
  ChevronLeft, ChevronRight, AlertCircle, Sparkles, CheckCircle2, Shield
} from 'lucide-react';
import { PdfAccessMode } from '../../types';
import { 
  getGoogleDrivePreviewUrl, 
  getGoogleDriveDownloadUrl, 
  isPdfDownloadEnabled, 
  isPdfOnlineReadingEnabled, 
  triggerPdfDownload 
} from '../../utils/pdfHelper';

export interface PdfDocumentInfo {
  title: string;
  urduTitle?: string;
  author?: string;
  authorName?: string;
  coverUrl?: string;
  pdfUrl?: string;
  googleDriveUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  pdfPages?: number;
  pdfAccessMode?: PdfAccessMode;
  sampleContent?: string;
  synopsis?: string;
  urduSynopsis?: string;
}

interface PdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PdfDocumentInfo | null;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ isOpen, onClose, document }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeView, setActiveView] = useState<'embed' | 'reader'>('embed');
  const [currentPage, setCurrentPage] = useState(1);
  const [readerTheme, setReaderTheme] = useState<'ivory' | 'sepia' | 'dark' | 'white'>('ivory');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Reset view states when document changes
    if (document) {
      setCurrentPage(1);
      setZoomLevel(100);
      setDownloadSuccess(false);

      // Default view: if googleDriveUrl or pdfUrl exists, use 'embed', else 'reader'
      if (document.googleDriveUrl || document.pdfUrl) {
        setActiveView('embed');
      } else {
        setActiveView('reader');
      }
    }
  }, [document]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen || !document) return null;

  const accessMode = document.pdfAccessMode || 'both';
  const onlineAllowed = isPdfOnlineReadingEnabled(accessMode);
  const downloadAllowed = isPdfDownloadEnabled(accessMode);

  const totalPages = document.pdfPages || 480;
  const authorDisplay = document.authorName || document.author || 'Novels Gallery Editorial';
  const fileName = document.pdfFileName || `${document.title.replace(/\s+/g, '_')}.pdf`;

  // Determine embed source URL
  let embedUrl = '';
  if (document.googleDriveUrl) {
    embedUrl = getGoogleDrivePreviewUrl(document.googleDriveUrl);
  } else if (document.pdfUrl) {
    embedUrl = document.pdfUrl;
  }

  const handleDownload = () => {
    if (!downloadAllowed) return;
    triggerPdfDownload(document);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const themeClasses = {
    ivory: 'bg-[#F8F4EA] text-[#252525] border-[#173F35]/15',
    sepia: 'bg-[#F4ECD8] text-[#3E2723] border-[#795548]/20',
    dark: 'bg-[#1C1F1E] text-[#E0E0E0] border-neutral-700',
    white: 'bg-white text-gray-900 border-gray-200',
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-200 ${
      isFullscreen ? 'p-0!' : ''
    }`}>
      <div className={`bg-[#F8F4EA] flex flex-col rounded-xl overflow-hidden border border-[#C8A45D]/40 shadow-2xl transition-all duration-200 ${
        isFullscreen ? 'w-full h-full rounded-none border-none' : 'w-full max-w-6xl h-[92vh]'
      }`}>
        {/* TOP BAR */}
        <div className="bg-[#173F35] text-[#F8F4EA] px-4 py-3 sm:px-6 flex items-center justify-between gap-4 border-b border-[#C8A45D]/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#C8A45D]/20 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-sm sm:text-base font-bold text-white truncate">
                  {document.title}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C8A45D] text-[#173F35] shrink-0">
                  PDF Edition
                </span>
              </div>
              <p className="text-xs text-[#C8A45D]/90 truncate flex items-center gap-2">
                <span className="font-urdu font-medium text-amber-200">{document.urduTitle}</span>
                <span className="opacity-40">·</span>
                <span>{authorDisplay}</span>
                {document.pdfFileSize && (
                  <>
                    <span className="opacity-40">·</span>
                    <span className="text-neutral-300">{document.pdfFileSize}</span>
                  </>
                )}
                {document.pdfPages && (
                  <>
                    <span className="opacity-40">·</span>
                    <span className="text-neutral-300">{document.pdfPages} Pages</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {downloadAllowed && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-[#C8A45D] hover:bg-[#b8934c] text-[#173F35] font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={`Download ${fileName}`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            )}

            {document.googleDriveUrl && (
              <a
                href={document.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Open in Google Drive"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors hidden sm:block cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              title="Close Viewer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="bg-[#EEE8D8] border-b border-[#173F35]/15 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/60 p-0.5 rounded-md border border-[#173F35]/10">
            {(embedUrl || document.googleDriveUrl) && (
              <button
                onClick={() => setActiveView('embed')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'embed'
                    ? 'bg-[#173F35] text-white shadow-xs'
                    : 'text-[#4A3025] hover:text-[#173F35]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cloud PDF Viewer</span>
              </button>
            )}
            <button
              onClick={() => setActiveView('reader')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'reader'
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Urdu Reader</span>
            </button>
          </div>

          {/* Access Policy Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#173F35]" />
              Policy:
              <strong className="text-[#173F35]">
                {accessMode === 'both' && 'Read Online & Download'}
                {accessMode === 'online_only' && 'Read Online Only'}
                {accessMode === 'download_only' && 'Download Only'}
              </strong>
            </span>
          </div>

          {/* Reader Preferences & Zoom */}
          <div className="flex items-center gap-2">
            {activeView === 'reader' && (
              <>
                {/* Theme Selector */}
                <div className="flex items-center gap-1 border-r border-[#173F35]/15 pr-2 mr-1">
                  {(['ivory', 'sepia', 'white', 'dark'] as const).map(th => (
                    <button
                      key={th}
                      onClick={() => setReaderTheme(th)}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        th === 'ivory' ? 'bg-[#F8F4EA] border-[#173F35]/30' :
                        th === 'sepia' ? 'bg-[#F4ECD8] border-[#795548]/30' :
                        th === 'white' ? 'bg-white border-gray-300' :
                        'bg-[#1C1F1E] border-neutral-600'
                      } ${readerTheme === th ? 'ring-2 ring-[#C8A45D] ring-offset-1' : ''}`}
                      title={`${th.charAt(0).toUpperCase() + th.slice(1)} Mode`}
                    />
                  ))}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded border border-[#173F35]/10">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 disabled:opacity-30 hover:text-[#C8A45D] cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-semibold text-[#173F35] tabular-nums px-1">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1 disabled:opacity-30 hover:text-[#C8A45D] cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/70 px-1 py-0.5 rounded border border-[#173F35]/10">
              <button
                onClick={() => setZoomLevel(z => Math.max(70, z - 15))}
                className="p-1 hover:text-[#173F35] cursor-pointer text-[#6B6B6B]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-semibold text-[#173F35] tabular-nums w-9 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(160, z + 15))}
                className="p-1 hover:text-[#173F35] cursor-pointer text-[#6B6B6B]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Download for <strong>"{fileName}"</strong> started successfully!</span>
            </div>
            <button onClick={() => setDownloadSuccess(false)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ACCESS RESTRICTION NOTICE IF DOWNLOAD ONLY */}
        {!onlineAllowed && (
          <div className="p-8 text-center bg-white m-6 rounded-xl border border-[#C8A45D]/40 space-y-4 my-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C8A45D]/20 text-[#173F35] flex items-center justify-center">
              <FileText className="w-7 h-7 text-[#C8A45D]" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#173F35]">
              Download-Only Edition
            </h3>
            <p className="text-xs text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
              This publication has been designated for offline reading. Please download the high-resolution PDF file to enjoy on your phone, tablet, or PDF reader.
            </p>
            {downloadAllowed ? (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-[#173F35] hover:bg-[#12322a] text-[#C8A45D] font-bold text-sm rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF ({document.pdfFileSize || 'Complete'})</span>
              </button>
            ) : (
              <p className="text-xs text-red-600">Access to this document is currently restricted.</p>
            )}
          </div>
        )}

        {/* MAIN VIEWER AREA */}
        {onlineAllowed && (
          <div className="flex-1 overflow-hidden relative bg-[#4A4D4B]/10 flex flex-col">
            {activeView === 'embed' && embedUrl ? (
              <div className="w-full h-full flex flex-col relative bg-neutral-900">
                <iframe
                  src={embedUrl}
                  title={`PDF Viewer - ${document.title}`}
                  className="w-full h-full border-0 flex-1"
                  allow="autoplay; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                
                {/* Fallback footer link in case browser restricts third-party iframe */}
                <div className="bg-[#173F35] text-xs text-[#EEE8D8] py-2 px-4 flex items-center justify-between border-t border-[#173F35]/40 shrink-0">
                  <span className="text-[11px] text-neutral-300">
                    If cloud preview takes a moment to load or requires permissions:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveView('reader')}
                      className="text-[#C8A45D] hover:underline font-semibold text-xs cursor-pointer"
                    >
                      Switch to Urdu Reader
                    </button>
                    {document.googleDriveUrl && (
                      <a
                        href={document.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#C8A45D] flex items-center gap-1 font-semibold text-xs"
                      >
                        Open Drive Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* INTERACTIVE URDU DOCUMENT READER VIEW */
              <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center">
                <div 
                  className={`w-full max-w-4xl p-6 sm:p-12 rounded-xl shadow-lg border transition-all my-auto ${themeClasses[readerTheme]}`}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {/* Document Header Page */}
                  <div className="border-b-2 border-[#C8A45D] pb-6 mb-8 text-center space-y-2">
                    <span className="text-[11px] uppercase tracking-widest text-[#C8A45D] font-bold block">
                      Novels Gallery · مستند ڈیجیٹل کتب خانہ
                    </span>
                    <h1 className="font-serif-display text-2xl sm:text-3xl font-bold">
                      {document.title}
                    </h1>
                    <p className="font-urdu text-2xl font-bold text-[#C8A45D] mt-1">
                      {document.urduTitle}
                    </p>
                    <p className="text-sm font-medium opacity-80 pt-1">
                      تصنیف: {authorDisplay}
                    </p>
                  </div>

                  {/* Novel Document Content */}
                  <div className="space-y-6 text-right" dir="rtl">
                    <div className="bg-[#173F35]/5 p-4 rounded-lg border border-[#173F35]/10 mb-6">
                      <h4 className="font-serif-display text-xs font-bold uppercase tracking-wider text-[#173F35] text-left mb-1" dir="ltr">
                        Overview & Publication Details
                      </h4>
                      <p className="text-xs text-[#6B6B6B] text-left" dir="ltr">
                        Format: High-Definition PDF · Pages: {totalPages} · Size: {document.pdfFileSize || '15 MB'}
                      </p>
                      {document.synopsis && (
                        <p className="text-xs opacity-75 mt-2 text-left" dir="ltr">
                          {document.synopsis}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-urdu text-xl font-bold text-[#173F35] border-r-4 border-[#C8A45D] pr-3">
                        صفحہ {currentPage}: ابتدائیہ و متن
                      </h3>

                      <div className="font-urdu text-lg sm:text-xl leading-loose space-y-4 text-justify">
                        {document.urduSynopsis && (
                          <p className="font-bold text-[#4A3025]">
                            {document.urduSynopsis}
                          </p>
                        )}

                        {document.sampleContent ? (
                          <div className="whitespace-pre-line leading-loose text-base sm:text-lg">
                            {document.sampleContent}
                          </div>
                        ) : (
                          <>
                            <p>
                              یہ ناول اردو کے مایہ ناز شاہکاروں میں شمار ہوتا ہے۔ اس نسخے میں تمام ابواب، مکالمے اور مصنف کے اصل الفاظ کو بغیر کسی ترمیم کے مستند انداز میں محفوظ کیا گیا ہے۔
                            </p>
                            <p>
                              ناولز گیلری کے تمام صارفین کے لیے یہ نسخہ ہائی ریزولیوشن پی ڈی ایف میں دستیاب ہے۔ قارئین اسے آن لائن سکرول کر کے بھی پڑھ سکتے ہیں اور اپنے موبائل، کمپیوٹر یا کنڈل پر محفوظ کرنے کے لیے براہِ راست ڈاؤن لوڈ بھی کر سکتے ہیں۔
                            </p>
                            <p>
                              اگر آپ مکمل کتاب کو روایتی پی ڈی ایف پیج ٹرننگ لے آؤٹ میں دیکھنا چاہتے ہیں تو اوپر دیے گئے <strong>"Cloud PDF Viewer"</strong> ٹیب پر کلک کریں یا <strong>"Download PDF"</strong> کے ذریعے مکمل کتاب حاصل کریں۔
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div className="mt-12 pt-6 border-t border-[#C8A45D]/40 flex flex-col sm:flex-row items-center justify-between text-xs opacity-70 gap-2">
                    <span>Novels Gallery Digital Publishing · All Rights Reserved</span>
                    <span className="tabular-nums">Document Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
