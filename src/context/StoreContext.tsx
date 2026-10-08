import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Novel, Episode, Author, Ebook, ClassicalWork, SiteSettings, 
  User, Bookmark, ReadingProgress, PurchaseRecord, CustomPage, PublishStatus 
} from '../types';
import { 
  SEED_NOVELS, SEED_EPISODES, SEED_AUTHORS, 
  SEED_EBOOKS, SEED_CLASSICAL, DEFAULT_SITE_SETTINGS 
} from '../data/seedData';
import { SEED_PAGES } from '../data/seedPages';
import { api } from '../services/api';

interface PurchaseTarget {
  type: 'novel' | 'episode' | 'ebook';
  id: string;
  title: string;
  price: number;
}

interface DbStatusInfo {
  isConnected: boolean;
  lastSynced: string;
  storage: string;
  counts: {
    novels: number;
    authors: number;
    episodes: number;
    ebooks: number;
    pages: number;
    classicalWorks: number;
  };
}

interface StoreContextType {
  // Data
  novels: Novel[];
  episodes: Episode[];
  authors: Author[];
  ebooks: Ebook[];
  classicalWorks: ClassicalWork[];
  pages: CustomPage[];
  siteSettings: SiteSettings;
  currentUser: User | null;
  purchases: PurchaseRecord[];
  favorites: string[];
  bookmarks: Bookmark[];
  readingHistory: ReadingProgress[];

  // Production DB Status & Synchronization
  dbStatus: DbStatusInfo;
  isSyncing: boolean;
  refreshFromDatabase: () => Promise<void>;
  uploadPersistentFile: (file: File) => Promise<{ url: string; fileName: string; fileSize: string }>;

  // Modals & UI State
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  purchaseTarget: PurchaseTarget | null;
  openPurchaseModal: (target: PurchaseTarget) => void;
  closePurchaseModal: () => void;
  activePdfDoc: any | null;
  openPdfReader: (doc: any) => void;
  closePdfReader: () => void;

  // Novel CRUD & Publishing
  addNovel: (novel: Omit<Novel, 'id' | 'rating' | 'totalReviews' | 'viewsCount' | 'likesCount'>) => string;
  updateNovel: (id: string, updates: Partial<Novel>) => void;
  deleteNovel: (id: string) => void;
  toggleFeaturedNovel: (id: string) => void;
  setNovelPublishStatus: (id: string, status: PublishStatus, date?: string, time?: string) => void;

