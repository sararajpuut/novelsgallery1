import React, { useState } from 'react';
import { 
  User, Heart, Bookmark, History, CreditCard, 
  Wallet, Settings, BookOpen, Trash2, ArrowRight, Shield,
  FileText, Download
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NovelCard } from '../components/common/NovelCard';
import { 
  isPdfOnlineReadingEnabled, 
  isPdfDownloadEnabled, 
  triggerPdfDownload 
} from '../utils/pdfHelper';

interface UserProfilePageProps {
  initialTab?: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ initialTab, navigate }) => {
  const { 
    currentUser, 
    readingHistory, 
    favorites, 
    bookmarks, 
    purchases, 
    novels, 
    episodes,
    ebooks,
    openPdfReader,
    removeBookmark,
    switchUserRole,
    login 
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab || 'history');
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const favoritedNovels = novels.filter(n => favorites.includes(n.id));

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && nameInput.trim()) {
      login(currentUser.email, nameInput.trim(), currentUser.role);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-[#173F35]/15 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#173F35] text-[#C8A45D] text-2xl font-bold flex items-center justify-center border-2 border-[#C8A45D] shadow-sm">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif-display text-2xl font-bold text-[#173F35]">
                {currentUser?.name || 'Urdu Literature Reader'}
              </h1>
              {currentUser?.role === 'admin' && (
                <span className="px-2 py-0.5 bg-[#C8A45D] text-[#173F35] font-bold text-[10px] rounded uppercase">
                  Admin
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B6B6B] mt-0.5">
              {currentUser?.email || 'reader@novelsgallery.com'} · Member since {currentUser?.joinedDate || '2024'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-[#4A3025] mt-3">
              <span className="flex items-center gap-1 font-semibold">
                <Wallet className="w-3.5 h-3.5 text-[#C8A45D]" />
                Wallet: PKR {currentUser?.walletBalance ?? 2500}
              </span>
              <span>·</span>
              <span>{purchases.length} Items Purchased</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row gap-2">
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => navigate('admin')}
              className="px-4 py-2 bg-[#173F35] text-[#C8A45D] border border-[#C8A45D]/40 text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-[#12322a]"
            >
              <Shield className="w-3.5 h-3.5" />
              Open Admin CMS
            </button>
          ) : (
            <button
              onClick={() => switchUserRole('admin')}
              className="px-4 py-2 bg-[#EEE8D8] text-[#173F35] text-xs font-medium rounded-md hover:bg-[#e4ddcc] cursor-pointer"
            >
              Switch to Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#173F35]/15 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'history' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Continue Reading ({readingHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'favorites' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'bookmarks' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'purchases' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Purchased Content ({purchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Continue Reading */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Recently Read Chapters
          </h3>
          {readingHistory.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-[#173F35]/15 text-xs text-[#6B6B6B]">
              You haven't started reading any novels yet. Explore our library to begin!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readingHistory.map((item, idx) => {
                const novel = novels.find(n => n.id === item.novelId);
                const ep = episodes.find(e => e.id === item.episodeId);
                return (
                  <div key={idx} className="bg-white p-5 rounded-lg border border-[#173F35]/15 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[11px] text-[#6B6B6B] block font-medium">Chapter {item.episodeNumber}</span>
                      <h4 className="font-serif-display text-base font-bold text-[#173F35]">{novel?.title}</h4>
                      <p className="text-xs text-[#4A3025] mt-0.5">{ep?.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#EEE8D8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C8A45D]" style={{ width: `${item.progressPercent}%` }} />
                        </div>
                        <span className="text-[11px] text-[#6B6B6B] tabular-nums">{item.progressPercent}% read</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('reader', { novelId: item.novelId, episodeId: item.episodeId })}
                      className="px-3.5 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            My Saved Urdu Novels
          </h3>
          {favoritedNovels.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-[#173F35]/15 text-xs text-[#6B6B6B]">
              No favorites saved yet. Click the heart icon on any novel card to bookmark it here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoritedNovels.map(novel => (
                <NovelCard
                  key={novel.id}
                  novel={novel}
                  onSelect={(id) => navigate('novel-detail', { id })}
                  onReadNow={(id) => navigate('reader', { novelId: id })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Paragraph Bookmarks
          </h3>
          {bookmarks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-[#173F35]/15 text-xs text-[#6B6B6B]">
              No paragraph bookmarks recorded. Click the bookmark icon in the reading mode to save quotes!
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bm) => {
                const novel = novels.find(n => n.id === bm.novelId);
                const ep = episodes.find(e => e.id === bm.episodeId);
                return (
                  <div key={bm.id} className="p-4 bg-white rounded-lg border border-[#173F35]/15 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#173F35] font-semibold">{novel?.title} · {ep?.title}</span>
                      <p className="text-xs text-[#252525] mt-1 italic">"{bm.note || 'Saved reading location'}"</p>
                      <span className="text-[11px] text-[#6B6B6B] block mt-1">Saved on {bm.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('reader', { novelId: bm.novelId, episodeId: bm.episodeId })}
                        className="px-3 py-1.5 bg-[#173F35] text-white text-xs font-semibold rounded hover:bg-[#12322a] cursor-pointer"
                      >
                        Go to Quote
                      </button>
                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Purchases */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Purchased Premium Editions
          </h3>
          {purchases.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-[#173F35]/15 text-xs text-[#6B6B6B]">
              You have not purchased any premium novels or chapters yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                  <tr>
                    <th className="p-3">Item Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEE8D8]">
                  {purchases.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3 font-semibold text-[#173F35]">{p.itemTitle}</td>
                      <td className="p-3 capitalize text-[#6B6B6B]">{p.itemType}</td>
                      <td className="p-3 text-[#6B6B6B]">{p.purchasedAt}</td>
                      <td className="p-3 font-semibold text-[#173F35]">PKR {p.amount}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(() => {
                            const relatedNovel = p.itemType === 'novel' ? novels.find(n => n.id === p.itemId) : null;
                            const relatedEbook = p.itemType === 'ebook' ? ebooks.find(e => e.id === p.itemId) : null;
                            const doc = relatedNovel || relatedEbook;
                            const hasPdf = doc && (doc.hasPdf || doc.googleDriveUrl || doc.pdfUrl);

                            return (
                              <>
                                {hasPdf && isPdfOnlineReadingEnabled(doc.pdfAccessMode) && (
                                  <button
                                    onClick={() => openPdfReader(doc)}
                                    className="px-2.5 py-1 bg-[#173F35] text-white hover:bg-[#12322a] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                    title="Read PDF Edition"
                                  >
                                    <FileText className="w-3 h-3 text-[#C8A45D]" />
                                    <span>Read PDF</span>
                                  </button>
                                )}

                                {hasPdf && isPdfDownloadEnabled(doc.pdfAccessMode) && (
                                  <button
                                    onClick={() => triggerPdfDownload(doc)}
                                    className="p-1 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                                    title="Download PDF"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if (p.itemType === 'novel') navigate('novel-detail', { id: p.itemId });
                                    else if (p.itemType === 'ebook') navigate('ebooks');
                                    else navigate('reader', { novelId: p.itemId });
                                  }}
                                  className="text-[#173F35] font-semibold hover:text-[#C8A45D] cursor-pointer text-xs"
                                >
                                  Open →
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-xl border border-[#173F35]/15 max-w-xl space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Profile & Account Details
          </h3>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
              Account settings updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateName} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#6B6B6B] font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-sm text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
              />
            </div>

            <div>
              <label className="block text-[#6B6B6B] font-medium mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-semibold rounded cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
