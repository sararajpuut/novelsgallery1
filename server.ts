import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getInitialDatabase } from './src/data/initialDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure data and uploads directories exist
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'production-db.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Database helper
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.novels) && parsed.novels.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[DB] Error reading database file:', err);
  }
  // Initialize with seed data if absent or empty
  const initial = getInitialDatabase();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(data: any) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Error writing database file:', err);
    return false;
  }
}

// In-memory reference synced to disk
let db = loadDatabase();

// Middleware: allow large payloads for base64 image/PDF uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// CORS headers for multi-device cross-origin safety
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve persistent uploads statically
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health / Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    environment: isProd ? 'production' : 'development',
    storage: 'persistent-disk',
    databaseFile: DB_FILE,
    lastUpdated: db.lastUpdated,
    counts: {
      novels: db.novels.length,
      authors: db.authors.length,
      episodes: db.episodes.length,
      ebooks: db.ebooks.length,
      classicalWorks: db.classicalWorks.length,
      pages: (db.pages || []).length,
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Full DB snapshot (for multi-device sync & backup)
app.get('/api/database', (req, res) => {
  res.json(db);
});

app.post('/api/database/import', (req, res) => {
  const imported = req.body;
  if (!imported || !Array.isArray(imported.novels)) {
    return res.status(400).json({ error: 'Invalid database format' });
  }
  db = imported;
  saveDatabase(db);
  res.json({ success: true, message: 'Database successfully imported' });
});

// Reset seed (resets to initial 8 novels + initial pages)
app.post('/api/reset-seed', (req, res) => {
  db = getInitialDatabase();
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to default seed data', db });
});

// --- Novels Endpoints ---
app.get('/api/novels', (req, res) => {
  const { status, publishedOnly } = req.query;
  let result = db.novels;
  if (publishedOnly === 'true') {
    result = result.filter((n: any) => n.publishStatus === 'published' || (n.isPublished && n.publishStatus !== 'draft' && n.publishStatus !== 'unpublished'));
  }
  if (status) {
    result = result.filter((n: any) => n.status === status);
  }
  res.json(result);
});

app.post('/api/novels', (req, res) => {
  const newNovel = {
    ...req.body,
    id: req.body.id || `novel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    rating: req.body.rating || 5.0,
    totalReviews: req.body.totalReviews || 1,
    viewsCount: req.body.viewsCount || 0,
    likesCount: req.body.likesCount || 0,
    publishStatus: req.body.publishStatus || (req.body.isPublished !== false ? 'published' : 'draft'),
    isPublished: req.body.publishStatus === 'published' || req.body.isPublished === true,
    publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    publicationTime: req.body.publicationTime || '12:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.novels.unshift(newNovel);
  saveDatabase(db);
  console.log(`[DB] Novel created: ${newNovel.title} (Total: ${db.novels.length})`);
  res.status(201).json(newNovel);
});

app.put('/api/novels/:id', (req, res) => {
  const { id } = req.params;
  const index = db.novels.findIndex((n: any) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Novel not found' });
  }

  const existing = db.novels[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent ID overwrite
    updatedAt: new Date().toISOString(),
  };

  // Sync isPublished with publishStatus
  if (req.body.publishStatus) {
    updated.isPublished = req.body.publishStatus === 'published';
  }

  db.novels[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/novels/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = db.novels.length;
  db.novels = db.novels.filter((n: any) => n.id !== id);
  if (db.novels.length === initialLength) {
    return res.status(404).json({ error: 'Novel not found' });
  }
  saveDatabase(db);
  res.json({ success: true, message: 'Novel deleted' });
});

// --- Episodes Endpoints ---
app.get('/api/episodes', (req, res) => {
  const { novelId } = req.query;
  let result = db.episodes;
  if (novelId) {
    result = result.filter((ep: any) => ep.novelId === novelId);
  }
  res.json(result);
});

app.post('/api/episodes', (req, res) => {
  const newEpisode = {
    ...req.body,
    id: req.body.id || `ep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    views: req.body.views || 0,
    publishStatus: req.body.publishStatus || 'published',
    isPublished: req.body.publishStatus === 'published' || req.body.isPublished !== false,
    publishedDate: req.body.publishedDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.episodes.push(newEpisode);

  // Update parent novel episodes count
  const parentNovel = db.novels.find((n: any) => n.id === newEpisode.novelId);
  if (parentNovel) {
    parentNovel.episodesCount = db.episodes.filter((e: any) => e.novelId === parentNovel.id).length;
  }

  saveDatabase(db);
  res.status(201).json(newEpisode);
});

app.put('/api/episodes/:id', (req, res) => {
  const { id } = req.params;
  const index = db.episodes.findIndex((e: any) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Episode not found' });
  }

  const updated = {
    ...db.episodes[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.publishStatus) {
    updated.isPublished = req.body.publishStatus === 'published';
  }

  db.episodes[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/episodes/:id', (req, res) => {
  const { id } = req.params;
  const ep = db.episodes.find((e: any) => e.id === id);
  if (!ep) {
    return res.status(404).json({ error: 'Episode not found' });
  }
  const novelId = ep.novelId;
  db.episodes = db.episodes.filter((e: any) => e.id !== id);

  const parentNovel = db.novels.find((n: any) => n.id === novelId);
  if (parentNovel) {
    parentNovel.episodesCount = db.episodes.filter((e: any) => e.novelId === novelId).length;
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Episode deleted' });
});

// --- Authors Endpoints ---
app.get('/api/authors', (req, res) => {
  res.json(db.authors);
});

app.post('/api/authors', (req, res) => {
  const newAuthor = {
    ...req.body,
    id: req.body.id || `author-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    followersCount: req.body.followersCount || 100,
    novelsCount: req.body.novelsCount || 1,
    publishStatus: req.body.publishStatus || 'published',
    publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.authors.unshift(newAuthor);
  saveDatabase(db);
  res.status(201).json(newAuthor);
});

app.put('/api/authors/:id', (req, res) => {
  const { id } = req.params;
  const index = db.authors.findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }

  const updated = {
    ...db.authors[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  db.authors[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/authors/:id', (req, res) => {
  const { id } = req.params;
  db.authors = db.authors.filter((a: any) => a.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Author deleted' });
});

// --- Ebooks Endpoints ---
app.get('/api/ebooks', (req, res) => {
  res.json(db.ebooks);
});

app.post('/api/ebooks', (req, res) => {
  const newEbook = {
    ...req.body,
    id: req.body.id || `ebook-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    publishStatus: req.body.publishStatus || 'published',
    isPublished: req.body.publishStatus === 'published' || req.body.isPublished !== false,
    publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.ebooks.unshift(newEbook);
  saveDatabase(db);
  res.status(201).json(newEbook);
});

app.put('/api/ebooks/:id', (req, res) => {
  const { id } = req.params;
  const index = db.ebooks.findIndex((eb: any) => eb.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ebook not found' });
  }

  const updated = {
    ...db.ebooks[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.publishStatus) {
    updated.isPublished = req.body.publishStatus === 'published';
  }

  db.ebooks[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/ebooks/:id', (req, res) => {
  const { id } = req.params;
  db.ebooks = db.ebooks.filter((eb: any) => eb.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Ebook deleted' });
});

// --- Classical Works Endpoints ---
app.get('/api/classical', (req, res) => {
  res.json(db.classicalWorks);
});

app.post('/api/classical', (req, res) => {
  const newClassical = {
    ...req.body,
    id: req.body.id || `cw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.classicalWorks.unshift(newClassical);
  saveDatabase(db);
  res.status(201).json(newClassical);
});

app.put('/api/classical/:id', (req, res) => {
  const { id } = req.params;
  const index = db.classicalWorks.findIndex((cw: any) => cw.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Classical work not found' });
  }
  db.classicalWorks[index] = { ...db.classicalWorks[index], ...req.body, id, updatedAt: new Date().toISOString() };
  saveDatabase(db);
  res.json(db.classicalWorks[index]);
});

app.delete('/api/classical/:id', (req, res) => {
  const { id } = req.params;
  db.classicalWorks = db.classicalWorks.filter((cw: any) => cw.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Classical work deleted' });
});

// --- Dynamic Custom Pages Endpoints ---
app.get('/api/pages', (req, res) => {
  if (!db.pages) db.pages = [];
  res.json(db.pages);
});

app.get('/api/pages/slug/:slug', (req, res) => {
  if (!db.pages) db.pages = [];
  const page = db.pages.find((p: any) => p.slug === req.params.slug);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page);
});

app.post('/api/pages', (req, res) => {
  if (!db.pages) db.pages = [];
  const rawSlug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slug = rawSlug || `page-${Date.now()}`;

  const newPage = {
    ...req.body,
    id: req.body.id || `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug,
    publishStatus: req.body.publishStatus || 'published',
    isPublished: req.body.publishStatus === 'published' || req.body.isPublished !== false,
    publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    publicationTime: req.body.publicationTime || '12:00',
    showInNav: req.body.showInNav ?? true,
    showInFooter: req.body.showInFooter ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.pages.unshift(newPage);
  saveDatabase(db);
  console.log(`[DB] Custom Page created: ${newPage.title} (/page/${newPage.slug})`);
  res.status(201).json(newPage);
});

app.put('/api/pages/:id', (req, res) => {
  if (!db.pages) db.pages = [];
  const { id } = req.params;
  const index = db.pages.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }

  const updated = {
    ...db.pages[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.publishStatus) {
    updated.isPublished = req.body.publishStatus === 'published';
  }

  db.pages[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/pages/:id', (req, res) => {
  if (!db.pages) db.pages = [];
  const { id } = req.params;
  db.pages = db.pages.filter((p: any) => p.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Page deleted' });
});

// --- Site Settings ---
app.get('/api/settings', (req, res) => {
  res.json(db.siteSettings);
});

app.put('/api/settings', (req, res) => {
  db.siteSettings = {
    ...db.siteSettings,
    ...req.body,
  };
  saveDatabase(db);
  res.json(db.siteSettings);
});

// --- File & Image Upload (Persistent Public Storage) ---
app.post('/api/upload', (req, res) => {
  try {
    const { fileName, fileData, mimeType } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'fileData (base64 string) is required' });
    }

    // Strip prefix like data:image/png;base64, if present
    const base64Clean = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Determine extension
    let extension = '.bin';
    if (fileName && fileName.includes('.')) {
      extension = path.extname(fileName).toLowerCase();
    } else if (mimeType) {
      if (mimeType.includes('pdf')) extension = '.pdf';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg';
      else if (mimeType.includes('png')) extension = '.png';
      else if (mimeType.includes('webp')) extension = '.webp';
      else if (mimeType.includes('gif')) extension = '.gif';
      else if (mimeType.includes('svg')) extension = '.svg';
    }

    const safeBaseName = (fileName ? path.basename(fileName, extension) : 'upload')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .substring(0, 40);

    const uniqueFileName = `${Date.now()}_${safeBaseName}${extension}`;
    const targetFilePath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    const fileSizeFormatted = buffer.length > 1024 * 1024 
      ? `${(buffer.length / (1024 * 1024)).toFixed(1)} MB`
      : `${(buffer.length / 1024).toFixed(0)} KB`;

    console.log(`[UPLOAD] File saved permanently: ${publicUrl} (${fileSizeFormatted})`);

    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      originalName: fileName || uniqueFileName,
      fileSize: fileSizeFormatted,
      mimeType: mimeType || 'application/octet-stream'
    });
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// --- Dynamic Sitemap for SEO & Search Engines ---
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://novelsgallery.com';
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/novels</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/authors</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ebooks</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/classical</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  // Dynamic Published Novels
  (db.novels || []).forEach((n: any) => {
    if (n.publishStatus === 'published' || n.isPublished) {
      xml += `  <url>
    <loc>${baseUrl}/novel/${encodeURIComponent(n.id)}</loc>
    <lastmod>${n.publicationDate || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    }
  });

  // Dynamic Published Authors
  (db.authors || []).forEach((a: any) => {
    if (a.publishStatus !== 'draft' && a.publishStatus !== 'unpublished') {
      xml += `  <url>
    <loc>${baseUrl}/author/${encodeURIComponent(a.id)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    }
  });

  // Dynamic Custom Pages
  (db.pages || []).forEach((p: any) => {
    if (p.publishStatus === 'published' || p.isPublished) {
      xml += `  <url>
    <loc>${baseUrl}/page/${encodeURIComponent(p.slug)}</loc>
    <lastmod>${p.publicationDate || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// ==========================================
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[SERVER] Vite development middleware mounted');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[SERVER] Production static serving enabled from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🚀 Novels Gallery Full-Stack Server running on port ${PORT}`);
    console.log(`📁 Persistent DB File: ${DB_FILE}`);
    console.log(`📂 Public Uploads Directory: ${UPLOADS_DIR}`);
    console.log(`📚 Initial Records: ${db.novels.length} Novels, ${db.authors.length} Authors, ${(db.pages || []).length} Pages`);
    console.log(`===============================================`);
  });
}

startServer().catch(err => {
  console.error('[SERVER BOOT ERROR]', err);
  process.exit(1);
});
