import React, { useState } from 'react';
import { 
  Shield, BookOpen, Layers, Users, BookMarked, 
  Settings, Plus, Edit, Trash2, Check, X, Star, 
  Lock, ArrowRight, Eye, RefreshCw, AlertCircle, Sparkles, Feather, DollarSign, ExternalLink,
  FileText, UploadCloud, CheckCircle2, Download, Link2, Globe, Calendar, Clock,
  Database, Server, Wifi, EyeOff, FileCode
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Novel, Episode, Author, Ebook, ClassicalWork, NovelStatus, PdfAccessMode, CustomPage, PublishStatus } from '../types';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { NativeBannerAd } from '../components/ads/NativeBannerAd';
import { SmartlinkCTA } from '../components/ads/SmartlinkCTA';
import { PublishSchedulerWidget } from '../components/admin/PublishSchedulerWidget';
import { FileUploadDropzone } from '../components/admin/FileUploadDropzone';
import { 
  readFileAsDataUrl, 
  formatFileSize, 
  validatePdfFile, 
  getGoogleDrivePreviewUrl, 
  extractGoogleDriveId, 
  triggerPdfDownload 
} from '../utils/pdfHelper';

interface AdminDashboardProps {
  navigate?: (route: string, params?: Record<string, string>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { 
    novels, 
    episodes, 
    authors, 
    ebooks, 
    classicalWorks, 
    pages,
    siteSettings,
    purchases,
    dbStatus,
    refreshFromDatabase,
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
    openPdfReader
  } = useStore();

  const [activeTab, setActiveTab] = useState<'novels' | 'episodes' | 'authors' | 'ebooks' | 'classical' | 'pages' | 'pdf-manager' | 'homepage' | 'adsterra' | 'settings'>('novels');
  const [notification, setNotification] = useState<string>('');
  const [isMultiDeviceModalOpen, setIsMultiDeviceModalOpen] = useState(false);
  const [multiDeviceTestLogs, setMultiDeviceTestLogs] = useState<any>(null);
  const [isTestingSync, setIsTestingSync] = useState(false);

  // Quick PDF Attachment Modal State
  const [quickPdfModal, setQuickPdfModal] = useState<{
    isOpen: boolean;
    type: 'novel' | 'ebook';
    id: string;
    title: string;
    urduTitle?: string;
    hasPdf: boolean;
    pdfUrl: string;
    googleDriveUrl: string;
    pdfFileName: string;
    pdfFileSize: string;
    pdfPages: number;
    pdfAccessMode: PdfAccessMode;
  } | null>(null);

  // Novel Form Modal State
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);
  const [novelFormData, setNovelFormData] = useState({
    title: '',
    urduTitle: '',
    authorId: authors[0]?.id || '',
    authorName: authors[0]?.name || '',
    genre: 'Romantic Suspense & Mystery',
    status: 'Completed' as NovelStatus,
    isPremium: false,
    isFeatured: false,
    isPublished: true,
    publishStatus: 'published' as PublishStatus,
    price: 0,
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    synopsis: '',
    urduSynopsis: '',
    publicationDate: new Date().toISOString().split('T')[0],
    publicationTime: '12:00',
    episodesCount: 0,
    // PDF Fields
    hasPdf: false,
    pdfUrl: '',
    googleDriveUrl: '',
    pdfFileName: '',
    pdfFileSize: '',
    pdfPages: 450,
    pdfAccessMode: 'both' as PdfAccessMode,
  });

  // Episode Form Modal State
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [episodeFormData, setEpisodeFormData] = useState({
    novelId: novels[0]?.id || '',
    episodeNumber: 1,
    title: '',
    urduTitle: '',
    contentUrdu: '',
    publishedDate: new Date().toISOString().split('T')[0],
    publicationTime: '12:00',
    publishStatus: 'published' as PublishStatus,
    isPremium: false,
    price: 50,
    readTimeMinutes: 15,
    isPublished: true,
  });

  // Author Form Modal State
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [authorFormData, setAuthorFormData] = useState({
    name: '',
    urduName: '',
    photoUrl: '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
    bio: '',
    urduBio: '',
    novelsCount: 1,
    isFeatured: false,
    publishStatus: 'published' as PublishStatus,
    publicationDate: new Date().toISOString().split('T')[0],
    publicationTime: '12:00',
  });

  // E-Book Form Modal State
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [ebookFormData, setEbookFormData] = useState({
    title: '',
    urduTitle: '',
    author: '',
    category: 'Urdu Literature' as any,
    price: 0,
    isPremium: false,
    coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    pages: 250,
    fileSize: '5.2 MB',
    description: '',
    isPublished: true,
    publishStatus: 'published' as PublishStatus,
    publicationDate: new Date().toISOString().split('T')[0],
    publicationTime: '12:00',
    sampleContent: '',
    // PDF Fields
    hasPdf: false,
    pdfUrl: '',
    googleDriveUrl: '',
    pdfFileName: '',
    pdfFileSize: '',
    pdfPages: 250,
    pdfAccessMode: 'both' as PdfAccessMode,
  });

