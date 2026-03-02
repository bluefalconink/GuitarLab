import React from 'react';
import { ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 'tune', label: 'Tune', emoji: '🎵' },
  { id: 'neck_relief', label: 'Neck Relief', emoji: '📏' },
  { id: 'string_action', label: 'String Action', emoji: '📐' },
  { id: 'nut_action', label: 'Nut Action', emoji: '🔩' },
  { id: 'intonation', label: 'Intonation', emoji: '🎯' },
];

/**
 * Visual progress indicator for the Luthier's Sacred Order.
 * Shows an "Advance" button to let users confirm step completion.
 */
export default function SetupProgress({ currentStep, onAdvance, hasSession }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isComplete = currentStep === 'complete';

  return (
    <div className="px-4 py-2 bg-gsb-darker border-b border-gsb-surface-light">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {STEPS.map((step, i) => {
          const isDone = isComplete || i < currentIndex;
          const isCurrent = !isComplete && i === currentIndex;
          const isFuture = !isComplete && i > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                    transition-all duration-300
                    ${isDone ? 'bg-green-600 text-white' : ''}
                    ${isCurrent ? 'bg-gsb-gold text-gsb-dark ring-2 ring-gsb-gold/50 ring-offset-2 ring-offset-gsb-darker' : ''}
                    ${isFuture ? 'bg-gsb-surface text-gray-500' : ''}
                  `}
                >
                  {isDone ? '✓' : step.emoji}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium
                    ${isCurrent ? 'text-gsb-gold' : isDone ? 'text-green-400' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1 rounded transition-colors duration-300
                    ${isDone && (isComplete || i < currentIndex - 1 || (i === currentIndex - 1)) ? 'bg-green-600' : 'bg-gsb-surface'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step advance button — only visible during an active session */}
      {hasSession && !isComplete && (
        <div className="flex justify-center mt-2">
          <button
            onClick={onAdvance}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gsb-gold
                       bg-gsb-surface hover:bg-gsb-surface-light px-3 py-1 rounded-full transition-colors"
          >
            Step done <ChevronRight size={14} />
          </button>
        </div>
      )}

      {isComplete && (
        <p className="text-center text-xs text-green-400 mt-1 font-medium">🎉 Setup complete!</p>
      )}
    </div>
  );
}
