import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Link2, Copy, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FileUploadDropzoneProps {
  label: string;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  accept?: string; // e.g. "image/*", ".pdf", "image/*,.pdf"
  fileTypeLabel?: string; // "Cover Image" or "PDF Document"
  onFileNameChange?: (name: string) => void;
  onFileSizeChange?: (size: string) => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  label,
  currentUrl,
  onUrlChange,
  accept = 'image/*',
  fileTypeLabel = 'File',
  onFileNameChange,
  onFileSizeChange,
}) => {
  const { uploadPersistentFile } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = accept.includes('pdf') || currentUrl?.toLowerCase().endsWith('.pdf');
  const isImage = accept.includes('image') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(currentUrl || '');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const res = await uploadPersistentFile(file);
      onUrlChange(res.url);
      if (onFileNameChange) onFileNameChange(res.fileName);
      if (onFileSizeChange) onFileSizeChange(res.fileSize);
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#173F35] uppercase tracking-wide">
          {label}
        </label>
        <span className="text-[11px] text-[#6B6B6B]">
          Persistent Public Storage
        </span>
      </div>

      {/* Dropzone container */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#173F35] bg-[#173F35]/5 scale-[0.99]'
            : 'border-[#D1C7B7] hover:border-[#173F35] bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-3 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#173F35] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#173F35] font-semibold">
              Uploading {fileTypeLabel} to persistent cloud/disk storage...
            </p>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[#F8F4EA] flex items-center justify-center text-[#173F35]">
              {isPdf ? <FileText className="w-5 h-5 text-[#C8A45D]" /> : <UploadCloud className="w-5 h-5 text-[#C8A45D]" />}
            </div>
            <p className="text-xs font-semibold text-[#173F35]">
              Click to browse or drop {fileTypeLabel.toLowerCase()} here
            </p>
            <p className="text-[10px] text-[#8C827A]">
              Saves permanently to <code className="bg-[#EEE8D8] px-1 py-0.5 rounded">/uploads</code> and visible to all visitors
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* URL Input & Current Value */}
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={currentUrl || ''}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={`Or paste ${fileTypeLabel} URL / Google Drive link...`}
              className="w-full text-xs pl-8 pr-3 py-2 border border-[#D1C7B7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            />
            <Link2 className="w-3.5 h-3.5 text-[#8C827A] absolute left-2.5 top-2.5" />
          </div>
          {currentUrl && (
            <button
              type="button"
              onClick={copyUrl}
              className="px-2.5 py-2 bg-[#F8F4EA] border border-[#D1C7B7] rounded-lg text-xs font-medium text-[#173F35] hover:bg-[#EEE8D8] transition-colors flex items-center gap-1"
              title="Copy URL"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {/* Live Preview if an image URL is set */}
        {currentUrl && isImage && (
          <div className="mt-2 flex items-center gap-3 p-2 bg-[#F8F4EA] rounded-lg border border-[#E5DECE]">
            <img
              src={currentUrl}
              alt="Preview"
              className="w-12 h-14 object-cover rounded shadow-sm border border-[#D1C7B7]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-[11px] overflow-hidden">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Image URL Active
              </span>
              <p className="text-[#6B6B6B] truncate font-mono text-[10px] mt-0.5">{currentUrl}</p>
            </div>
          </div>
        )}

        {/* Live Preview if a PDF URL is set */}
        {currentUrl && isPdf && (
          <div className="mt-2 flex items-center gap-3 p-2 bg-[#F8F4EA] rounded-lg border border-[#E5DECE]">
            <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
              PDF
            </div>
            <div className="text-[11px] overflow-hidden">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PDF Document Linked
              </span>
              <p className="text-[#6B6B6B] truncate font-mono text-[10px] mt-0.5">{currentUrl}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