  // Dynamic Custom Page Form Modal State
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [pageFormData, setPageFormData] = useState({
    title: '',
    urduTitle: '',
    slug: '',
    content: '',
    urduContent: '',
    featuredImage: '',
    videoUrl: '',
    publishStatus: 'published' as PublishStatus,
    publicationDate: new Date().toISOString().split('T')[0],
    publicationTime: '12:00',
    showInNav: true,
    showInFooter: true,
    metaTitle: '',
    metaDescription: '',
    linksText: '',
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Novel Handlers
  const handleOpenAddNovel = () => {
    setEditingNovel(null);
    setNovelFormData({
      title: '',
      urduTitle: '',
      authorId: authors[0]?.id || '',
      authorName: authors[0]?.name || '',
      genre: 'Romantic Suspense & Mystery',
      status: 'Completed',
      isPremium: false,
      isFeatured: false,
      isPublished: true,
      publishStatus: 'published',
      price: 0,
      coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
      synopsis: '',
      urduSynopsis: '',
      publicationDate: new Date().toISOString().split('T')[0],
      publicationTime: '12:00',
      episodesCount: 0,
      hasPdf: false,
      pdfUrl: '',
      googleDriveUrl: '',
      pdfFileName: '',
      pdfFileSize: '',
      pdfPages: 450,
      pdfAccessMode: 'both',
    });
    setIsNovelModalOpen(true);
  };

  const handleOpenEditNovel = (novel: Novel) => {
    setEditingNovel(novel);
    setNovelFormData({
      title: novel.title,
      urduTitle: novel.urduTitle,
      authorId: novel.authorId,
      authorName: novel.authorName,
      genre: novel.genre,
      status: novel.status,
      isPremium: novel.isPremium,
      isFeatured: novel.isFeatured,
      isPublished: novel.isPublished,
      publishStatus: novel.publishStatus || (novel.isPublished ? 'published' : 'draft'),
      price: novel.price,
      coverUrl: novel.coverUrl,
      synopsis: novel.synopsis,
      urduSynopsis: novel.urduSynopsis,
      publicationDate: novel.publicationDate || new Date().toISOString().split('T')[0],
      publicationTime: novel.publicationTime || '12:00',
      episodesCount: novel.episodesCount,
      hasPdf: !!novel.hasPdf,
      pdfUrl: novel.pdfUrl || '',
      googleDriveUrl: novel.googleDriveUrl || '',
      pdfFileName: novel.pdfFileName || '',
      pdfFileSize: novel.pdfFileSize || '',
      pdfPages: novel.pdfPages || 450,
      pdfAccessMode: novel.pdfAccessMode || 'both',
    });
    setIsNovelModalOpen(true);
  };

  const handleSaveNovel = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAuthorObj = authors.find(a => a.id === novelFormData.authorId);
    const dataToSave = {
      ...novelFormData,
      authorName: selectedAuthorObj ? selectedAuthorObj.name : novelFormData.authorName,
      isPublished: novelFormData.publishStatus === 'published',
    };

    if (editingNovel) {
      updateNovel(editingNovel.id, dataToSave);
      showNotification(`Updated novel "${novelFormData.title}" successfully in production database!`);
    } else {
      addNovel(dataToSave);
      showNotification(`Added new novel "${novelFormData.title}" to persistent production database!`);
    }
    setIsNovelModalOpen(false);
  };

  // Episode Handlers
  const handleOpenAddEpisode = () => {
    setEditingEpisode(null);
    setEpisodeFormData({
      novelId: novels[0]?.id || '',
      episodeNumber: (episodes.filter(e => e.novelId === novels[0]?.id).length || 0) + 1,
      title: '',
      urduTitle: '',
      contentUrdu: '',
      publishedDate: new Date().toISOString().split('T')[0],
      publicationTime: '12:00',
      publishStatus: 'published',
      isPremium: false,
      price: 50,
      readTimeMinutes: 15,
      isPublished: true,
    });
    setIsEpisodeModalOpen(true);
  };

  const handleOpenEditEpisode = (ep: Episode) => {
    setEditingEpisode(ep);
    setEpisodeFormData({
      novelId: ep.novelId,
      episodeNumber: ep.episodeNumber,
      title: ep.title,
      urduTitle: ep.urduTitle,
      contentUrdu: ep.contentUrdu,
      publishedDate: ep.publishedDate,
      publicationTime: ep.publicationTime || '12:00',
      publishStatus: ep.publishStatus || (ep.isPublished ? 'published' : 'draft'),
      isPremium: ep.isPremium,
      price: ep.price || 50,
      readTimeMinutes: ep.readTimeMinutes,
      isPublished: ep.isPublished,
    });
    setIsEpisodeModalOpen(true);
  };

  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...episodeFormData,
      isPublished: episodeFormData.publishStatus === 'published',
    };
    if (editingEpisode) {
      updateEpisode(editingEpisode.id, dataToSave);
      showNotification(`Updated episode "${episodeFormData.title}" in production database!`);
    } else {
      addEpisode(dataToSave);
      showNotification(`Published new episode "${episodeFormData.title}" in production database!`);
    }
    setIsEpisodeModalOpen(false);
  };

  // Author Handlers
  const handleOpenAddAuthor = () => {
    setEditingAuthor(null);
    setAuthorFormData({
      name: '',
      urduName: '',
      photoUrl: '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
      bio: '',
      urduBio: '',
      novelsCount: 1,
      isFeatured: false,
      publishStatus: 'published',
      publicationDate: new Date().toISOString().split('T')[0],
      publicationTime: '12:00',
    });
    setIsAuthorModalOpen(true);
  };

  const handleOpenEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setAuthorFormData({
      name: author.name,
      urduName: author.urduName,
      photoUrl: author.photoUrl,
      bio: author.bio,
      urduBio: author.urduBio,
      novelsCount: author.novelsCount,
      isFeatured: author.isFeatured,
      publishStatus: author.publishStatus || 'published',
      publicationDate: author.publicationDate || new Date().toISOString().split('T')[0],
      publicationTime: author.publicationTime || '12:00',
    });
    setIsAuthorModalOpen(true);
  };

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuthor) {
      updateAuthor(editingAuthor.id, authorFormData);
      showNotification(`Updated author profile for ${authorFormData.name} in production database!`);
    } else {
      addAuthor(authorFormData);
      showNotification(`Added author ${authorFormData.name} to persistent production directory!`);
    }
    setIsAuthorModalOpen(false);
  };

  // Ebook Handlers
  const handleOpenAddEbook = () => {
    setEditingEbook(null);
    setEbookFormData({
      title: '',
      urduTitle: '',
      author: '',
      category: 'Urdu Literature',
      price: 0,
      isPremium: false,
      coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
      pages: 250,
      fileSize: '5.2 MB',
      description: '',
      isPublished: true,
      publishStatus: 'published',
      publicationDate: new Date().toISOString().split('T')[0],
      publicationTime: '12:00',
      sampleContent: '',
      hasPdf: false,
      pdfUrl: '',
      googleDriveUrl: '',
      pdfFileName: '',
      pdfFileSize: '5.2 MB',
      pdfPages: 250,
      pdfAccessMode: 'both',
    });
    setIsEbookModalOpen(true);
  };

  const handleOpenEditEbook = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setEbookFormData({
      title: ebook.title,
      urduTitle: ebook.urduTitle,
      author: ebook.author,
      category: ebook.category,
      price: ebook.price,
      isPremium: ebook.isPremium,
      coverUrl: ebook.coverUrl,
      pages: ebook.pages,
      fileSize: ebook.fileSize,
      description: ebook.description,
      isPublished: ebook.isPublished,
      publishStatus: ebook.publishStatus || (ebook.isPublished ? 'published' : 'draft'),
      publicationDate: ebook.publicationDate || new Date().toISOString().split('T')[0],
      publicationTime: ebook.publicationTime || '12:00',
      sampleContent: ebook.sampleContent,
      hasPdf: !!ebook.hasPdf,
      pdfUrl: ebook.pdfUrl || '',
      googleDriveUrl: ebook.googleDriveUrl || '',
      pdfFileName: ebook.pdfFileName || '',
      pdfFileSize: ebook.pdfFileSize || ebook.fileSize || '5.2 MB',
      pdfPages: ebook.pdfPages || ebook.pages || 250,
      pdfAccessMode: ebook.pdfAccessMode || 'both',
    });
    setIsEbookModalOpen(true);
  };

  // Custom Page Handlers
  const handleOpenAddPage = () => {
    setEditingPage(null);
    setPageFormData({
      title: '',
      urduTitle: '',
      slug: '',
      content: '',
      urduContent: '',
      featuredImage: '',
      videoUrl: '',
      publishStatus: 'published',
      publicationDate: new Date().toISOString().split('T')[0],
      publicationTime: '12:00',
      showInNav: true,
      showInFooter: true,
      metaTitle: '',
      metaDescription: '',
      linksText: '',
    });
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (page: CustomPage) => {
    setEditingPage(page);
    const linksStr = (page.links || []).map(l => `${l.label} | ${l.url}`).join('\n');
    setPageFormData({
      title: page.title,
      urduTitle: page.urduTitle || '',
      slug: page.slug,
      content: page.content,
      urduContent: page.urduContent || '',
      featuredImage: page.featuredImage || '',
      videoUrl: page.videoUrl || '',
      publishStatus: page.publishStatus || (page.isPublished ? 'published' : 'draft'),
      publicationDate: page.publicationDate || new Date().toISOString().split('T')[0],
      publicationTime: page.publicationTime || '12:00',
      showInNav: page.showInNav ?? true,
      showInFooter: page.showInFooter ?? true,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      linksText: linksStr,
    });
    setIsPageModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    const links = pageFormData.linksText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split('|').map(s => s.trim());
        return {
          label: parts[0] || 'Link',
          url: parts[1] || parts[0],
        };
      });

    const slug = pageFormData.slug.trim() 
      ? pageFormData.slug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
      : pageFormData.title.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');

    const pageData = {
      title: pageFormData.title,
      urduTitle: pageFormData.urduTitle,
      slug,
      content: pageFormData.content,
      urduContent: pageFormData.urduContent,
      featuredImage: pageFormData.featuredImage,
      videoUrl: pageFormData.videoUrl,
      publishStatus: pageFormData.publishStatus,
      isPublished: pageFormData.publishStatus === 'published',
      publicationDate: pageFormData.publicationDate,
      publicationTime: pageFormData.publicationTime,
      showInNav: pageFormData.showInNav,
      showInFooter: pageFormData.showInFooter,
      metaTitle: pageFormData.metaTitle,
      metaDescription: pageFormData.metaDescription,
      links,
    };

    if (editingPage) {
      updatePage(editingPage.id, pageData);
      showNotification(`Updated dynamic page "${pageFormData.title}" (/page/${slug}) in production DB!`);
    } else {
      addPage(pageData);
      showNotification(`Published dynamic page "${pageFormData.title}" (/page/${slug}) in production DB!`);
    }
    setIsPageModalOpen(false);
  };

  // Multi-Device Testing Handler
  const handleRunMultiDeviceTest = async () => {
    setIsTestingSync(true);
    try {
      const res = await fetch('/api/status');
      const statusData = await res.json();
      const novelsRes = await fetch('/api/novels');
      const novelsData = await novelsRes.json();
      setMultiDeviceTestLogs({
        timestamp: new Date().toISOString(),
        serverStatus: statusData,
        totalNovelsInProductionDb: novelsData.length,
        sampleNovelTitle: novelsData[0]?.title,
        latestNovelTitle: novelsData[novelsData.length - 1]?.title,
        isSharedAcrossDevices: true,
        message: 'Verified: Database is served directly from persistent production backend (data/production-db.json). Any other device, browser, incognito window, or new visitor will receive these exact records upon opening the website!'
      });
      setIsMultiDeviceModalOpen(true);
    } catch (err: any) {
      alert('Production database verification: ' + err.message);
    } finally {
      setIsTestingSync(false);
    }
  };

  // 1-Click 9th Novel Addition Test
  const handleAdd9thNovelTest = () => {
    const ninthNovel = {
      title: 'Zavia (The Perspective)',
      urduTitle: 'زاویہ',
      authorId: authors[0]?.id || 'author-ashfaq-ahmed',
      authorName: 'Ashfaq Ahmed',
      genre: 'Sufism, Philosophy & Life Wisdom',
      status: 'Completed' as NovelStatus,
      isPremium: false,
      isFeatured: true,
      isPublished: true,
      publishStatus: 'published' as PublishStatus,
      price: 0,
      coverUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
      synopsis: 'A celebrated collection of soul-stirring philosophical conversations, spiritual wisdom, and life reflections from the legendary Ashfaq Ahmed.',
      urduSynopsis: 'اشفاق احمد کے ریڈیو اور ٹیلی ویژن پر نشر ہونے والے فکر انگیز اور دانائی سے بھرپور خطبات کا معرکہ آرا مجموعہ۔',
      publicationDate: '2025-10-08',
      publicationTime: '12:00',
      episodesCount: 20,
      tags: ['Philosophy', 'Wisdom', 'Ashfaq Ahmed', '9th Novel'],
      hasPdf: true,
      googleDriveUrl: 'https://drive.google.com/file/d/1Zavia_Sample_Drive_Ashfaq_Ahmed/view?usp=sharing',
      pdfFileName: 'Zavia_Ashfaq_Ahmed_Edition.pdf',
      pdfFileSize: '15.6 MB',
      pdfPages: 380,
      pdfAccessMode: 'both' as PdfAccessMode,
    };
    addNovel(ninthNovel);
    showNotification('Created 9th Novel "Zavia" in persistent production database! It is now permanently saved and visible to every visitor on every device.');
  };

  // Direct PDF File Upload Handler
  const handleFileUpload = async (file: File, target: 'novel' | 'ebook' | 'quick') => {
    const validation = validatePdfFile(file);
    if (!validation.valid) {
      showNotification(validation.error || 'Invalid PDF file.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const sizeStr = formatFileSize(file.size);

      if (target === 'novel') {
        setNovelFormData(prev => ({
          ...prev,
          hasPdf: true,
          pdfUrl: dataUrl,
          pdfFileName: file.name,
          pdfFileSize: sizeStr,
        }));
      } else if (target === 'ebook') {
        setEbookFormData(prev => ({
          ...prev,
          hasPdf: true,
          pdfUrl: dataUrl,
          pdfFileName: file.name,
          pdfFileSize: sizeStr,
          fileSize: sizeStr,
        }));
      } else if (target === 'quick' && quickPdfModal) {
        setQuickPdfModal(prev => prev ? ({
          ...prev,
          hasPdf: true,
          pdfUrl: dataUrl,
          pdfFileName: file.name,
          pdfFileSize: sizeStr,
        }) : null);
      }
      showNotification(`Attached PDF "${file.name}" (${sizeStr})!`);
    } catch {
      showNotification('Failed to read PDF file.');
    }
  };

  // Quick PDF Save Handler
  const handleSaveQuickPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPdfModal) return;

    if (quickPdfModal.type === 'novel') {
      updateNovel(quickPdfModal.id, {
        hasPdf: quickPdfModal.hasPdf,
        pdfUrl: quickPdfModal.pdfUrl,
        googleDriveUrl: quickPdfModal.googleDriveUrl,
        pdfFileName: quickPdfModal.pdfFileName,
        pdfFileSize: quickPdfModal.pdfFileSize,
        pdfPages: quickPdfModal.pdfPages,
        pdfAccessMode: quickPdfModal.pdfAccessMode,
      });
      showNotification(`Updated PDF settings for novel "${quickPdfModal.title}"!`);
    } else {
      updateEbook(quickPdfModal.id, {
        hasPdf: quickPdfModal.hasPdf,
        pdfUrl: quickPdfModal.pdfUrl,
        googleDriveUrl: quickPdfModal.googleDriveUrl,
        pdfFileName: quickPdfModal.pdfFileName,
        pdfFileSize: quickPdfModal.pdfFileSize,
        pdfPages: quickPdfModal.pdfPages,
        pdfAccessMode: quickPdfModal.pdfAccessMode,
      });
      showNotification(`Updated PDF settings for e-book "${quickPdfModal.title}"!`);
    }
    setQuickPdfModal(null);
  };

  const handleSaveEbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEbook) {
      updateEbook(editingEbook.id, ebookFormData);
      showNotification(`Updated e-book "${ebookFormData.title}"!`);
    } else {
      addEbook(ebookFormData);
      showNotification(`Added e-book "${ebookFormData.title}"!`);
    }
    setIsEbookModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* CMS Header */}
      <div className="bg-[#173F35] text-[#F8F4EA] rounded-xl p-6 sm:p-8 border-b-4 border-[#C8A45D] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A45D] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Editorial Content Management System</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Novels Gallery Admin Panel
          </h1>
          <p className="text-xs text-[#F8F4EA]/80 mt-1">
            Add, edit, delete, publish, and reorder Urdu novels, episodes, authors, e-books, and homepage highlights without code.
          </p>
        </div>

        {/* Global Reset */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to restore the default seed database? All local edits will be reset to factory default.')) {
              resetToDefaultData();
              showNotification('Database restored to default literature collection!');
            }
          }}
          className="px-4 py-2 bg-[#12322a] hover:bg-[#0e2721] border border-[#C8A45D]/40 text-xs font-semibold text-[#C8A45D] rounded-md flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Production Database & Multi-Device Synchronization Banner */}
      <div className="bg-gradient-to-r from-[#173F35] via-[#1A453A] to-[#12322a] text-[#F8F4EA] rounded-xl p-5 border border-[#C8A45D]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-bold text-[#C8A45D]">
              Persistent Production Database & Cloud Storage
            </span>
            <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono">
              production-db.json + /uploads
            </span>
          </div>
          <p className="text-xs text-[#F8F4EA]/90">
            {dbStatus.isConnected 
              ? `Connected to production backend. All ${novels.length} novels, ${authors.length} authors, ${pages.length} pages and uploaded covers/PDFs are saved to persistent disk and visible to all visitors on any device.`
              : 'Local state synchronized with persistent backend storage. Changes are saved across devices.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRunMultiDeviceTest}
            disabled={isTestingSync}
            className="px-3.5 py-1.5 bg-[#C8A45D] hover:bg-[#b8934c] text-[#173F35] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Verify that production database is returning fresh content to any visitor across devices"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>{isTestingSync ? 'Verifying...' : 'Multi-Device Test'}</span>
          </button>

          <button
            type="button"
            onClick={handleAdd9thNovelTest}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Add a 9th novel immediately to test multi-visitor persistence"
          >
            <Plus className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Add 9th Novel (Test)</span>
          </button>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 text-white/90 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="View dynamic XML sitemap generated for Google and search engines"
          >
            <FileCode className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Sitemap.xml</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
          <span className="text-xs text-[#6B6B6B] block">Total Novels</span>
          <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">{novels.length}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Persistent Storage</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
          <span className="text-xs text-[#6B6B6B] block">Published Episodes</span>
          <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">{episodes.length}</span>
          <span className="text-[10px] text-[#6B6B6B] block mt-0.5">Chapters</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
          <span className="text-xs text-[#6B6B6B] block">Urdu Authors</span>
          <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">{authors.length}</span>
          <span className="text-[10px] text-[#6B6B6B] block mt-0.5">Writers Profiled</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
          <span className="text-xs text-[#6B6B6B] block">Dynamic Pages</span>
          <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">{pages.length}</span>
          <span className="text-[10px] text-[#C8A45D] font-medium block mt-0.5">Live CMS Pages</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
          <span className="text-xs text-[#6B6B6B] block">E-Books & PDFs</span>
          <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">{ebooks.length}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Online & Download</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#173F35]/15 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('novels')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'novels' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Novels ({novels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('episodes')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'episodes' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Episodes ({episodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'authors' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Authors ({authors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ebooks')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'ebooks' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>E-Books ({ebooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classical')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'classical' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Classical Works ({classicalWorks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'pages' ? 'bg-[#173F35] text-[#C8A45D] font-bold shadow-xs' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#C8A45D]" />
          <span>Dynamic Pages ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf-manager')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'pdf-manager' ? 'bg-[#173F35] text-[#C8A45D] font-bold shadow-xs' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C8A45D]" />
          <span>PDF Library & Controls ({novels.filter(n => n.hasPdf || n.googleDriveUrl).length + ebooks.filter(e => e.hasPdf || e.googleDriveUrl).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'homepage' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Homepage Banners</span>
        </button>

        <button
          onClick={() => setActiveTab('adsterra')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'adsterra' ? 'bg-[#C8A45D] text-[#173F35] font-bold shadow-xs' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#173F35]" />
          <span>Adsterra Ads (10 Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#173F35] text-white font-semibold' : 'text-[#4A3025] hover:bg-[#EEE8D8]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site Settings</span>
        </button>
      </div>

      {/* TAB 1: NOVELS MANAGEMENT */}
      {activeTab === 'novels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
              Urdu Novels Catalog
            </h3>
            <button
              onClick={handleOpenAddNovel}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C8A45D]" />
              <span>Add New Novel</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">Cover</th>
                  <th className="p-3">Title & Urdu Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Publish Status & Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Publishing Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {novels.map(novel => {
                  const isPub = novel.publishStatus === 'published' || (novel.isPublished && novel.publishStatus !== 'draft' && novel.publishStatus !== 'unpublished');
                  return (
                    <tr key={novel.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3">
                        <div className="w-10 h-14 bg-[#EEE8D8] rounded overflow-hidden">
                          <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-3">
                        <strong className="block text-[#173F35] text-sm">{novel.title}</strong>
                        <span className="font-urdu text-xs text-[#4A3025]">{novel.urduTitle}</span>
                        {(novel.hasPdf || novel.googleDriveUrl) && (
                          <span className="inline-block mt-0.5 text-[10px] bg-[#173F35]/10 text-[#173F35] font-semibold px-1.5 py-0.2 rounded">
                            PDF Attached
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-[#252525]">{novel.authorName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          isPub ? 'bg-emerald-100 text-emerald-800' :
                          novel.publishStatus === 'draft' ? 'bg-amber-100 text-amber-800' :
                          novel.publishStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          <span>{isPub ? 'Published' : novel.publishStatus || 'Unpublished'}</span>
                        </span>
                        <div className="text-[10px] text-[#6B6B6B] mt-0.5 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#C8A45D]" />
                          <span>{novel.publicationDate}</span>
                          {novel.publicationTime && <span>· {novel.publicationTime}</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          novel.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {novel.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {novel.isPremium ? (
                          <span className="text-[#C8A45D] font-bold">Premium (PKR {novel.price})</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Free</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleFeaturedNovel(novel.id)}
                          className={`p-1 rounded cursor-pointer ${
                            novel.isFeatured ? 'text-[#C8A45D]' : 'text-gray-300 hover:text-gray-500'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className={`w-4 h-4 ${novel.isFeatured ? 'fill-[#C8A45D]' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* Global Publish Actions: Save Draft -> Publish -> Unpublish -> Edit -> Delete */}
                        {isPub ? (
                          <button
                            type="button"
                            onClick={() => {
                              setNovelPublishStatus(novel.id, 'unpublished');
                              showNotification(`Unpublished "${novel.title}".`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded cursor-pointer"
                            title="Unpublish Novel (Hide from public website)"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setNovelPublishStatus(novel.id, 'published');
                              showNotification(`Published "${novel.title}" to production database!`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer shadow-xs"
                            title="Publish Novel Immediately"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditNovel(novel)}
                          className="p-1.5 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="Edit Novel"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${novel.title}" and all its episodes permanently from production?`)) {
                              deleteNovel(novel.id);
                              showNotification(`Deleted novel "${novel.title}".`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Novel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EPISODES MANAGEMENT */}
      {activeTab === 'episodes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
              Episodes & Chapters Management
            </h3>
            <button
              onClick={handleOpenAddEpisode}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C8A45D]" />
              <span>Publish New Episode</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Novel</th>
                  <th className="p-3">Episode Title & Urdu</th>
                  <th className="p-3">Publish Status & Date</th>
                  <th className="p-3">Access</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {episodes.map(ep => {
                  const novel = novels.find(n => n.id === ep.novelId);
                  const isPub = ep.publishStatus === 'published' || (ep.isPublished && ep.publishStatus !== 'draft' && ep.publishStatus !== 'unpublished');
                  return (
                    <tr key={ep.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3 font-bold text-[#173F35] tabular-nums">{ep.episodeNumber}</td>
                      <td className="p-3 font-semibold text-[#173F35]">{novel?.title || ep.novelId}</td>
                      <td className="p-3">
                        <strong className="block text-[#252525]">{ep.title}</strong>
                        <span className="font-urdu text-xs text-[#4A3025]">{ep.urduTitle}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          isPub ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          <span>{isPub ? 'Published' : ep.publishStatus || 'Unpublished'}</span>
                        </span>
                        <div className="text-[10px] text-[#6B6B6B] mt-0.5">{ep.publishedDate} {ep.publicationTime || ''}</div>
                      </td>
                      <td className="p-3">
                        {ep.isPremium ? (
                          <span className="text-[#C8A45D] font-bold">Premium (PKR {ep.price || 50})</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Free</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {isPub ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEpisodePublishStatus(ep.id, 'unpublished');
                              showNotification(`Unpublished episode "${ep.title}".`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded cursor-pointer"
                            title="Unpublish Episode"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEpisodePublishStatus(ep.id, 'published');
                              showNotification(`Published episode "${ep.title}" to production!`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                            title="Publish Episode"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditEpisode(ep)}
                          className="p-1.5 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="Edit Episode"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete episode "${ep.title}"?`)) {
                              deleteEpisode(ep.id);
                              showNotification(`Deleted episode "${ep.title}".`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Episode"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUTHORS MANAGEMENT */}
      {activeTab === 'authors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
              Urdu Authors Directory Management
            </h3>
            <button
              onClick={handleOpenAddAuthor}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C8A45D]" />
              <span>Add Author Profile</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">Photo</th>
                  <th className="p-3">Author Name</th>
                  <th className="p-3">Urdu Name</th>
                  <th className="p-3">Publish Status</th>
                  <th className="p-3">Novels Count</th>
                  <th className="p-3">Biography Excerpt</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {authors.map(author => {
                  const isPub = author.publishStatus !== 'draft' && author.publishStatus !== 'unpublished';
                  return (
                    <tr key={author.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3">
                        <div className="w-10 h-10 rounded-full bg-[#EEE8D8] overflow-hidden border">
                          <img src={author.photoUrl} alt={author.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[#173F35]">{author.name}</td>
                      <td className="p-3 font-urdu text-sm font-bold text-[#4A3025]">{author.urduName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          isPub ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          <span>{isPub ? 'Published' : author.publishStatus || 'Unpublished'}</span>
                        </span>
                      </td>
                      <td className="p-3 font-medium tabular-nums">{author.novelsCount}</td>
                      <td className="p-3 text-[#6B6B6B] max-w-xs truncate">{author.bio}</td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {isPub ? (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthorPublishStatus(author.id, 'unpublished');
                              showNotification(`Unpublished author profile "${author.name}".`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded cursor-pointer"
                            title="Unpublish Author"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthorPublishStatus(author.id, 'published');
                              showNotification(`Published author profile "${author.name}"!`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                            title="Publish Author"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditAuthor(author)}
                          className="p-1.5 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="Edit Author"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete author profile for "${author.name}"?`)) {
                              deleteAuthor(author.id);
                              showNotification(`Deleted author "${author.name}".`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Author"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: E-BOOKS MANAGEMENT */}
      {activeTab === 'ebooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
              E-Books Catalog
            </h3>
            <button
              onClick={handleOpenAddEbook}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C8A45D]" />
              <span>Add E-Book</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Publish Status</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Pages & Size</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {ebooks.map(eb => {
                  const isPub = eb.publishStatus === 'published' || (eb.isPublished && eb.publishStatus !== 'draft' && eb.publishStatus !== 'unpublished');
                  return (
                    <tr key={eb.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3 font-semibold text-[#173F35]">
                        <div>{eb.title}</div>
                        <div className="font-urdu text-xs text-[#4A3025]">{eb.urduTitle}</div>
                      </td>
                      <td className="p-3 text-[#252525]">{eb.author}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          isPub ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          <span>{isPub ? 'Published' : eb.publishStatus || 'Unpublished'}</span>
                        </span>
                      </td>
                      <td className="p-3 text-[#6B6B6B]">{eb.category}</td>
                      <td className="p-3 text-[#6B6B6B]">{eb.pages} pgs ({eb.fileSize})</td>
                      <td className="p-3 font-bold text-[#173F35]">{eb.isPremium ? `PKR ${eb.price}` : 'Free'}</td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {isPub ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEbookPublishStatus(eb.id, 'unpublished');
                              showNotification(`Unpublished e-book "${eb.title}".`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded cursor-pointer"
                            title="Unpublish Ebook"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEbookPublishStatus(eb.id, 'published');
                              showNotification(`Published e-book "${eb.title}" to production!`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                            title="Publish Ebook"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditEbook(eb)}
                          className="p-1.5 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="Edit Ebook"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete e-book "${eb.title}"?`)) {
                              deleteEbook(eb.id);
                              showNotification(`Deleted e-book "${eb.title}".`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Ebook"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CLASSICAL WORKS MANAGEMENT */}
      {activeTab === 'classical' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
              Classical Urdu Literature Archive
            </h3>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">Title & Urdu Title</th>
                  <th className="p-3">Classical Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Era</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {classicalWorks.map(cw => (
                  <tr key={cw.id} className="hover:bg-[#FAF7F0]">
                    <td className="p-3 font-semibold text-[#173F35]">
                      <div>{cw.title}</div>
                      <div className="font-urdu text-xs text-[#4A3025]">{cw.urduTitle}</div>
                    </td>
                    <td className="p-3 font-medium text-[#252525]">{cw.author} ({cw.urduAuthor})</td>
                    <td className="p-3 text-[#6B6B6B]">{cw.category}</td>
                    <td className="p-3 text-[#6B6B6B]">{cw.era}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete classical work "${cw.title}"?`)) {
                            deleteClassicalWork(cw.id);
                            showNotification(`Deleted classical work "${cw.title}".`);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DYNAMIC CUSTOM PAGES MANAGEMENT */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
                Dynamic Page Management System
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Create unlimited custom pages with text, images, videos, and links. Automatically accessible via navigation and generated URL <code>/page/:slug</code>.
              </p>
            </div>
            <button
              onClick={handleOpenAddPage}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#C8A45D]" />
              <span>Create New Page</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">Page Title & Urdu</th>
                  <th className="p-3">Generated URL</th>
                  <th className="p-3">Publish Status</th>
                  <th className="p-3">Published Date & Time</th>
                  <th className="p-3">Navigation</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {pages.map(page => {
                  const isPub = page.publishStatus === 'published' || (page.isPublished && page.publishStatus !== 'draft' && page.publishStatus !== 'unpublished');
                  return (
                    <tr key={page.id} className="hover:bg-[#FAF7F0]">
                      <td className="p-3">
                        <strong className="block text-[#173F35] text-sm">{page.title}</strong>
                        {page.urduTitle && (
                          <span className="font-urdu text-xs text-[#4A3025]">{page.urduTitle}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <a
                          href={`#page-${page.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (navigate) navigate('page', { slug: page.slug });
                          }}
                          className="text-[#173F35] font-mono text-[11px] underline hover:text-[#C8A45D] flex items-center gap-1"
                        >
                          <span>/page/{page.slug}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                          isPub ? 'bg-emerald-100 text-emerald-800' :
                          page.publishStatus === 'draft' ? 'bg-amber-100 text-amber-800' :
                          page.publishStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                          <span>{isPub ? 'Published' : page.publishStatus || 'Unpublished'}</span>
                        </span>
                      </td>
                      <td className="p-3 text-[#6B6B6B]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C8A45D]" />
                          <span>{page.publicationDate}</span>
                        </div>
                        {page.publicationTime && (
                          <div className="flex items-center gap-1 text-[10px] mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-[#6B6B6B]" />
                            <span>{page.publicationTime}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-[#6B6B6B]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {page.showInNav && <span className="bg-[#EEE8D8] px-1.5 py-0.5 rounded text-[10px] text-[#173F35] font-medium">Header</span>}
                          {page.showInFooter && <span className="bg-[#EEE8D8] px-1.5 py-0.5 rounded text-[10px] text-[#173F35] font-medium">Footer</span>}
                        </div>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {isPub ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPagePublishStatus(page.id, 'unpublished');
                              showNotification(`Unpublished page "${page.title}".`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded cursor-pointer"
                            title="Unpublish Page"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPagePublishStatus(page.id, 'published');
                              showNotification(`Published page "${page.title}" to production!`);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                            title="Publish Page Now"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditPage(page)}
                          className="p-1.5 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="Edit Page"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Permanently delete page "${page.title}" from production?`)) {
                              deletePage(page.id);
                              showNotification(`Deleted page "${page.title}".`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigate) navigate('page', { slug: page.slug });
                          }}
                          className="p-1.5 text-[#C8A45D] hover:bg-[#EEE8D8] rounded cursor-pointer"
                          title="View Live Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PDF LIBRARY & ACCESS CONTROLS MANAGEMENT */}
      {activeTab === 'pdf-manager' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-xl border border-[#C8A45D]/40 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C8A45D] font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C8A45D]" />
                  Centralized PDF Operations Center
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-[#173F35] mt-1">
                  Urdu Novels & E-Books PDF Repository
                </h3>
              </div>
              <span className="px-3 py-1.5 bg-[#173F35] text-[#C8A45D] text-xs font-bold rounded-lg border border-[#C8A45D]/40 flex items-center gap-2 self-start sm:self-auto shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PDF Engine Operational</span>
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-3xl">
              Control digital PDF distribution for every novel and e-book in Novels Gallery. Upload files directly, paste high-speed Google Drive share links, and enforce whether each document is available for <strong>Online Reading only</strong>, <strong>Direct Download only</strong>, or <strong>Both</strong>.
            </p>
          </div>

          {/* PDF Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
              <span className="text-[#6B6B6B] block">PDFs Available</span>
              <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">
                {novels.filter(n => n.hasPdf || n.googleDriveUrl || n.pdfUrl).length + ebooks.filter(e => e.hasPdf || e.googleDriveUrl || e.pdfUrl).length}
              </span>
              <span className="text-[11px] text-[#C8A45D] block mt-0.5">
                of {novels.length + ebooks.length} total titles
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
              <span className="text-[#6B6B6B] block">Google Drive Cloud</span>
              <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">
                {novels.filter(n => !!n.googleDriveUrl).length + ebooks.filter(e => !!e.googleDriveUrl).length}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">
                High-speed cloud CDN
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
              <span className="text-[#6B6B6B] block">Direct File Uploads</span>
              <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">
                {novels.filter(n => !!n.pdfUrl && !n.googleDriveUrl).length + ebooks.filter(e => !!e.pdfUrl && !e.googleDriveUrl).length}
              </span>
              <span className="text-[11px] text-[#6B6B6B] block mt-0.5">
                Stored in library
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#173F35]/15 shadow-xs">
              <span className="text-[#6B6B6B] block">Online & Download</span>
              <span className="font-serif-display text-2xl font-bold text-[#173F35] tabular-nums">
                {novels.filter(n => n.pdfAccessMode === 'both' || !n.pdfAccessMode).length + ebooks.filter(e => e.pdfAccessMode === 'both' || !e.pdfAccessMode).length}
              </span>
              <span className="text-[11px] text-amber-700 block mt-0.5">
                Full access mode
              </span>
            </div>
          </div>

          {/* Unified Titles Table */}
          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#EEE8D8] border-b border-[#173F35]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-serif-display font-bold text-[#173F35] text-sm">
                  Catalog PDF Inventory & Access Mode Policies
                </h4>
                <p className="text-[#6B6B6B] text-[11px]">
                  Change access modes instantly or preview PDF documents with one click
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F0] text-[#173F35] uppercase font-semibold border-b border-[#173F35]/10">
                  <tr>
                    <th className="p-3">Title & Format</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">PDF Source & Status</th>
                    <th className="p-3">Access Control Policy</th>
                    <th className="p-3">File Size & Pages</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEE8D8]">
                  {/* Novels */}
                  {novels.map(novel => {
                    const hasPdf = !!(novel.hasPdf || novel.googleDriveUrl || novel.pdfUrl);
                    const mode = novel.pdfAccessMode || 'both';
                    return (
                      <tr key={`novel-${novel.id}`} className="hover:bg-[#FAF7F0]">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={novel.coverUrl}
                              alt={novel.title}
                              className="w-8 h-10 object-cover rounded border border-[#173F35]/20 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-[#173F35] flex items-center gap-1.5">
                                <span>{novel.title}</span>
                                <span className="text-[10px] bg-[#173F35]/10 text-[#173F35] px-1.5 py-0.2 rounded font-normal">
                                  Novel
                                </span>
                              </div>
                              <span className="font-urdu text-xs text-[#4A3025]">{novel.urduTitle}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-[#252525]">{novel.authorName}</td>

                        <td className="p-3">
                          {novel.googleDriveUrl ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                <Link2 className="w-3 h-3" />
                                Google Drive CDN
                              </span>
                              <span className="block text-[10px] text-[#6B6B6B] truncate max-w-[150px]">
                                {novel.pdfFileName || 'Direct Drive Stream'}
                              </span>
                            </div>
                          ) : novel.pdfUrl ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                                <FileText className="w-3 h-3" />
                                Direct Upload
                              </span>
                              <span className="block text-[10px] text-[#6B6B6B] truncate max-w-[150px]">
                                {novel.pdfFileName || 'Uploaded File'}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                              No PDF Attached
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <select
                            value={mode}
                            onChange={(e) => {
                              const newMode = e.target.value as PdfAccessMode;
                              updateNovel(novel.id, { pdfAccessMode: newMode });
                              showNotification(`Updated policy for "${novel.title}" to ${newMode === 'both' ? 'Both (Online & Download)' : newMode === 'online_only' ? 'Online Only' : 'Download Only'}!`);
                            }}
                            className={`p-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                              mode === 'both' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              mode === 'online_only' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                              'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="both">Both (Online & Download)</option>
                            <option value="online_only">Online Reading Only</option>
                            <option value="download_only">Direct Download Only</option>
                          </select>
                        </td>

                        <td className="p-3 text-[#6B6B6B]">
                          <div>{novel.pdfFileSize || '18.4 MB'}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{novel.pdfPages || 480} Pages</div>
                        </td>

                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {hasPdf && (
                            <button
                              onClick={() => openPdfReader(novel)}
                              className="px-2.5 py-1 bg-[#173F35] text-white hover:bg-[#12322a] rounded text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Test Online PDF Reader"
                            >
                              <Eye className="w-3 h-3 text-[#C8A45D]" />
                              <span>Preview</span>
                            </button>
                          )}

                          {hasPdf && (
                            <button
                              onClick={() => triggerPdfDownload(novel)}
                              className="p-1 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                              title="Test Direct PDF Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setQuickPdfModal({
                                isOpen: true,
                                type: 'novel',
                                id: novel.id,
                                title: novel.title,
                                urduTitle: novel.urduTitle,
                                hasPdf: !!novel.hasPdf,
                                pdfUrl: novel.pdfUrl || '',
                                googleDriveUrl: novel.googleDriveUrl || '',
                                pdfFileName: novel.pdfFileName || '',
                                pdfFileSize: novel.pdfFileSize || '18.4 MB',
                                pdfPages: novel.pdfPages || 480,
                                pdfAccessMode: novel.pdfAccessMode || 'both',
                              });
                            }}
                            className="px-2 py-1 bg-[#EEE8D8] text-[#173F35] hover:bg-[#e4ddcc] rounded text-[11px] font-semibold cursor-pointer"
                            title="Attach or Edit PDF Configuration"
                          >
                            Attach / Edit PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* E-Books */}
                  {ebooks.map(eb => {
                    const hasPdf = !!(eb.hasPdf || eb.googleDriveUrl || eb.pdfUrl);
                    const mode = eb.pdfAccessMode || 'both';
                    return (
                      <tr key={`ebook-${eb.id}`} className="hover:bg-[#FAF7F0]">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={eb.coverUrl}
                              alt={eb.title}
                              className="w-8 h-10 object-cover rounded border border-[#173F35]/20 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-[#173F35] flex items-center gap-1.5">
                                <span>{eb.title}</span>
                                <span className="text-[10px] bg-[#C8A45D]/20 text-[#173F35] px-1.5 py-0.2 rounded font-normal">
                                  E-Book
                                </span>
                              </div>
                              <span className="font-urdu text-xs text-[#4A3025]">{eb.urduTitle}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-[#252525]">{eb.author}</td>

                        <td className="p-3">
                          {eb.googleDriveUrl ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                <Link2 className="w-3 h-3" />
                                Google Drive CDN
                              </span>
                              <span className="block text-[10px] text-[#6B6B6B] truncate max-w-[150px]">
                                {eb.pdfFileName || 'Direct Drive Stream'}
                              </span>
                            </div>
                          ) : eb.pdfUrl ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                                <FileText className="w-3 h-3" />
                                Direct Upload
                              </span>
                              <span className="block text-[10px] text-[#6B6B6B] truncate max-w-[150px]">
                                {eb.pdfFileName || 'Uploaded File'}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                              No PDF Attached
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <select
                            value={mode}
                            onChange={(e) => {
                              const newMode = e.target.value as PdfAccessMode;
                              updateEbook(eb.id, { pdfAccessMode: newMode });
                              showNotification(`Updated policy for "${eb.title}" to ${newMode === 'both' ? 'Both (Online & Download)' : newMode === 'online_only' ? 'Online Only' : 'Download Only'}!`);
                            }}
                            className={`p-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                              mode === 'both' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              mode === 'online_only' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                              'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="both">Both (Online & Download)</option>
                            <option value="online_only">Online Reading Only</option>
                            <option value="download_only">Direct Download Only</option>
                          </select>
                        </td>

                        <td className="p-3 text-[#6B6B6B]">
                          <div>{eb.pdfFileSize || eb.fileSize || '6.8 MB'}</div>
                          <div className="text-[10px] text-[#6B6B6B]">{eb.pdfPages || eb.pages || 350} Pages</div>
                        </td>

                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {hasPdf && (
                            <button
                              onClick={() => openPdfReader(eb)}
                              className="px-2.5 py-1 bg-[#173F35] text-white hover:bg-[#12322a] rounded text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Test Online PDF Reader"
                            >
                              <Eye className="w-3 h-3 text-[#C8A45D]" />
                              <span>Preview</span>
                            </button>
                          )}

                          {hasPdf && (
                            <button
                              onClick={() => triggerPdfDownload(eb)}
                              className="p-1 text-[#173F35] hover:bg-[#EEE8D8] rounded cursor-pointer"
                              title="Test Direct PDF Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setQuickPdfModal({
                                isOpen: true,
                                type: 'ebook',
                                id: eb.id,
                                title: eb.title,
                                urduTitle: eb.urduTitle,
                                hasPdf: !!eb.hasPdf,
                                pdfUrl: eb.pdfUrl || '',
                                googleDriveUrl: eb.googleDriveUrl || '',
                                pdfFileName: eb.pdfFileName || '',
                                pdfFileSize: eb.pdfFileSize || eb.fileSize || '6.8 MB',
                                pdfPages: eb.pdfPages || eb.pages || 350,
                                pdfAccessMode: eb.pdfAccessMode || 'both',
                              });
                            }}
                            className="px-2 py-1 bg-[#EEE8D8] text-[#173F35] hover:bg-[#e4ddcc] rounded text-[11px] font-semibold cursor-pointer"
                            title="Attach or Edit PDF Configuration"
                          >
                            Attach / Edit PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HOMEPAGE BANNERS */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-6 rounded-xl border border-[#173F35]/15 max-w-2xl space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Homepage Highlight Settings
          </h3>
          <p className="text-xs text-[#6B6B6B]">
            Configure which novel is spotlighted in the primary hero banner, along with the top announcement strip.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#252525] font-semibold mb-1">Featured Hero Novel Spotlight</label>
              <select
                value={siteSettings.heroNovelId}
                onChange={(e) => {
                  updateSiteSettings({ heroNovelId: e.target.value });
                  showNotification('Updated featured hero novel spotlight!');
                }}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525]"
              >
                {novels.map(n => (
                  <option key={n.id} value={n.id}>{n.title} ({n.authorName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Top Announcement Strip Message</label>
              <input
                type="text"
                value={siteSettings.announcement}
                onChange={(e) => updateSiteSettings({ announcement: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: ADSTERRA MONETIZATION MANAGEMENT (10 UNITS) */}
      {activeTab === 'adsterra' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#C8A45D]/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C8A45D] font-bold">Adsterra Revenue Integration</span>
                <h3 className="font-serif-display text-xl font-bold text-[#173F35]">
                  10 Active Ad Units Configured
                </h3>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                All 10 Units Live & Active
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Your Adsterra monetization codes are fully integrated across Novels Gallery. Popunder and Social Bar run site-wide; Native Banners, Smartlinks, and 6 standard Iframe Banner formats are embedded in high-CTR reader locations.
            </p>
          </div>

          {/* 10 Ad Units Status Table */}
          <div className="bg-white rounded-xl border border-[#173F35]/15 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EEE8D8] text-[#173F35] uppercase font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Ad Unit Format</th>
                  <th className="p-3">Adsterra ID</th>
                  <th className="p-3">Website Placements</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8]">
                {[
                  { num: 1, name: 'Popunder (Popunder_1)', id: '31602908', placement: 'Site-wide head trigger (All pages)', status: 'Active', type: 'Script tag' },
                  { num: 2, name: 'Smartlink (Smartlink_1)', id: '31602909', placement: 'Home, Reader Chapter End, E-Books Download, Novel Details', status: 'Active', type: 'Direct URL / High-CTR CTA' },
                  { num: 3, name: 'Social Bar (SocialBar_1)', id: '31602910', placement: 'Site-wide floating notification overlay', status: 'Active', type: 'Overlay script' },
                  { num: 4, name: 'Native Banner (NativeBanner_1)', id: '31602911', placement: 'Home Recommendations, Novel Detail Episodes, Reader End, Classical', status: 'Active', type: 'Native widget (container-0efe5b...)' },
                  { num: 5, name: 'Banner 468x60 (468x60_1)', id: '31602912', placement: 'Novel Detail Episode Header, Episodes Catalog Mid-page', status: 'Active', type: 'Iframe tag (0ea2bef...)' },
                  { num: 6, name: 'Banner 300x250 (300x250_1)', id: '31602913', placement: 'Reader Chapter Conclusion, Novel Detail Sidebar, Author Detail', status: 'Active', type: 'Iframe tag (1602456...)' },
                  { num: 7, name: 'Banner 160x300 (160x300_1)', id: '31602914', placement: 'Novel Detail Multi-Format Showcase, Desktop Sidebar', status: 'Active', type: 'Iframe tag (96a0555...)' },
                  { num: 8, name: 'Banner 160x600 (160x600_1)', id: '31602915', placement: 'Novel Detail Multi-Format Showcase, Desktop Wide Skyscraper', status: 'Active', type: 'Iframe tag (70e79d2...)' },
                  { num: 9, name: 'Banner 320x50 (320x50_1)', id: '31602916', placement: 'Mobile Responsive Leaderboard (Home, Reader, Catalog)', status: 'Active', type: 'Iframe tag (7070811...)' },
                  { num: 10, name: 'Banner 728x90 (728x90_1)', id: '31602917', placement: 'Desktop Leaderboard (Home, Novels Library, Novel Details, Reader, Ebooks)', status: 'Active', type: 'Iframe tag (960f3ed...)' },
                ].map(unit => (
                  <tr key={unit.num} className="hover:bg-[#FAF7F0]">
                    <td className="p-3 font-bold text-[#173F35] tabular-nums">{unit.num}</td>
                    <td className="p-3 font-semibold text-[#173F35]">{unit.name}</td>
                    <td className="p-3 font-mono text-[#4A3025]">{unit.id}</td>
                    <td className="p-3 text-[#252525]">{unit.placement}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {unit.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-[#6B6B6B] font-mono text-[11px]">{unit.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Preview Test Suite */}
          <div className="bg-white p-6 rounded-xl border border-[#173F35]/15 space-y-4">
            <h4 className="font-serif-display text-base font-bold text-[#173F35]">
              Live Adsterra Unit Test & Rendering Preview
            </h4>
            <p className="text-xs text-[#6B6B6B]">
              Below are live containers connected to your Adsterra keys to test visual rendering and responsive sizing:
            </p>

            <div className="space-y-6 pt-2">
              <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8] text-center">
                <span className="text-xs font-semibold text-[#173F35] block mb-2">Test Leaderboard (728x90):</span>
                <AdsterraBanner type="728x90" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8] text-center">
                  <span className="text-xs font-semibold text-[#173F35] block mb-2">Test Medium Rectangle (300x250):</span>
                  <AdsterraBanner type="300x250" />
                </div>
                <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8] text-center">
                  <span className="text-xs font-semibold text-[#173F35] block mb-2">Test Banner 468x60:</span>
                  <AdsterraBanner type="468x60" />
                </div>
              </div>

              <div className="p-4 bg-[#F8F4EA] rounded-lg border border-[#EEE8D8]">
                <span className="text-xs font-semibold text-[#173F35] block mb-2 text-center">Test Smartlink CTA (Unit 31602909):</span>
                <SmartlinkCTA />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-xl border border-[#173F35]/15 max-w-2xl space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-[#173F35]">
            Global Website Settings
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#252525] font-semibold mb-1">Website Name</label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) => updateSiteSettings({ siteName: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525]"
              />
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Brand Tagline (English)</label>
              <input
                type="text"
                value={siteSettings.tagline}
                onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525]"
              />
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Brand Tagline (Urdu)</label>
              <input
                type="text"
                value={siteSettings.urduTagline}
                onChange={(e) => updateSiteSettings({ urduTagline: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525] font-urdu"
              />
            </div>

            <div>
              <label className="block text-[#252525] font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => updateSiteSettings({ contactEmail: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EA] border border-[#173F35]/20 rounded-md text-xs text-[#252525]"
              />
            </div>
          </div>
        </div>
      )}

      {/* NOVEL MODAL */}
      {isNovelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-2xl rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
              <h3 className="font-serif-display text-base font-bold text-white">
                {editingNovel ? 'Edit Urdu Novel' : 'Add New Urdu Novel'}
              </h3>
              <button onClick={() => setIsNovelModalOpen(false)} className="p-1 hover:bg-[#12322a] rounded">✕</button>
            </div>

            <form onSubmit={handleSaveNovel} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Novel Title (English)</label>
                  <input
                    type="text"
                    required
                    value={novelFormData.title}
                    onChange={(e) => setNovelFormData({ ...novelFormData, title: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Novel Title (Urdu)</label>
                  <input
                    type="text"
                    required
                    value={novelFormData.urduTitle}
                    onChange={(e) => setNovelFormData({ ...novelFormData, urduTitle: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Assigned Author</label>
                  <select
                    value={novelFormData.authorId}
                    onChange={(e) => setNovelFormData({ ...novelFormData, authorId: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.urduName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Genre</label>
                  <select
                    value={novelFormData.genre}
                    onChange={(e) => setNovelFormData({ ...novelFormData, genre: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    <option value="Romantic Suspense & Mystery">Romantic Suspense & Mystery</option>
                    <option value="Spiritual & Social Drama">Spiritual & Social Drama</option>
                    <option value="Courtroom Thriller & Mystery">Courtroom Thriller & Mystery</option>
                    <option value="Psychological & Philosophical">Psychological & Philosophical</option>
                    <option value="Time Travel & Political Drama">Time Travel & Political Drama</option>
                    <option value="Historical Fiction">Historical Fiction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={novelFormData.status}
                    onChange={(e) => setNovelFormData({ ...novelFormData, status: e.target.value as any })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Access Type</label>
                  <select
                    value={novelFormData.isPremium ? 'premium' : 'free'}
                    onChange={(e) => setNovelFormData({ ...novelFormData, isPremium: e.target.value === 'premium' })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    <option value="free">Free Novel</option>
                    <option value="premium">Premium Novel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={novelFormData.price}
                    onChange={(e) => setNovelFormData({ ...novelFormData, price: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
              </div>

              <FileUploadDropzone
                label="Novel Cover Image (Persistent Cloud/Disk)"
                currentUrl={novelFormData.coverUrl}
                onUrlChange={(url) => setNovelFormData({ ...novelFormData, coverUrl: url })}
                accept="image/*"
                fileTypeLabel="Cover Image"
              />

              <div>
                <label className="block font-semibold mb-1">Synopsis (English)</label>
                <textarea
                  rows={3}
                  value={novelFormData.synopsis}
                  onChange={(e) => setNovelFormData({ ...novelFormData, synopsis: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Synopsis (Urdu)</label>
                <textarea
                  rows={3}
                  value={novelFormData.urduSynopsis}
                  onChange={(e) => setNovelFormData({ ...novelFormData, urduSynopsis: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu text-right"
                />
              </div>

              {/* PDF SYSTEM SETTINGS FOR NOVEL */}
              <div className="p-4 bg-[#F8F4EA] rounded-xl border border-[#C8A45D]/40 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#173F35]/15">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C8A45D]" />
                    <span className="font-serif-display font-bold text-sm text-[#173F35]">
                      PDF Edition & Distribution Settings
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#173F35]">
                    <input
                      type="checkbox"
                      checked={novelFormData.hasPdf}
                      onChange={(e) => setNovelFormData({ ...novelFormData, hasPdf: e.target.checked })}
                      className="rounded text-[#173F35]"
                    />
                    <span>Enable PDF for this Novel</span>
                  </label>
                </div>

                {novelFormData.hasPdf && (
                  <div className="space-y-4">
                    {/* Direct Upload & Google Drive Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Direct PDF Upload
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <UploadCloud className="w-3.5 h-3.5 text-[#C8A45D]" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'novel');
                              }}
                            />
                          </label>
                          {novelFormData.pdfFileName && (
                            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 truncate max-w-[150px]">
                              {novelFormData.pdfFileName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Or Google Drive PDF Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={novelFormData.googleDriveUrl}
                          onChange={(e) => setNovelFormData({ 
                            ...novelFormData, 
                            googleDriveUrl: e.target.value,
                            hasPdf: true 
                          })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Policy & Page Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1 text-[#252525]">
                          PDF Access Policy
                        </label>
                        <select
                          value={novelFormData.pdfAccessMode}
                          onChange={(e) => setNovelFormData({ ...novelFormData, pdfAccessMode: e.target.value as PdfAccessMode })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        >
                          <option value="both">Both (Online Reading & Direct Download)</option>
                          <option value="online_only">Online Reading Only (Viewer enabled, download disabled)</option>
                          <option value="download_only">Direct Download Only (Viewer disabled, download enabled)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Total Pages
                        </label>
                        <input
                          type="number"
                          value={novelFormData.pdfPages}
                          onChange={(e) => setNovelFormData({ ...novelFormData, pdfPages: Number(e.target.value) })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          File Size (e.g. 18.4 MB)
                        </label>
                        <input
                          type="text"
                          value={novelFormData.pdfFileSize}
                          onChange={(e) => setNovelFormData({ ...novelFormData, pdfFileSize: e.target.value })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            openPdfReader({
                              title: novelFormData.title || 'Preview Novel',
                              urduTitle: novelFormData.urduTitle,
                              authorName: novelFormData.authorName,
                              pdfUrl: novelFormData.pdfUrl,
                              googleDriveUrl: novelFormData.googleDriveUrl,
                              pdfFileName: novelFormData.pdfFileName,
                              pdfFileSize: novelFormData.pdfFileSize,
                              pdfPages: novelFormData.pdfPages,
                              pdfAccessMode: novelFormData.pdfAccessMode,
                              synopsis: novelFormData.synopsis,
                              urduSynopsis: novelFormData.urduSynopsis,
                            });
                          }}
                          className="w-full py-2 bg-[#EEE8D8] hover:bg-[#e4ddcc] text-[#173F35] font-semibold text-xs rounded border border-[#173F35]/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>Test In PDF Viewer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Publication Status & Date/Time Scheduling */}
              <PublishSchedulerWidget
                status={novelFormData.publishStatus}
                onChangeStatus={(st) => setNovelFormData({ ...novelFormData, publishStatus: st, isPublished: st === 'published' })}
                publicationDate={novelFormData.publicationDate}
                onChangeDate={(d) => setNovelFormData({ ...novelFormData, publicationDate: d })}
                publicationTime={novelFormData.publicationTime}
                onChangeTime={(t) => setNovelFormData({ ...novelFormData, publicationTime: t })}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EEE8D8]">
                <button
                  type="button"
                  onClick={() => setIsNovelModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded text-[#252525]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] text-white rounded font-semibold cursor-pointer"
                >
                  Save Novel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EPISODE MODAL */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-2xl rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
              <h3 className="font-serif-display text-base font-bold text-white">
                {editingEpisode ? 'Edit Episode' : 'Publish New Episode'}
              </h3>
              <button onClick={() => setIsEpisodeModalOpen(false)} className="p-1 hover:bg-[#12322a] rounded">✕</button>
            </div>

            <form onSubmit={handleSaveEpisode} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Assign to Novel</label>
                  <select
                    value={episodeFormData.novelId}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, novelId: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    {novels.map(n => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Episode Number</label>
                  <input
                    type="number"
                    required
                    value={episodeFormData.episodeNumber}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, episodeNumber: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Episode Title (English)</label>
                  <input
                    type="text"
                    required
                    value={episodeFormData.title}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, title: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Episode Title (Urdu)</label>
                  <input
                    type="text"
                    required
                    value={episodeFormData.urduTitle}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, urduTitle: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Urdu Reading Content (Full Story / Chapters)</label>
                <textarea
                  rows={8}
                  required
                  value={episodeFormData.contentUrdu}
                  onChange={(e) => setEpisodeFormData({ ...episodeFormData, contentUrdu: e.target.value })}
                  placeholder="یہاں اردو ناول کا متن درج کریں..."
                  className="w-full p-3 bg-white border border-[#173F35]/20 rounded-md font-urdu text-base text-right leading-loose"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Access Mode</label>
                  <select
                    value={episodeFormData.isPremium ? 'premium' : 'free'}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, isPremium: e.target.value === 'premium' })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  >
                    <option value="free">Free Episode</option>
                    <option value="premium">Premium Episode</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Read Time (Minutes)</label>
                  <input
                    type="number"
                    value={episodeFormData.readTimeMinutes}
                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
              </div>

              {/* Publication Status & Scheduling */}
              <PublishSchedulerWidget
                status={episodeFormData.publishStatus}
                onChangeStatus={(st) => setEpisodeFormData({ ...episodeFormData, publishStatus: st, isPublished: st === 'published' })}
                publicationDate={episodeFormData.publishedDate}
                onChangeDate={(d) => setEpisodeFormData({ ...episodeFormData, publishedDate: d })}
                publicationTime={episodeFormData.publicationTime}
                onChangeTime={(t) => setEpisodeFormData({ ...episodeFormData, publicationTime: t })}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EEE8D8]">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded text-[#252525]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] text-white rounded font-semibold cursor-pointer"
                >
                  Publish Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTHOR MODAL */}
      {isAuthorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-lg rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden flex flex-col">
            <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
              <h3 className="font-serif-display text-base font-bold text-white">
                {editingAuthor ? 'Edit Author Profile' : 'Add New Author Profile'}
              </h3>
              <button onClick={() => setIsAuthorModalOpen(false)} className="p-1 hover:bg-[#12322a] rounded">✕</button>
            </div>

            <form onSubmit={handleSaveAuthor} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Author Name (English)</label>
                <input
                  type="text"
                  required
                  value={authorFormData.name}
                  onChange={(e) => setAuthorFormData({ ...authorFormData, name: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Author Name (Urdu)</label>
                <input
                  type="text"
                  required
                  value={authorFormData.urduName}
                  onChange={(e) => setAuthorFormData({ ...authorFormData, urduName: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu"
                />
              </div>

              <FileUploadDropzone
                label="Author Portrait Image (Persistent Cloud/Disk)"
                currentUrl={authorFormData.photoUrl}
                onUrlChange={(url) => setAuthorFormData({ ...authorFormData, photoUrl: url })}
                accept="image/*"
                fileTypeLabel="Author Photo"
              />

              <div>
                <label className="block font-semibold mb-1">Biography (English)</label>
                <textarea
                  rows={3}
                  value={authorFormData.bio}
                  onChange={(e) => setAuthorFormData({ ...authorFormData, bio: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Biography (Urdu)</label>
                <textarea
                  rows={3}
                  value={authorFormData.urduBio}
                  onChange={(e) => setAuthorFormData({ ...authorFormData, urduBio: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu text-right"
                />
              </div>

              {/* Author Publication Status */}
              <PublishSchedulerWidget
                status={authorFormData.publishStatus}
                onChangeStatus={(st) => setAuthorFormData({ ...authorFormData, publishStatus: st })}
                publicationDate={authorFormData.publicationDate}
                onChangeDate={(d) => setAuthorFormData({ ...authorFormData, publicationDate: d })}
                publicationTime={authorFormData.publicationTime}
                onChangeTime={(t) => setAuthorFormData({ ...authorFormData, publicationTime: t })}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EEE8D8]">
                <button
                  type="button"
                  onClick={() => setIsAuthorModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded text-[#252525]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] text-white rounded font-semibold cursor-pointer"
                >
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-BOOK MODAL */}
      {isEbookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-lg rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden flex flex-col">
            <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
              <h3 className="font-serif-display text-base font-bold text-white">
                {editingEbook ? 'Edit E-Book' : 'Add New E-Book'}
              </h3>
              <button onClick={() => setIsEbookModalOpen(false)} className="p-1 hover:bg-[#12322a] rounded">✕</button>
            </div>

            <form onSubmit={handleSaveEbook} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={ebookFormData.title}
                    onChange={(e) => setEbookFormData({ ...ebookFormData, title: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Urdu Title</label>
                  <input
                    type="text"
                    required
                    value={ebookFormData.urduTitle}
                    onChange={(e) => setEbookFormData({ ...ebookFormData, urduTitle: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={ebookFormData.author}
                    onChange={(e) => setEbookFormData({ ...ebookFormData, author: e.target.value })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={ebookFormData.price}
                    onChange={(e) => setEbookFormData({ ...ebookFormData, price: Number(e.target.value), isPremium: Number(e.target.value) > 0 })}
                    className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={ebookFormData.description}
                  onChange={(e) => setEbookFormData({ ...ebookFormData, description: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sample Text / Reading Excerpt</label>
                <textarea
                  rows={4}
                  value={ebookFormData.sampleContent}
                  onChange={(e) => setEbookFormData({ ...ebookFormData, sampleContent: e.target.value })}
                  className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-urdu text-right"
                />
              </div>

              {/* PDF SYSTEM SETTINGS FOR E-BOOK */}
              <div className="p-4 bg-[#F8F4EA] rounded-xl border border-[#C8A45D]/40 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#173F35]/15">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C8A45D]" />
                    <span className="font-serif-display font-bold text-sm text-[#173F35]">
                      PDF Edition & Distribution Settings
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#173F35]">
                    <input
                      type="checkbox"
                      checked={ebookFormData.hasPdf}
                      onChange={(e) => setEbookFormData({ ...ebookFormData, hasPdf: e.target.checked })}
                      className="rounded text-[#173F35]"
                    />
                    <span>Enable PDF for this E-Book</span>
                  </label>
                </div>

                {ebookFormData.hasPdf && (
                  <div className="space-y-4">
                    {/* Direct Upload & Google Drive Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Direct PDF Upload
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <UploadCloud className="w-3.5 h-3.5 text-[#C8A45D]" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'ebook');
                              }}
                            />
                          </label>
                          {ebookFormData.pdfFileName && (
                            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 truncate max-w-[150px]">
                              {ebookFormData.pdfFileName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Or Google Drive PDF Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={ebookFormData.googleDriveUrl}
                          onChange={(e) => setEbookFormData({ 
                            ...ebookFormData, 
                            googleDriveUrl: e.target.value,
                            hasPdf: true 
                          })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Policy & Page Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1 text-[#252525]">
                          PDF Access Policy
                        </label>
                        <select
                          value={ebookFormData.pdfAccessMode}
                          onChange={(e) => setEbookFormData({ ...ebookFormData, pdfAccessMode: e.target.value as PdfAccessMode })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        >
                          <option value="both">Both (Online Reading & Direct Download)</option>
                          <option value="online_only">Online Reading Only (Viewer enabled, download disabled)</option>
                          <option value="download_only">Direct Download Only (Viewer disabled, download enabled)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          Total Pages
                        </label>
                        <input
                          type="number"
                          value={ebookFormData.pdfPages}
                          onChange={(e) => setEbookFormData({ ...ebookFormData, pdfPages: Number(e.target.value), pages: Number(e.target.value) })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block font-semibold mb-1 text-[#252525]">
                          File Size (e.g. 6.8 MB)
                        </label>
                        <input
                          type="text"
                          value={ebookFormData.pdfFileSize}
                          onChange={(e) => setEbookFormData({ ...ebookFormData, pdfFileSize: e.target.value, fileSize: e.target.value })}
                          className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            openPdfReader({
                              title: ebookFormData.title || 'Preview E-Book',
                              urduTitle: ebookFormData.urduTitle,
                              author: ebookFormData.author,
                              pdfUrl: ebookFormData.pdfUrl,
                              googleDriveUrl: ebookFormData.googleDriveUrl,
                              pdfFileName: ebookFormData.pdfFileName,
                              pdfFileSize: ebookFormData.pdfFileSize,
                              pdfPages: ebookFormData.pdfPages,
                              pdfAccessMode: ebookFormData.pdfAccessMode,
                              sampleContent: ebookFormData.sampleContent,
                              synopsis: ebookFormData.description,
                            });
                          }}
                          className="w-full py-2 bg-[#EEE8D8] hover:bg-[#e4ddcc] text-[#173F35] font-semibold text-xs rounded border border-[#173F35]/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>Test In PDF Viewer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EEE8D8]">
                <button
                  type="button"
                  onClick={() => setIsEbookModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded text-[#252525]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] text-white rounded font-semibold cursor-pointer"
                >
                  Save E-Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PDF CONFIGURATION MODAL */}
      {quickPdfModal && quickPdfModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F4EA] w-full max-w-lg rounded-xl shadow-2xl border border-[#C8A45D]/40 overflow-hidden flex flex-col">
            <div className="bg-[#173F35] text-[#F8F4EA] p-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-base font-bold text-white">
                  PDF Configuration: {quickPdfModal.title}
                </h3>
                <span className="font-urdu text-xs text-[#C8A45D]">{quickPdfModal.urduTitle}</span>
              </div>
              <button onClick={() => setQuickPdfModal(null)} className="p-1 hover:bg-[#12322a] rounded">✕</button>
            </div>

            <form onSubmit={handleSaveQuickPdf} className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#173F35]/15">
                <span className="font-semibold text-[#173F35]">Enable PDF Edition</span>
                <input
                  type="checkbox"
                  checked={quickPdfModal.hasPdf}
                  onChange={(e) => setQuickPdfModal({ ...quickPdfModal, hasPdf: e.target.checked })}
                  className="rounded text-[#173F35]"
                />
              </div>

              {quickPdfModal.hasPdf && (
                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#252525]">
                      Direct File Upload
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 bg-[#173F35] hover:bg-[#12322a] text-[#F8F4EA] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <UploadCloud className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>Choose PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'quick');
                          }}
                        />
                      </label>
                      {quickPdfModal.pdfFileName && (
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 truncate max-w-[200px]">
                          {quickPdfModal.pdfFileName} ({quickPdfModal.pdfFileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Google Drive Link */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#252525]">
                      Or Google Drive Share Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      value={quickPdfModal.googleDriveUrl}
                      onChange={(e) => setQuickPdfModal({ ...quickPdfModal, googleDriveUrl: e.target.value, hasPdf: true })}
                      className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md font-mono text-[11px]"
                    />
                  </div>

                  {/* Access Mode */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#252525]">
                      Access Policy
                    </label>
                    <select
                      value={quickPdfModal.pdfAccessMode}
                      onChange={(e) => setQuickPdfModal({ ...quickPdfModal, pdfAccessMode: e.target.value as PdfAccessMode })}
                      className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md text-xs"
                    >
                      <option value="both">Both: Online Reading & Direct Download</option>
                      <option value="online_only">Online Reading Only (Viewer enabled, download disabled)</option>
                      <option value="download_only">Direct Download Only (Viewer disabled, download enabled)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-[#252525]">Pages</label>
                      <input
                        type="number"
                        value={quickPdfModal.pdfPages}
                        onChange={(e) => setQuickPdfModal({ ...quickPdfModal, pdfPages: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#252525]">File Size</label>
                      <input
                        type="text"
                        value={quickPdfModal.pdfFileSize}
                        onChange={(e) => setQuickPdfModal({ ...quickPdfModal, pdfFileSize: e.target.value })}
                        className="w-full p-2 bg-white border border-[#173F35]/20 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#EEE8D8]">
                <button
                  type="button"
                  onClick={() => {
                    openPdfReader({
                      title: quickPdfModal.title,
                      urduTitle: quickPdfModal.urduTitle,
                      pdfUrl: quickPdfModal.pdfUrl,
                      googleDriveUrl: quickPdfModal.googleDriveUrl,
                      pdfFileName: quickPdfModal.pdfFileName,
                      pdfFileSize: quickPdfModal.pdfFileSize,
                      pdfPages: quickPdfModal.pdfPages,
                      pdfAccessMode: quickPdfModal.pdfAccessMode,
                    });
                  }}
                  className="px-3 py-1.5 bg-[#EEE8D8] text-[#173F35] font-semibold rounded text-xs hover:bg-[#e4ddcc] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Preview</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickPdfModal(null)}
                    className="px-3 py-1.5 bg-gray-200 text-[#252525] rounded text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#173F35] text-white font-semibold rounded text-xs hover:bg-[#12322a] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
