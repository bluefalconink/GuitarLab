import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, Bot, User } from 'lucide-react';

/**
 * Renders a single chat message bubble — user, assistant, or system error.
 */
export default function ChatMessage({ message }) {
  const { role, content, isError, safetyWarning, imageUrl, agent } = message;

  // System / error messages
  if (role === 'system') {
    return (
      <div className="flex justify-center my-2 px-4">
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm max-w-lg
            ${isError ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-gsb-surface text-gray-400'}
          `}
        >
          {isError && <AlertTriangle size={16} className="shrink-0" />}
          <span>{content}</span>
        </div>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gsb-teal flex items-center justify-center mt-1">
          <Bot size={18} className="text-gsb-gold" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? 'bg-gsb-teal text-gray-100 rounded-br-md'
              : 'bg-gsb-surface text-gray-200 rounded-bl-md'
          }
        `}
      >
        {/* Inline uploaded image preview */}
        {imageUrl && (
          <div className="mb-2">
            <img
              src={imageUrl}
              alt="Uploaded guitar hardware"
              className="rounded-lg max-h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                console.warn('[ChatMessage] Image failed to load:', imageUrl);
              }}
            />
          </div>
        )}

        {/* Safety warning banner */}
        {safetyWarning && (
          <div className="mb-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200 text-xs">
            <ReactMarkdown className="markdown-content">{safetyWarning}</ReactMarkdown>
          </div>
        )}

        {/* Message content */}
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown className="markdown-content">{content}</ReactMarkdown>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gsb-accent/80 flex items-center justify-center mt-1">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}
