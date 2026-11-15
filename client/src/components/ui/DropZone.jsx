import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

export default function DropZone({ onFile, accept = 'image/png,image/jpeg,image/webp', maxSizeMB = 8, currentFile = null }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    setFileName(file.name);
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

  return (
    <div
      className={`relative rounded-[26px] border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer overflow-hidden ${
        isDragging
          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_35px_rgba(59,130,246,0.25)]'
          : preview
          ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-sm'
          : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Specular sheen */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

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
          <div className="relative group max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img src={preview} alt="Wireframe Preview" className="max-h-60 w-auto object-contain bg-black/40" />
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
              <RefreshCw className="w-4 h-4" />
              <span>Click to replace image</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[260px]">{fileName || 'Wireframe Ready'}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/15 to-cyan-500/15 border border-white/10 flex items-center justify-center mb-3.5 shadow-inner group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7 text-cyan-400" />
          </div>
          <p className="text-sm font-semibold text-white tracking-tight">Drop wireframe drawing or screenshot</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WebP up to {maxSizeMB}MB</p>
          <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm">
            Browse File
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs mt-3 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
