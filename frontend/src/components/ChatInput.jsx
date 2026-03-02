import React, { useState, useRef } from 'react';
import { Send, Image, X, Loader2 } from 'lucide-react';

/**
 * Chat input bar with text input, image attachment button, and send button.
 * Mobile-first: full width, large touch targets.
 */
export default function ChatInput({ onSend, onImageUpload, isLoading, uploadingImage }) {
  const [text, setText] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading || uploadingImage) return;

    if (previewFile) {
      onImageUpload(previewFile, text || 'Please analyze this guitar hardware.');
      clearPreview();
      setText('');
      return;
    }

    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10 MB.');
      return;
    }

    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log(`[ChatInput] Image selected: ${file.name} (${file.size} bytes)`);
  };

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gsb-surface-light bg-gsb-darker">
      {/* Image preview strip */}
      {previewUrl && (
        <div className="px-4 pt-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-lg border border-gsb-surface-light"
            />
            <button
              onClick={clearPreview}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-500"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
          <span className="text-xs text-gray-400 truncate max-w-[200px]">{previewFile?.name}</span>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 sm:p-4">
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || uploadingImage}
          className="shrink-0 p-2.5 rounded-xl bg-gsb-surface text-gray-400
                     hover:text-gsb-gold hover:bg-gsb-surface-light transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Attach image"
        >
          {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <Image size={20} />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your guitar or ask a question…"
          rows={1}
          className="flex-1 resize-none bg-gsb-surface rounded-xl px-4 py-2.5
                     text-sm text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-gsb-gold/50
                     max-h-32 min-h-[42px]"
          style={{ height: 'auto' }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={isLoading || uploadingImage || (!text.trim() && !previewFile)}
          className="shrink-0 p-2.5 rounded-xl bg-gsb-gold text-gsb-dark font-medium
                     hover:bg-gsb-gold/90 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
