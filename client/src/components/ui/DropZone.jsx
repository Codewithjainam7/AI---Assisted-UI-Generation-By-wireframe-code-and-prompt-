import React, { useRef, useState } from 'react';

export default function DropZone({ onFile, accept = 'image/*', maxSizeMB = 5 }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    setError('');
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`glass-strong border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
        isDragging ? 'border-red-500 bg-red-500/10 shadow-glow-red' : 'border-gray-600 hover:border-red-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" hidden ref={fileInputRef} accept={accept} onChange={(e) => handleFile(e.target.files[0])} />
      {preview ? (
        <div className="flex flex-col items-center">
          <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain mb-4" />
          <p className="text-sm text-gray-400">Click or drag to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <i className="pi pi-image text-4xl text-gray-500 mb-4"></i>
          <p className="text-lg font-medium text-gray-200">Drop your wireframe here</p>
          <p className="text-sm text-gray-400 mt-2">PNG, JPG, or WebP up to {maxSizeMB}MB</p>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
