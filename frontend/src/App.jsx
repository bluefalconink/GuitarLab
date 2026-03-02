import React, { useRef, useEffect } from 'react';
import { Guitar, RotateCcw } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { ErrorBoundary } from './components/ErrorBoundary';
import AgentSelector from './components/AgentSelector';
import SetupProgress from './components/SetupProgress';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';

function ChatApp() {
  const {
    messages,
    isLoading,
    error,
    currentAgent,
    currentStep,
    uploadingImage,
    sendMessage,
    handleImageUpload,
    switchAgent,
    clearChat,
    manualAdvanceStep,
  } = useChat();

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gsb-dark">
      {/* Header */}
      <header className="shrink-0 bg-gsb-darker border-b border-gsb-surface-light">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gsb-teal flex items-center justify-center">
              <Guitar className="text-gsb-gold" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-100 leading-tight">GuitarLab</h1>
              <p className="text-xs text-gray-500">Powered by Falconverse</p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gsb-surface transition-colors"
            aria-label="New conversation"
            title="New conversation"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Agent selector */}
        <AgentSelector currentAgent={currentAgent} onSelect={switchAgent} />

        {/* Setup progress — only shown for Luthier agent */}
        {currentAgent === 'luthier' && (
          <SetupProgress currentStep={currentStep} onAdvance={manualAdvanceStep} hasSession={messages.length > 0} />
        )}
      </header>

      {/* Chat messages area */}
      <main className="flex-1 overflow-y-auto chat-scroll">
        {messages.length === 0 ? (
          <WelcomeScreen currentAgent={currentAgent} onSendSuggestion={sendMessage} />
        ) : (
          <div className="py-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="shrink-0">
        <ChatInput
          onSend={sendMessage}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
          uploadingImage={uploadingImage}
        />
      </div>
    </div>
  );
}

/**
 * Welcome screen shown when no messages exist yet.
 */
function WelcomeScreen({ currentAgent, onSendSuggestion }) {
  const isLuthier = currentAgent === 'luthier';
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gsb-teal/50 flex items-center justify-center mb-6">
        <span className="text-4xl">{isLuthier ? '🎸' : '⚡'}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        {isLuthier ? 'Master Luthier' : 'Tone & Electrical Guru'}
      </h2>
      <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
        {isLuthier
          ? "I'll guide you through a professional guitar setup step by step — from tuning to intonation. Tell me about your guitar to get started!"
          : "Let's dial in your perfect tone! I can help with pickup wiring, electronics troubleshooting, and component recommendations. What are you working with?"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {(isLuthier
          ? [
              'My action feels too high',
              'I just changed string gauge',
              'My intonation is off',
            ]
          : [
              'My pickups are humming',
              'I want to coil-split my humbuckers',
              'Which pots should I use?',
            ]
        ).map((suggestion) => (
          <button
            key={suggestion}
            className="px-4 py-2 text-xs bg-gsb-surface text-gray-300 rounded-full
                       hover:bg-gsb-surface-light hover:text-gray-100 transition-colors"
            onClick={() => onSendSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Root App component wrapped in ErrorBoundary.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ChatApp />
    </ErrorBoundary>
  );
}
