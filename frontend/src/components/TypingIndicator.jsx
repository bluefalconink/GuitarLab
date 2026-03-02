import React from 'react';

/**
 * Animated typing indicator shown while waiting for agent response.
 */
export default function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 justify-start">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gsb-teal flex items-center justify-center">
        <span className="text-xs">🎸</span>
      </div>
      <div className="bg-gsb-surface rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <div className="w-2 h-2 bg-gsb-gold rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gsb-gold rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gsb-gold rounded-full typing-dot" />
      </div>
    </div>
  );
}
