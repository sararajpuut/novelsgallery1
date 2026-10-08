export type NovelStatus = 'Completed' | 'Ongoing';
export type PdfAccessMode = 'both' | 'online_only' | 'download_only';
export type PublishStatus = 'draft' | 'published' | 'scheduled' | 'unpublished';

export interface Author {
  id: string;
  name: string;
  urduName: string;
  photoUrl: string;
  bio: string;
  urduBio: string;
  novelsCount: number;
  followersCount: number;
  isFeatured: boolean;
  publishStatus?: PublishStatus;
  publicationDate?: string;
  publicationTime?: string;
  scheduledPublishAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Novel {
  id: string;
  title: string;
  urduTitle: string;
  authorId: string;
  authorName: string;
  genre: string;
  status: NovelStatus;
  isPremium: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  publishStatus?: PublishStatus;
  price: number; // in PKR or USD
  coverUrl: string;
  rating: number;
  totalReviews: number;
  synopsis: string;
  urduSynopsis: string;
  publicationDate: string;
  publicationTime?: string;
  scheduledPublishAt?: string;
  episodesCount: number;
  viewsCount: number;
  likesCount: number;
  tags?: string[];
  // PDF System Properties
  hasPdf?: boolean;
  pdfUrl?: string; // Direct URL or Data URL
  googleDriveUrl?: string; // Google Drive PDF Link
  pdfFileName?: string;
  pdfFileSize?: string;
  pdfPages?: number;
  pdfAccessMode?: PdfAccessMode; // 'both' | 'online_only' | 'download_only'
  createdAt?: string;
  updatedAt?: string;
}

export interface Episode {
  id: string;
  novelId: string;
  episodeNumber: number;
  title: string;
  urduTitle: string;
  contentUrdu: string;
  publishedDate: string;
  publicationTime?: string;
  publishStatus?: PublishStatus;
  scheduledPublishAt?: string;
  isPremium: boolean;
  price?: number;
  readTimeMinutes: number;
  views: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type EbookCategory = 
  | 'Classical Books'
  | 'Urdu Literature'
  | 'Fiction'
  | 'Poetry'
  | 'Short Stories'
  | 'Philosophy';

export interface Ebook {
  id: string;
  title: string;
  urduTitle: string;
  author: string;
  authorId?: string;
  category: EbookCategory;
  price: number;
  isPremium: boolean;
  coverUrl: string;
  pages: number;
  fileSize: string;
  description: string;
  urduDescription?: string;
  isPublished: boolean;
  publishStatus?: PublishStatus;
  publicationDate?: string;
  publicationTime?: string;
  scheduledPublishAt?: string;
  sampleContent: string;
  // PDF System Properties
  hasPdf?: boolean;
  pdfUrl?: string;
  googleDriveUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  pdfPages?: number;
  pdfAccessMode?: PdfAccessMode; // 'both' | 'online_only' | 'download_only'
  createdAt?: string;
  updatedAt?: string;
}

export type ClassicalCategory = 
  | 'Classical Urdu Novels'
  | 'Urdu Poetry'
  | 'Ghazals'
  | 'Afsanay'
  | 'Literary Articles'
  | 'Historical Literature';

export interface ClassicalWork {
  id: string;
  title: string;
  urduTitle: string;
  author: string;
  urduAuthor: string;
  category: ClassicalCategory;
  era: string;
  coverUrl: string;
  description: string;
  contentUrdu: string;
  isPublicDomain: boolean;
  publishStatus?: PublishStatus;
  publicationDate?: string;
  publicationTime?: string;
  scheduledPublishAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomPageLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface CustomPage {
  id: string;
  title: string;
  urduTitle?: string;
  slug: string;
  content: string; // rich text or formatted markdown
  urduContent?: string;
  featuredImage?: string;
  videoUrl?: string; // YouTube / MP4 video link
  links?: CustomPageLink[];
  publishStatus: PublishStatus;
  publicationDate: string;
  publicationTime?: string;
  scheduledPublishAt?: string;
  isPublished: boolean;
  showInNav: boolean;
  showInFooter: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  novels: Novel[];
  episodes: Episode[];
  authors: Author[];
  ebooks: Ebook[];
  classicalWorks: ClassicalWork[];
  pages: CustomPage[];
  siteSettings: SiteSettings;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'reader' | 'admin';
  joinedDate: string;
  avatarUrl?: string;
  walletBalance: number;
}

export interface Bookmark {
  id: string;
  novelId: string;
  episodeId: string;
  paragraphIndex: number;
  timestamp: string;
  note?: string;
}

export interface ReadingProgress {
  novelId: string;
  episodeId: string;
  episodeNumber: number;
  progressPercent: number;
  lastReadAt: string;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  itemType: 'novel' | 'episode' | 'ebook';
  itemId: string;
  itemTitle: string;
  amount: number;
  purchasedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  urduTagline: string;
  heroNovelId: string;
  announcement: string;
  contactEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  whatsappUrl: string;
}
