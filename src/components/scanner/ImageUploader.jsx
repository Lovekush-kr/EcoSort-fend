import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { validateImageFile } from '../../utils/validators.js';
import ErrorMessage from '../ui/ErrorMessage.jsx';

/**
 * ImageUploader — file input with preview, drag-and-drop, and validation
 */
export default function ImageUploader({ onFileSelect, disabled = false }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setFileName(file.name);
      onFileSelect?.(file);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(null);
    setFileName('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect?.(null);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload waste image"
      />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-4" />}

      {preview ? (
        /* Image Preview */
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary-200 bg-gray-50">
          <img
            src={preview}
            alt="Selected waste image preview"
            className="w-full max-h-80 object-contain bg-white"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={openFilePicker}
              disabled={disabled}
              className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-md text-gray-700 hover:text-primary-600 transition-colors disabled:opacity-50"
              title="Replace image"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-md text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600 truncate">{fileName}</p>
          </div>
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={!disabled ? openFilePicker : undefined}
          className={`flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
            ${dragActive
              ? 'border-primary-500 bg-primary-50 scale-[1.01]'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50 bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker(); }}
          aria-label="Click or drag to upload an image"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
            {dragActive ? (
              <Upload className="w-8 h-8 text-primary-600 animate-bounce" />
            ) : (
              <ImageIcon className="w-8 h-8 text-primary-600" />
            )}
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-gray-700">
              {dragActive ? 'Drop your image here' : 'Upload waste image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPEG, PNG, WebP, or GIF &bull; Max 10 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

