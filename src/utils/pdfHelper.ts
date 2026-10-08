import { PdfAccessMode } from '../types';

/**
 * Extracts Google Drive File ID from various share link formats
 */
export function extractGoogleDriveId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Standard format: drive.google.com/file/d/FILE_ID/view...
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Query param format: drive.google.com/open?id=FILE_ID or id=FILE_ID
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Bare ID format if user just pasted an alphanumeric Drive ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;

  return null;
}

/**
 * Converts a Google Drive link to an embeddable preview URL
 */
export function getGoogleDrivePreviewUrl(url: string): string {
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

/**
 * Converts a Google Drive link to a direct download URL
 */
export function getGoogleDriveDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Only PDF documents (.pdf) are supported.' };
  }
  // Max size 35MB for client base64 storage
  const maxBytes = 35 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: 'File size exceeds 35 MB. For larger books, please paste a Google Drive PDF link.' };
  }
  return { valid: true };
}

/**
 * Checks if Online Reading is enabled based on PDF access mode
 */
export function isPdfOnlineReadingEnabled(accessMode?: PdfAccessMode): boolean {
  if (!accessMode) return true;
  return accessMode === 'both' || accessMode === 'online_only';
}

/**
 * Checks if PDF Downloading is enabled based on PDF access mode
 */
export function isPdfDownloadEnabled(accessMode?: PdfAccessMode): boolean {
  if (!accessMode) return true;
  return accessMode === 'both' || accessMode === 'download_only';
}

/**
 * Triggers a direct download of a novel or e-book PDF
 */
export function triggerPdfDownload(item: {
  title: string;
  urduTitle?: string;
  author?: string;
  authorName?: string;
  pdfUrl?: string;
  googleDriveUrl?: string;
  pdfFileName?: string;
  sampleContent?: string;
  synopsis?: string;
}) {
  const fileName = item.pdfFileName || `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_NovelsGallery.pdf`;

  // 1. If Google Drive URL exists, trigger direct download
  if (item.googleDriveUrl) {
    const downloadUrl = getGoogleDriveDownloadUrl(item.googleDriveUrl);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. If direct PDF URL exists (data URL, blob, or external link)
  if (item.pdfUrl) {
    const link = document.createElement('a');
    link.href = item.pdfUrl;
    link.target = '_blank';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. Fallback: Generate a formatted Urdu printable document blob
  const authorName = item.authorName || item.author || 'Novels Gallery';
  const content = item.sampleContent || item.synopsis || 'Novels Gallery - Complete Urdu Digital Library Edition';
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ur" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${item.title}</title>
      <style>
        body {
          font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', Georgia, serif;
          margin: 40px;
          color: #173F35;
          background: #F8F4EA;
          line-height: 2.5;
          direction: rtl;
          text-align: right;
        }
        .header { text-align: center; border-bottom: 2px solid #C8A45D; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #173F35; margin: 0; }
        .author { font-size: 18px; color: #4A3025; margin-top: 8px; }
        .content { font-size: 20px; white-space: pre-line; text-align: justify; }
        .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #6B6B6B; border-top: 1px solid #EEE8D8; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${item.urduTitle || item.title}</h1>
        <div class="author">مصنف: ${authorName}</div>
      </div>
      <div class="content">${content}</div>
      <div class="footer">
        Novels Gallery · اردو کا مستند ڈیجیٹل کتب خانہ · www.novelsgallery.com
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
