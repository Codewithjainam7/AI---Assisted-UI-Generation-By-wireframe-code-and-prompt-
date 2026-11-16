import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, AlertCircle, RefreshCw, X, FileImage } from 'lucide-react';

export default function DropZone({
  onFile,
  accept = 'image/png,image/jpeg,image/webp',
  maxSizeMB = 8,
  currentFile = null
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Keep internal preview state synchronized with incoming currentFile prop
  useEffect(() => {
    if (currentFile) {
      setFileName(currentFile.name || 'staged-wireframe.jpg');
      setFileSize(
        currentFile.size
          ? `${(currentFile.size / (1024 * 1024)).toFixed(2)} MB`
          : 'Cached Image'
      );
      try {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(currentFile);
      } catch (err) {
        // If it's a URL or blob string
        setPreview(URL.createObjectURL(currentFile));
      }
    } else {
      setPreview(null);
      setFileName('');
      setFileSize('');
    }
  }, [currentFile]);

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFile(null);
  };

  return (
    <div
      className={`relative rounded-[28px] border-2 border-dashed transition-all duration-300 p-6 sm:p-8 text-center cursor-pointer overflow-hidden ${
        isDragging
          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_35px_rgba(6,182,212,0.3)] scale-[1.01]'
          : preview
          ? 'border-emerald-500/50 bg-emerald-500/[0.04] shadow-lg'
          : 'border-white/15 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-white/[0.04]'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Specular sheen */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative group max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/60">
            <img src={preview} alt="Wireframe Preview" className="max-h-64 w-auto object-contain mx-auto" />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/25 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[220px] font-semibold">{fileName || 'Wireframe Ready'}</span>
            </div>
            {fileSize && (
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {fileSize}
              </span>
            )}
            <button
              type="button"
              onClick={clearFile}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-full hover:bg-white/5 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-cyan-500/20 border border-white/15 flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-base font-bold text-white tracking-tight">
            Drop wireframe sketch or screenshot
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Upload hand-drawn napkin sketches, Figma exports, or whiteboard photos (PNG, JPG, WebP up to {maxSizeMB}MB)
          </p>
          <div className="mt-5 px-5 py-2 rounded-full bg-white/[0.06] border border-white/12 text-xs font-semibold text-cyan-300 hover:bg-white/[0.12] hover:text-white transition-all shadow-sm flex items-center gap-2">
            <FileImage className="w-3.5 h-3.5" />
            <span>Browse File</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs mt-3 font-medium bg-rose-500/10 py-1.5 px-3 rounded-full border border-rose-500/20">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
