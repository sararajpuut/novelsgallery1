import { Novel, Episode, Author, Ebook, ClassicalWork, CustomPage, SiteSettings, UploadResponse, DatabaseSchema } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `API Error ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.error) errorMessage = parsed.error;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export const api = {
  // Backend Status & Health
  async getStatus(): Promise<{
    status: string;
    environment: string;
    storage: string;
    databaseFile: string;
    lastUpdated: string;
    counts: Record<string, number>;
  }> {
    const res = await fetch(`${API_BASE}/status`);
    return handleResponse(res);
  },

  async getDatabase(): Promise<DatabaseSchema> {
    const res = await fetch(`${API_BASE}/database`);
    return handleResponse(res);
  },

  async importDatabase(db: DatabaseSchema): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/database/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
    return handleResponse(res);
  },

  async resetSeed(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/reset-seed`, { method: 'POST' });
    return handleResponse(res);
  },

  // Novels
  async getNovels(): Promise<Novel[]> {
    const res = await fetch(`${API_BASE}/novels`);
    return handleResponse<Novel[]>(res);
  },

  async createNovel(novel: Partial<Novel>): Promise<Novel> {
    const res = await fetch(`${API_BASE}/novels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novel),
    });
    return handleResponse<Novel>(res);
  },

  async updateNovel(id: string, updates: Partial<Novel>): Promise<Novel> {
    const res = await fetch(`${API_BASE}/novels/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Novel>(res);
  },

  async deleteNovel(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/novels/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Episodes
  async getEpisodes(novelId?: string): Promise<Episode[]> {
    const url = novelId ? `${API_BASE}/episodes?novelId=${encodeURIComponent(novelId)}` : `${API_BASE}/episodes`;
    const res = await fetch(url);
    return handleResponse<Episode[]>(res);
  },

  async createEpisode(episode: Partial<Episode>): Promise<Episode> {
    const res = await fetch(`${API_BASE}/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episode),
    });
    return handleResponse<Episode>(res);
  },

  async updateEpisode(id: string, updates: Partial<Episode>): Promise<Episode> {
    const res = await fetch(`${API_BASE}/episodes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Episode>(res);
  },

  async deleteEpisode(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/episodes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Authors
  async getAuthors(): Promise<Author[]> {
    const res = await fetch(`${API_BASE}/authors`);
    return handleResponse<Author[]>(res);
  },

  async createAuthor(author: Partial<Author>): Promise<Author> {
    const res = await fetch(`${API_BASE}/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    });
    return handleResponse<Author>(res);
  },

  async updateAuthor(id: string, updates: Partial<Author>): Promise<Author> {
    const res = await fetch(`${API_BASE}/authors/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Author>(res);
  },

  async deleteAuthor(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/authors/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Ebooks
  async getEbooks(): Promise<Ebook[]> {
    const res = await fetch(`${API_BASE}/ebooks`);
    return handleResponse<Ebook[]>(res);
  },

  async createEbook(ebook: Partial<Ebook>): Promise<Ebook> {
    const res = await fetch(`${API_BASE}/ebooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ebook),
    });
    return handleResponse<Ebook>(res);
  },

  async updateEbook(id: string, updates: Partial<Ebook>): Promise<Ebook> {
    const res = await fetch(`${API_BASE}/ebooks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Ebook>(res);
  },

  async deleteEbook(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/ebooks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Classical Works
  async getClassical(): Promise<ClassicalWork[]> {
    const res = await fetch(`${API_BASE}/classical`);
    return handleResponse<ClassicalWork[]>(res);
  },

  async createClassical(work: Partial<ClassicalWork>): Promise<ClassicalWork> {
    const res = await fetch(`${API_BASE}/classical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
    });
    return handleResponse<ClassicalWork>(res);
  },

  async updateClassical(id: string, updates: Partial<ClassicalWork>): Promise<ClassicalWork> {
    const res = await fetch(`${API_BASE}/classical/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<ClassicalWork>(res);
  },

  async deleteClassical(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/classical/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Dynamic Custom Pages
  async getPages(): Promise<CustomPage[]> {
    const res = await fetch(`${API_BASE}/pages`);
    return handleResponse<CustomPage[]>(res);
  },

  async getPageBySlug(slug: string): Promise<CustomPage> {
    const res = await fetch(`${API_BASE}/pages/slug/${encodeURIComponent(slug)}`);
    return handleResponse<CustomPage>(res);
  },

  async createPage(page: Partial<CustomPage>): Promise<CustomPage> {
    const res = await fetch(`${API_BASE}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    return handleResponse<CustomPage>(res);
  },

  async updatePage(id: string, updates: Partial<CustomPage>): Promise<CustomPage> {
    const res = await fetch(`${API_BASE}/pages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<CustomPage>(res);
  },

  async deletePage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/pages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<SiteSettings>(res);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return handleResponse<SiteSettings>(res);
  },

  // Persistent Public Upload (Images, Covers, PDFs)
  async uploadFile(file: File): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData,
              mimeType: file.type || 'application/octet-stream',
            }),
          });
          const json = await handleResponse<UploadResponse>(res);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file locally before upload'));
      reader.readAsDataURL(file);
    });
  },
};
