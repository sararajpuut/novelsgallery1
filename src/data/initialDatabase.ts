import { DatabaseSchema } from '../types';
import { 
  SEED_NOVELS, 
  SEED_EPISODES, 
  SEED_AUTHORS, 
  SEED_EBOOKS, 
  SEED_CLASSICAL, 
  DEFAULT_SITE_SETTINGS 
} from './seedData';
import { SEED_PAGES } from './seedPages';

export function getInitialDatabase(): DatabaseSchema {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    novels: SEED_NOVELS.map(novel => ({
      ...novel,
      publishStatus: novel.publishStatus || 'published',
      isPublished: true,
      publicationDate: novel.publicationDate || '2025-10-08',
      publicationTime: novel.publicationTime || '12:00',
      createdAt: novel.createdAt || '2025-10-08T12:00:00.000Z',
      updatedAt: novel.updatedAt || new Date().toISOString(),
    })),
    episodes: SEED_EPISODES.map(ep => ({
      ...ep,
      publishStatus: ep.publishStatus || 'published',
      isPublished: true,
      publishedDate: ep.publishedDate || '8 Oct 2025',
      publicationTime: ep.publicationTime || '12:00',
      createdAt: ep.createdAt || '2025-10-08T12:00:00.000Z',
      updatedAt: ep.updatedAt || new Date().toISOString(),
    })),
    authors: SEED_AUTHORS.map(author => ({
      ...author,
      publishStatus: author.publishStatus || 'published',
      publicationDate: author.publicationDate || '2025-10-08',
      publicationTime: author.publicationTime || '09:00',
      createdAt: author.createdAt || '2025-10-08T09:00:00.000Z',
      updatedAt: author.updatedAt || new Date().toISOString(),
    })),
    ebooks: SEED_EBOOKS.map(ebook => ({
      ...ebook,
      publishStatus: ebook.publishStatus || 'published',
      isPublished: true,
      publicationDate: ebook.publicationDate || '2025-10-08',
      publicationTime: ebook.publicationTime || '14:00',
      createdAt: ebook.createdAt || '2025-10-08T14:00:00.000Z',
      updatedAt: ebook.updatedAt || new Date().toISOString(),
    })),
    classicalWorks: SEED_CLASSICAL.map(cw => ({
      ...cw,
      publishStatus: cw.publishStatus || 'published',
      publicationDate: cw.publicationDate || '2025-10-08',
      publicationTime: cw.publicationTime || '10:00',
      createdAt: cw.createdAt || '2025-10-08T10:00:00.000Z',
      updatedAt: cw.updatedAt || new Date().toISOString(),
    })),
    pages: SEED_PAGES,
    siteSettings: DEFAULT_SITE_SETTINGS,
  };
}
