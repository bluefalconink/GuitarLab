import { useState, useCallback, useRef } from 'react';
import { sendChatMessage, uploadImage, advanceStep } from '../utils/api';

/**
 * Custom hook that manages chat state, message sending, and image uploads.
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentAgent, setCurrentAgent] = useState('luthier');
  const [currentStep, setCurrentStep] = useState('tune');
  const [uploadingImage, setUploadingImage] = useState(false);

  const abortRef = useRef(null);

  /**
   * Send a text message (optionally with an attached image URL).
   */
  const sendMessage = useCallback(
    async (text, imageUrl = null) => {
      if (!text.trim() && !imageUrl) return;

      setError(null);

      // Add user message to UI immediately
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: text,
        imageUrl,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendChatMessage({
          message: text,
          agent: currentAgent,
          sessionId,
          imageUrl,
        });

        // Update session state
        if (data.session_id) setSessionId(data.session_id);
        if (data.current_step) setCurrentStep(data.current_step);

        // Add assistant reply
        const assistantMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply,
          agent: data.agent,
          safetyWarning: data.safety_warning,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error('[useChat] sendMessage error:', err);
        setError(err.message);

        // Add error message to chat so user sees it inline
        const errorMsg = {
          id: Date.now() + 1,
          role: 'system',
          content: `⚠️ ${err.message}`,
          isError: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentAgent, sessionId]
  );

  /**
   * Handle image file upload, then send a message referencing the uploaded image.
   */
  const handleImageUpload = useCallback(
    async (file, messageText = 'Please analyze this guitar hardware.') => {
      setUploadingImage(true);
      setError(null);

      try {
        // Validate client-side first
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSize) {
          throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: 10 MB.`);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}. Please upload a JPEG, PNG, or WebP image.`);
        }

        console.log(`[useChat] Uploading image: ${file.name} (${file.size} bytes)`);
        const uploadResult = await uploadImage(file);

        // Now send a chat message referencing the uploaded image
        await sendMessage(messageText, uploadResult.url);
      } catch (err) {
        console.error('[useChat] Image upload error:', err);
        setError(err.message);

        const errorMsg = {
          id: Date.now(),
          role: 'system',
          content: `⚠️ Upload failed: ${err.message}`,
          isError: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setUploadingImage(false);
      }
    },
    [sendMessage]
  );

  /**
   * Switch between agents. Adds a system divider so the user knows the change.
   */
  const switchAgent = useCallback(
    (agent) => {
      if (agent === currentAgent) return;
      console.log(`[useChat] Switching agent to: ${agent}`);
      setCurrentAgent(agent);

      // Add an inline system message so the user sees the handoff
      if (messages.length > 0) {
        const label = agent === 'luthier' ? 'Master Luthier' : 'Tone & Electrical Guru';
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'system',
            content: `Switched to ${label}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [currentAgent, messages.length]
  );

  /**
   * Manually advance the Luthier setup step ("I'm done with this step").
   */
  const manualAdvanceStep = useCallback(async () => {
    if (!sessionId || currentAgent !== 'luthier') return;
    try {
      const data = await advanceStep(sessionId);
      if (data.new_step) setCurrentStep(data.new_step);
      console.log(`[useChat] Advanced to step: ${data.new_step}`);

      const label = data.new_step?.replace('_', ' ') || 'next step';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          content: `✅ Step complete — moving to **${label}**`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('[useChat] advanceStep error:', err);
    }
  }, [sessionId, currentAgent]);

  /**
   * Clear chat and start fresh.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setCurrentStep('tune');
    console.log('[useChat] Chat cleared');
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    currentAgent,
    currentStep,
    uploadingImage,
    sendMessage,
    handleImageUpload,
    switchAgent,
    clearChat,
    manualAdvanceStep,
    setError,
  };
}