  // Episode CRUD & Publishing
  addEpisode: (ep: Omit<Episode, 'id' | 'views'>) => string;
  updateEpisode: (id: string, updates: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  setEpisodePublishStatus: (id: string, status: PublishStatus, date?: string, time?: string) => void;

  // Author CRUD & Publishing
  addAuthor: (author: Omit<Author, 'id' | 'followersCount'>) => string;
  updateAuthor: (id: string, updates: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
  setAuthorPublishStatus: (id: string, status: PublishStatus, date?: string, time?: string) => void;

  // Ebook CRUD & Publishing
  addEbook: (ebook: Omit<Ebook, 'id'>) => string;
  updateEbook: (id: string, updates: Partial<Ebook>) => void;
  deleteEbook: (id: string) => void;
  setEbookPublishStatus: (id: string, status: PublishStatus, date?: string, time?: string) => void;

  // Classical CRUD
  addClassicalWork: (work: Omit<ClassicalWork, 'id'>) => string;
  updateClassicalWork: (id: string, updates: Partial<ClassicalWork>) => void;
  deleteClassicalWork: (id: string) => void;

  // Dynamic Custom Pages CRUD & Publishing
  addPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
  setPagePublishStatus: (id: string, status: PublishStatus, date?: string, time?: string) => void;

  // Settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetToDefaultData: () => Promise<void>;

  // User & Social actions
  login: (email: string, name?: string, role?: 'reader' | 'admin') => void;
  logout: () => void;
  switchUserRole: (role: 'reader' | 'admin') => void;
  toggleFavorite: (novelId: string) => void;
  isFavorite: (novelId: string) => boolean;
  saveBookmark: (novelId: string, episodeId: string, paragraphIndex: number, note?: string) => void;
  removeBookmark: (id: string) => void;
  updateReadingProgress: (novelId: string, episodeId: string, episodeNumber: number, progressPercent: number) => void;
  purchaseItem: (target: PurchaseTarget) => Promise<boolean>;
  hasPurchased: (type: 'novel' | 'episode' | 'ebook', id: string) => boolean;
  canAccessEpisode: (episode: Episode, novel: Novel) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NOVELS: 'ng_novels_v2',
  EPISODES: 'ng_episodes_v2',
  AUTHORS: 'ng_authors_v2',
  EBOOKS: 'ng_ebooks_v2',
  CLASSICAL: 'ng_classical_v2',
  PAGES: 'ng_pages_v2',
  SETTINGS: 'ng_settings_v2',
  USER: 'ng_user_v2',
  PURCHASES: 'ng_purchases_v2',
  FAVORITES: 'ng_favorites_v2',
  BOOKMARKS: 'ng_bookmarks_v2',
  HISTORY: 'ng_history_v2',
};

const DEFAULT_READER_USER: User = {
  id: 'user-demo-reader',
  name: 'Ayesha Khan',
  email: 'ayesha.reader@example.com',
  role: 'reader',
  joinedDate: 'Jan 2024',
  avatarUrl: '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
  walletBalance: 2500,
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State from cache or seed
  const [novels, setNovels] = useState<Novel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOVELS);
      return saved ? JSON.parse(saved) : SEED_NOVELS;
    } catch {
      return SEED_NOVELS;
    }
  });

  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EPISODES);
      return saved ? JSON.parse(saved) : SEED_EPISODES;
    } catch {
      return SEED_EPISODES;
    }
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTHORS);
      return saved ? JSON.parse(saved) : SEED_AUTHORS;
    } catch {
      return SEED_AUTHORS;
    }
  });

  const [ebooks, setEbooks] = useState<Ebook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EBOOKS);
      return saved ? JSON.parse(saved) : SEED_EBOOKS;
    } catch {
      return SEED_EBOOKS;
    }
  });

  const [classicalWorks, setClassicalWorks] = useState<ClassicalWork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSICAL);
      return saved ? JSON.parse(saved) : SEED_CLASSICAL;
    } catch {
      return SEED_CLASSICAL;
    }
  });

  const [pages, setPages] = useState<CustomPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGES);
      return saved ? JSON.parse(saved) : SEED_PAGES;
    } catch {
      return SEED_PAGES;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_READER_USER;
    } catch {
      return DEFAULT_READER_USER;
    }
  });

  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'pur-1',
          userId: 'user-demo-reader',
          itemType: 'novel',
          itemId: 'novel-jannat-kay-pattay',
          itemTitle: 'Jannat Kay Pattay',
          amount: 0,
          purchasedAt: '2024-02-01',
        }
      ];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['novel-jannat-kay-pattay', 'novel-peer-e-kamil'];
    } catch {
      return ['novel-jannat-kay-pattay', 'novel-peer-e-kamil'];
    }
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState<PurchaseTarget | null>(null);
  const [activePdfDoc, setActivePdfDoc] = useState<any | null>(null);

  // Production Database Synchronization State
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatusInfo>({
    isConnected: false,
    lastSynced: 'Connecting...',
    storage: 'persistent-disk',
    counts: {
      novels: novels.length,
      authors: authors.length,
      episodes: episodes.length,
      ebooks: ebooks.length,
      pages: pages.length,
      classicalWorks: classicalWorks.length,
    }
  });

  // 2. Fetch full production database from server on mount
  const refreshFromDatabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const data = await api.getDatabase();
      if (data && Array.isArray(data.novels)) {
        setNovels(data.novels);
        if (data.episodes) setEpisodes(data.episodes);
        if (data.authors) setAuthors(data.authors);
        if (data.ebooks) setEbooks(data.ebooks);
        if (data.classicalWorks) setClassicalWorks(data.classicalWorks);
        if (data.pages) setPages(data.pages);
        if (data.siteSettings) setSiteSettings(data.siteSettings);

        setDbStatus({
          isConnected: true,
          lastSynced: new Date().toLocaleTimeString(),
          storage: 'Persistent Disk (production-db.json)',
          counts: {
            novels: data.novels.length,
            authors: (data.authors || []).length,
            episodes: (data.episodes || []).length,
            ebooks: (data.ebooks || []).length,
            pages: (data.pages || []).length,
            classicalWorks: (data.classicalWorks || []).length,
          }
        });
      }
    } catch (err) {
      console.warn('[Sync] Server DB fetch fallback to local cache:', err);
      setDbStatus(prev => ({
        ...prev,
        isConnected: false,
        lastSynced: 'Local Cache Active',
      }));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  // Sync to LocalStorage (Instant offline cache)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOVELS, JSON.stringify(novels));
  }, [novels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  }, [episodes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
  }, [authors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EBOOKS, JSON.stringify(ebooks));
  }, [ebooks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSICAL, JSON.stringify(classicalWorks));
  }, [classicalWorks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(readingHistory));
  }, [readingHistory]);

  // PDF modal helpers
  const openPdfReader = (doc: any) => {
    setActivePdfDoc(doc);
  };

  const closePdfReader = () => {
    setActivePdfDoc(null);
  };

  // Persistent File & Image Upload Helper
  const uploadPersistentFile = async (file: File) => {
    const res = await api.uploadFile(file);
    return {
      url: res.url,
      fileName: res.fileName,
      fileSize: res.fileSize,
    };
  };

  // ==========================================
  // CRUD Implementations with Production Sync
  // ==========================================

  // Novel CRUD
  const addNovel = (novelData: Omit<Novel, 'id' | 'rating' | 'totalReviews' | 'viewsCount' | 'likesCount'>): string => {
    const id = `novel-${Date.now()}`;
    const newNovel: Novel = {
      ...novelData,
      id,
      rating: 5.0,
      totalReviews: 1,
      viewsCount: 10,
      likesCount: 1,
      publishStatus: novelData.publishStatus || 'published',
      isPublished: (novelData.publishStatus || 'published') === 'published',
      publicationDate: novelData.publicationDate || new Date().toISOString().split('T')[0],
      publicationTime: novelData.publicationTime || '12:00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Immediate optimistic update
    setNovels(prev => [newNovel, ...prev]);

    // Persist to production server database
    api.createNovel(newNovel).catch(err => {
      console.error('[DB] Error saving novel to production DB:', err);
    });

    return id;
  };

  const updateNovel = (id: string, updates: Partial<Novel>) => {
    setNovels(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
    api.updateNovel(id, updates).catch(err => {
      console.error('[DB] Error updating novel in production DB:', err);
    });
  };

  const deleteNovel = (id: string) => {
    setNovels(prev => prev.filter(n => n.id !== id));
    setEpisodes(prev => prev.filter(ep => ep.novelId !== id));
    api.deleteNovel(id).catch(err => {
      console.error('[DB] Error deleting novel in production DB:', err);
    });
  };

  const toggleFeaturedNovel = (id: string) => {
    const novel = novels.find(n => n.id === id);
    if (novel) {
      const nextFeatured = !novel.isFeatured;
      updateNovel(id, { isFeatured: nextFeatured });
    }
  };

  const setNovelPublishStatus = (id: string, status: PublishStatus, date?: string, time?: string) => {
    const updates: Partial<Novel> = {
      publishStatus: status,
      isPublished: status === 'published',
      ...(date ? { publicationDate: date } : {}),
      ...(time ? { publicationTime: time } : {}),
    };
    updateNovel(id, updates);
  };

  // Episode CRUD
  const addEpisode = (epData: Omit<Episode, 'id' | 'views'>): string => {
    const id = `ep-${Date.now()}`;
    const newEp: Episode = {
      ...epData,
      id,
      views: 1,
      publishStatus: epData.publishStatus || 'published',
      isPublished: (epData.publishStatus || 'published') === 'published',
      publishedDate: epData.publishedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEpisodes(prev => [...prev, newEp]);
    setNovels(prev => prev.map(n => {
      if (n.id === epData.novelId) {
        return { ...n, episodesCount: (n.episodesCount || 0) + 1 };
      }
      return n;
    }));

    api.createEpisode(newEp).catch(err => {
      console.error('[DB] Error creating episode in production DB:', err);
    });

    return id;
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    setEpisodes(prev => prev.map(ep => ep.id === id ? { ...ep, ...updates, updatedAt: new Date().toISOString() } : ep));
    api.updateEpisode(id, updates).catch(err => {
      console.error('[DB] Error updating episode in production DB:', err);
    });
  };

  const deleteEpisode = (id: string) => {
    const ep = episodes.find(e => e.id === id);
    setEpisodes(prev => prev.filter(e => e.id !== id));
    if (ep) {
      setNovels(prev => prev.map(n => {
        if (n.id === ep.novelId) {
          return { ...n, episodesCount: Math.max(0, (n.episodesCount || 1) - 1) };
        }
        return n;
      }));
    }
    api.deleteEpisode(id).catch(err => {
      console.error('[DB] Error deleting episode in production DB:', err);
    });
  };

  const setEpisodePublishStatus = (id: string, status: PublishStatus, date?: string, time?: string) => {
    updateEpisode(id, {
      publishStatus: status,
      isPublished: status === 'published',
      ...(date ? { publishedDate: date } : {}),
      ...(time ? { publicationTime: time } : {}),
    });
  };

  // Author CRUD
  const addAuthor = (authorData: Omit<Author, 'id' | 'followersCount'>): string => {
    const id = `author-${Date.now()}`;
    const newAuthor: Author = {
      ...authorData,
      id,
      followersCount: 120,
      publishStatus: authorData.publishStatus || 'published',
      publicationDate: authorData.publicationDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAuthors(prev => [newAuthor, ...prev]);
    api.createAuthor(newAuthor).catch(err => {
      console.error('[DB] Error creating author in production DB:', err);
    });

    return id;
  };

  const updateAuthor = (id: string, updates: Partial<Author>) => {
    setAuthors(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    api.updateAuthor(id, updates).catch(err => {
      console.error('[DB] Error updating author in production DB:', err);
    });
  };

  const deleteAuthor = (id: string) => {
    setAuthors(prev => prev.filter(a => a.id !== id));
    api.deleteAuthor(id).catch(err => {
      console.error('[DB] Error deleting author in production DB:', err);
    });
  };

  const setAuthorPublishStatus = (id: string, status: PublishStatus, date?: string, time?: string) => {
    updateAuthor(id, {
      publishStatus: status,
      ...(date ? { publicationDate: date } : {}),
      ...(time ? { publicationTime: time } : {}),
    });
  };

  // Ebook CRUD
  const addEbook = (ebookData: Omit<Ebook, 'id'>): string => {
    const id = `ebook-${Date.now()}`;
    const newEbook: Ebook = {
      ...ebookData,
      id,
      publishStatus: ebookData.publishStatus || 'published',
      isPublished: (ebookData.publishStatus || 'published') === 'published',
      publicationDate: ebookData.publicationDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEbooks(prev => [newEbook, ...prev]);
    api.createEbook(newEbook).catch(err => {
      console.error('[DB] Error creating ebook in production DB:', err);
    });

    return id;
  };

  const updateEbook = (id: string, updates: Partial<Ebook>) => {
    setEbooks(prev => prev.map(eb => eb.id === id ? { ...eb, ...updates, updatedAt: new Date().toISOString() } : eb));
    api.updateEbook(id, updates).catch(err => {
      console.error('[DB] Error updating ebook in production DB:', err);
    });
  };

  const deleteEbook = (id: string) => {
    setEbooks(prev => prev.filter(eb => eb.id !== id));
    api.deleteEbook(id).catch(err => {
      console.error('[DB] Error deleting ebook in production DB:', err);
    });
  };

  const setEbookPublishStatus = (id: string, status: PublishStatus, date?: string, time?: string) => {
    updateEbook(id, {
      publishStatus: status,
      isPublished: status === 'published',
      ...(date ? { publicationDate: date } : {}),
      ...(time ? { publicationTime: time } : {}),
    });
  };

  // Classical Works CRUD
  const addClassicalWork = (workData: Omit<ClassicalWork, 'id'>): string => {
    const id = `classical-${Date.now()}`;
    const newWork: ClassicalWork = { ...workData, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setClassicalWorks(prev => [newWork, ...prev]);
    api.createClassical(newWork).catch(err => {
      console.error('[DB] Error creating classical work in production DB:', err);
    });
    return id;
  };

  const updateClassicalWork = (id: string, updates: Partial<ClassicalWork>) => {
    setClassicalWorks(prev => prev.map(cw => cw.id === id ? { ...cw, ...updates, updatedAt: new Date().toISOString() } : cw));
    api.updateClassical(id, updates).catch(err => {
      console.error('[DB] Error updating classical work in production DB:', err);
    });
  };

  const deleteClassicalWork = (id: string) => {
    setClassicalWorks(prev => prev.filter(cw => cw.id !== id));
    api.deleteClassical(id).catch(err => {
      console.error('[DB] Error deleting classical work in production DB:', err);
    });
  };

  // Dynamic Custom Pages CRUD
  const addPage = (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `page-${Date.now()}`;
    const newPage: CustomPage = {
      ...pageData,
      id,
      publishStatus: pageData.publishStatus || 'published',
      isPublished: pageData.publishStatus === 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages(prev => [newPage, ...prev]);
    api.createPage(newPage).catch(err => {
      console.error('[DB] Error saving custom page to production DB:', err);
    });

    return id;
  };

  const updatePage = (id: string, updates: Partial<CustomPage>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    api.updatePage(id, updates).catch(err => {
      console.error('[DB] Error updating custom page in production DB:', err);
    });
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    api.deletePage(id).catch(err => {
      console.error('[DB] Error deleting custom page in production DB:', err);
    });
  };

  const setPagePublishStatus = (id: string, status: PublishStatus, date?: string, time?: string) => {
    updatePage(id, {
      publishStatus: status,
      isPublished: status === 'published',
      ...(date ? { publicationDate: date } : {}),
      ...(time ? { publicationTime: time } : {}),
    });
  };

  // Site Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
    api.updateSettings(settings).catch(err => {
      console.error('[DB] Error updating settings in production DB:', err);
    });
  };

  const resetToDefaultData = async () => {
    try {
      await api.resetSeed();
      await refreshFromDatabase();
    } catch {
      setNovels(SEED_NOVELS);
      setEpisodes(SEED_EPISODES);
      setAuthors(SEED_AUTHORS);
      setEbooks(SEED_EBOOKS);
      setClassicalWorks(SEED_CLASSICAL);
      setPages(SEED_PAGES);
      setSiteSettings(DEFAULT_SITE_SETTINGS);
      setCurrentUser(DEFAULT_READER_USER);
    }
  };

  // User & Social Actions
  const login = (email: string, name?: string, role: 'reader' | 'admin' = 'reader') => {
    const user: User = {
      id: `user-${Date.now()}`,
      name: name || (role === 'admin' ? 'Editorial Admin' : email.split('@')[0]),
      email,
      role,
      joinedDate: 'Today',
      avatarUrl: role === 'admin' 
        ? '/src/assets/images/hero_library_urdu_1791359887842.jpg'
        : '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
      walletBalance: role === 'admin' ? 10000 : 2500,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (role: 'reader' | 'admin') => {
    if (!currentUser) {
      login(role === 'admin' ? 'admin@novelsgallery.com' : 'ayesha@novelsgallery.com', undefined, role);
      return;
    }
    setCurrentUser({
      ...currentUser,
      role,
      name: role === 'admin' ? 'Editorial Admin' : 'Ayesha Khan',
      walletBalance: role === 'admin' ? 10000 : 2500,
    });
  };

  const toggleFavorite = (novelId: string) => {
    setFavorites(prev => 
      prev.includes(novelId) ? prev.filter(id => id !== novelId) : [...prev, novelId]
    );
  };

  const isFavorite = (novelId: string) => favorites.includes(novelId);

  const saveBookmark = (novelId: string, episodeId: string, paragraphIndex: number, note?: string) => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      novelId,
      episodeId,
      paragraphIndex,
      timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      note
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const updateReadingProgress = (
    novelId: string, 
    episodeId: string, 
    episodeNumber: number, 
    progressPercent: number
  ) => {
    setReadingHistory(prev => {
      const filtered = prev.filter(h => !(h.novelId === novelId && h.episodeId === episodeId));
      return [
        {
          novelId,
          episodeId,
          episodeNumber,
          progressPercent: Math.min(100, Math.max(0, Math.round(progressPercent))),
          lastReadAt: new Date().toISOString()
        },
        ...filtered
      ];
    });
  };

  const openPurchaseModal = (target: PurchaseTarget) => {
    setPurchaseTarget(target);
  };

  const closePurchaseModal = () => {
    setPurchaseTarget(null);
  };

  const hasPurchased = (type: 'novel' | 'episode' | 'ebook', id: string): boolean => {
    if (currentUser?.role === 'admin') return true;
    return purchases.some(p => p.itemType === type && p.itemId === id);
  };

  const canAccessEpisode = (episode: Episode, novel: Novel): boolean => {
    if (currentUser?.role === 'admin') return true;
    if (!novel.isPremium && !episode.isPremium) return true;
    if (hasPurchased('novel', novel.id)) return true;
    if (hasPurchased('episode', episode.id)) return true;
    return false;
  };

  const purchaseItem = async (target: PurchaseTarget): Promise<boolean> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }

    const newRecord: PurchaseRecord = {
      id: `pur-${Date.now()}`,
      userId: currentUser.id,
      itemType: target.type,
      itemId: target.id,
      itemTitle: target.title,
      amount: target.price,
      purchasedAt: new Date().toISOString().split('T')[0]
    };

    setPurchases(prev => [newRecord, ...prev]);
    setCurrentUser(prev => prev ? {
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - target.price)
    } : null);

    setPurchaseTarget(null);
    return true;
  };

  return (
    <StoreContext.Provider value={{
      novels,
      episodes,
      authors,
      ebooks,
      classicalWorks,
      pages,
      siteSettings,
      currentUser,
      purchases,
      favorites,
      bookmarks,
      readingHistory,
      dbStatus,
      isSyncing,
      refreshFromDatabase,
      uploadPersistentFile,
      isSearchOpen,
      setIsSearchOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      purchaseTarget,
      openPurchaseModal,
      closePurchaseModal,
      activePdfDoc,
      openPdfReader,
      closePdfReader,
      addNovel,
      updateNovel,
      deleteNovel,
      toggleFeaturedNovel,
      setNovelPublishStatus,
      addEpisode,
      updateEpisode,
      deleteEpisode,
      setEpisodePublishStatus,
      addAuthor,
      updateAuthor,
      deleteAuthor,
      setAuthorPublishStatus,
      addEbook,
      updateEbook,
      deleteEbook,
      setEbookPublishStatus,
      addClassicalWork,
      updateClassicalWork,
      deleteClassicalWork,
      addPage,
      updatePage,
      deletePage,
      setPagePublishStatus,
      updateSiteSettings,
      resetToDefaultData,
      login,
      logout,
      switchUserRole,
      toggleFavorite,
      isFavorite,
      saveBookmark,
      removeBookmark,
      updateReadingProgress,
      purchaseItem,
      hasPurchased,
      canAccessEpisode,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
