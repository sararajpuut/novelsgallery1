import React, { useState } from 'react';
import { 
  Search, BookOpen, User as UserIcon, Shield, Menu, X, 
  Heart, Bookmark, Sparkles, LogOut, CheckCircle2 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { 
    currentUser, 
    setIsSearchOpen, 
    setIsAuthModalOpen, 
    switchUserRole, 
    logout,
    favorites,
    siteSettings,
    pages 
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Dynamic published pages configured for header navigation
  const navPages = pages.filter(p => (p.publishStatus === 'published' || p.isPublished) && p.showInNav);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Novels', route: 'novels' },
    { label: 'Episodes', route: 'episodes' },
    { label: 'Authors', route: 'authors' },
    { label: 'Premium', route: 'premium' },
    { label: 'E-Books', route: 'ebooks' },
    { label: 'Classical', route: 'classical' },
    { label: 'About', route: 'about' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F4EA]/95 backdrop-blur-md border-b border-[#173F35]/15 transition-all">
      {/* Top Announcement Bar */}
      {siteSettings.announcement && (
        <div className="bg-[#173F35] text-[#F8F4EA] px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
          <span className="truncate">{siteSettings.announcement}</span>
        </div>
      )}

      {/* Main Navigation - Strict Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('home')} 
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F35]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#173F35] flex items-center justify-center text-[#C8A45D] border border-[#C8A45D]/40 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-display text-xl font-bold tracking-tight text-[#173F35] block leading-none">
                {siteSettings.siteName}
              </span>
              <span className="font-urdu text-xs text-[#C8A45D] block mt-0.5 leading-none">
                ناولز گیلری
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-6 primary links, single line) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#252525]">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 hover:text-[#173F35] ${
                  isActive 
                    ? 'text-[#173F35] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C8A45D]' 
                    : 'text-[#4A3025]/85'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* Dynamic Published Custom Pages */}
          {navPages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                navigate('page', { slug: page.slug });
                setIsMobileMenuOpen(false);
              }}
              className="transition-colors whitespace-nowrap cursor-pointer py-1 text-[#173F35] font-semibold hover:text-[#C8A45D] flex items-center gap-1"
              title={`View ${page.title}`}
            >
              <span>{page.title}</span>
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher for instant testing */}
          <div className="hidden sm:flex items-center border border-[#173F35]/20 rounded-md p-0.5 bg-[#EEE8D8]">
            <button
              onClick={() => switchUserRole('reader')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                currentUser?.role === 'reader'
                  ? 'bg-[#173F35] text-[#F8F4EA] shadow-xs'
                  : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
              title="Test as regular Reader"
            >
              Reader
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-[#C8A45D] text-[#173F35] font-semibold shadow-xs'
                  : 'text-[#4A3025] hover:text-[#173F35]'
              }`}
              title="Test as Site Administrator"
            >
              <Shield className="w-3 h-3" />
              Admin CMS
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#173F35] hover:bg-[#EEE8D8] rounded-lg transition-colors cursor-pointer"
            aria-label="Search Novels, Authors, and Episodes"
            title="Search (Ctrl + K)"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Favorites shortcut */}
          <button
            onClick={() => navigate('profile', { tab: 'favorites' })}
            className="hidden sm:flex p-2 text-[#173F35] hover:bg-[#EEE8D8] rounded-lg transition-colors relative cursor-pointer"
            title="My Favorites"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8A45D] rounded-full"></span>
            )}
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#EEE8D8] border border-[#173F35]/15 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#173F35] text-[#F8F4EA] text-xs font-semibold flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-medium text-[#173F35] max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#173F35]/15 py-1 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-[#EEE8D8]">
                    <p className="font-semibold text-[#173F35] truncate">{currentUser.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-[#4A3025]">
                      <span>Role: <strong className="capitalize">{currentUser.role}</strong></span>
                      <span className="text-[#173F35] font-semibold">PKR {currentUser.walletBalance}</span>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#173F35] font-medium hover:bg-[#EEE8D8] flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#C8A45D]" />
                      Admin Dashboard CMS
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('profile', { tab: 'history' });
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#EEE8D8] flex items-center gap-2 text-[#252525] cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-[#4A3025]" />
                    Continue Reading
                  </button>

                  <button
                    onClick={() => {
                      navigate('profile', { tab: 'favorites' });
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#EEE8D8] flex items-center gap-2 text-[#252525] cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#4A3025]" />
                    My Favorites ({favorites.length})
                  </button>

                  <button
                    onClick={() => {
                      navigate('profile', { tab: 'settings' });
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#EEE8D8] flex items-center gap-2 text-[#252525] cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#4A3025]" />
                    Account Settings
                  </button>

                  <div className="border-t border-[#EEE8D8] mt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-[#F8F4EA] bg-[#173F35] rounded-md hover:bg-[#12322a] border border-[#C8A45D]/30 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#173F35] hover:bg-[#EEE8D8] rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#173F35]/15 bg-[#F8F4EA] px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Role Switch */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#EEE8D8] mb-3">
            <span className="text-xs font-medium text-[#4A3025]">Switch Mode:</span>
            <div className="flex gap-1">
              <button
                onClick={() => switchUserRole('reader')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  currentUser?.role === 'reader' ? 'bg-[#173F35] text-white' : 'text-[#252525]'
                }`}
              >
                Reader
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  currentUser?.role === 'admin' ? 'bg-[#C8A45D] text-[#173F35] font-semibold' : 'text-[#252525]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNavClick(link.route)}
              className={`block w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
                currentRoute === link.route 
                  ? 'bg-[#173F35] text-[#F8F4EA]' 
                  : 'text-[#252525] hover:bg-[#EEE8D8]'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Dynamic Pages in Mobile Drawer */}
          {navPages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                navigate('page', { slug: page.slug });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#173F35] bg-[#EEE8D8]/60 hover:bg-[#EEE8D8]"
            >
              📄 {page.title}
            </button>
          ))}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className="block w-full text-left py-2.5 px-3 rounded-md text-sm font-semibold bg-[#C8A45D]/20 text-[#173F35] border border-[#C8A45D]/40"
            >
              🛡️ Open Admin Dashboard CMS
            </button>
          )}

          <div className="pt-2 border-t border-[#173F35]/15 flex items-center justify-between text-xs text-[#6B6B6B]">
            <button onClick={() => handleNavClick('contact')} className="hover:text-[#173F35]">
              Contact & Submissions
            </button>
            <span>Urdu Digital Library</span>
          </div>
        </div>
      )}
    </header>
  );
};
