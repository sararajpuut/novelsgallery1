import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';
import { PurchaseModal } from './components/common/PurchaseModal';
import { PdfReaderModal } from './components/common/PdfReaderModal';

// Pages
import { HomePage } from './pages/HomePage';
import { NovelsPage } from './pages/NovelsPage';
import { NovelDetailPage } from './pages/NovelDetailPage';
import { ReaderPage } from './pages/ReaderPage';
import { EpisodesPage } from './pages/EpisodesPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { PremiumPage } from './pages/PremiumPage';
import { EbooksPage } from './pages/EbooksPage';
import { ClassicalPage } from './pages/ClassicalPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomPageView } from './pages/CustomPageView';

// Helper to determine route and params from window.location
function parseLocation(): { route: string; params: Record<string, string> } {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // Check query params first
  if (searchParams.has('page_slug')) {
    return { route: 'page', params: { slug: searchParams.get('page_slug') || '' } };
  }
  if (searchParams.has('route')) {
    const route = searchParams.get('route') || 'home';
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key !== 'route') params[key] = val;
    });
    return { route, params };
  }

  // Check clean pathnames
  if (path.startsWith('/page/')) {
    const slug = path.replace('/page/', '').replace(/\/$/, '');
    return { route: 'page', params: { slug } };
  }
  if (path.startsWith('/novel/')) {
    const id = path.replace('/novel/', '').replace(/\/$/, '');
    return { route: 'novel-detail', params: { id } };
  }
  if (path.startsWith('/author/')) {
    const id = path.replace('/author/', '').replace(/\/$/, '');
    return { route: 'author-detail', params: { id } };
  }
  if (path === '/admin') return { route: 'admin', params: {} };
  if (path === '/novels') return { route: 'novels', params: {} };
  if (path === '/episodes') return { route: 'episodes', params: {} };
  if (path === '/authors') return { route: 'authors', params: {} };
  if (path === '/ebooks') return { route: 'ebooks', params: {} };
  if (path === '/classical') return { route: 'classical', params: {} };
  if (path === '/premium') return { route: 'premium', params: {} };
  if (path === '/about') return { route: 'about', params: {} };
  if (path === '/contact') return { route: 'contact', params: {} };

  return { route: 'home', params: {} };
}

export function AppContent() {
  const { activePdfDoc, closePdfReader } = useStore();
  const initial = parseLocation();
  const [currentRoute, setCurrentRoute] = useState<string>(initial.route);
  const [routeParams, setRouteParams] = useState<Record<string, string>>(initial.params);

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const loc = parseLocation();
      setCurrentRoute(loc.route);
      setRouteParams(loc.params);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clean navigation helper with history state & scroll-to-top
  const navigate = (route: string, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser address bar for shareable public URLs
    let newPath = '/';
    if (route === 'home') newPath = '/';
    else if (route === 'page' && params.slug) newPath = `/page/${params.slug}`;
    else if (route === 'novel-detail' && params.id) newPath = `/novel/${params.id}`;
    else if (route === 'author-detail' && params.id) newPath = `/author/${params.id}`;
    else if (route === 'reader' && params.novelId) newPath = `/?route=reader&novelId=${params.novelId}${params.episodeId ? `&episodeId=${params.episodeId}` : ''}`;
    else newPath = `/${route}`;

    window.history.pushState({ route, params }, '', newPath);
  };

  // SEO JSON-LD schema injection
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://novelsgallery.com/#website',
          'url': 'https://novelsgallery.com',
          'name': 'Novels Gallery',
          'description': 'The premier digital library and reading sanctuary for Urdu novels and classical literature.',
          'publisher': {
            '@type': 'Organization',
            'name': 'Novels Gallery Editorial',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://novelsgallery.com/logo.png'
            }
          }
        },
        {
          '@type': 'DigitalDocumentLibrary',
          'name': 'Novels Gallery Urdu Collection',
          'inLanguage': ['ur', 'en'],
          'genre': ['Urdu Literature', 'Novels', 'Classical Poetry', 'Afsanay']
        }
      ]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const isReaderView = currentRoute === 'reader';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EA] text-[#252525]">
      {/* Hide header and footer in distraction-free Reader View */}
      {!isReaderView && (
        <Header currentRoute={currentRoute} navigate={navigate} />
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {currentRoute === 'home' && <HomePage navigate={navigate} />}
        {currentRoute === 'novels' && (
          <NovelsPage 
            navigate={navigate} 
            initialFilter={routeParams.filter} 
            initialSort={routeParams.sort} 
          />
        )}
        {currentRoute === 'novel-detail' && (
          <NovelDetailPage 
            novelId={routeParams.id || ''} 
            navigate={navigate} 
          />
        )}
        {currentRoute === 'reader' && (
          <ReaderPage 
            novelId={routeParams.novelId || ''} 
            episodeId={routeParams.episodeId} 
            navigate={navigate} 
          />
        )}
        {currentRoute === 'episodes' && <EpisodesPage navigate={navigate} />}
        {currentRoute === 'authors' && <AuthorsPage navigate={navigate} />}
        {currentRoute === 'author-detail' && (
          <AuthorDetailPage 
            authorId={routeParams.id || ''} 
            navigate={navigate} 
          />
        )}
        {currentRoute === 'premium' && <PremiumPage navigate={navigate} />}
        {currentRoute === 'ebooks' && <EbooksPage navigate={navigate} />}
        {currentRoute === 'classical' && <ClassicalPage navigate={navigate} />}
        {currentRoute === 'profile' && (
          <UserProfilePage 
            initialTab={routeParams.tab} 
            navigate={navigate} 
          />
        )}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'page' && (
          <CustomPageView 
            slug={routeParams.slug} 
            navigate={navigate} 
          />
        )}
        {currentRoute === 'admin' && <AdminDashboard navigate={navigate} />}
      </main>

      {!isReaderView && (
        <Footer navigate={navigate} />
      )}

      {/* Global Interactive Modals */}
      <SearchModal navigate={navigate} />
      <AuthModal />
      <PurchaseModal />
      <PdfReaderModal 
        isOpen={!!activePdfDoc} 
        onClose={closePdfReader} 
        document={activePdfDoc} 
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
