import React from 'react';
import { Guitar, Zap } from 'lucide-react';

const AGENTS = [
  {
    id: 'luthier',
    name: 'Master Luthier',
    description: 'Mechanical setup & adjustments',
    icon: Guitar,
    activeClass: 'bg-gsb-gold text-gsb-dark shadow-lg shadow-gsb-gold/25',
  },
  {
    id: 'tone_guru',
    name: 'Tone Guru',
    description: 'Electronics, pickups & wiring',
    icon: Zap,
    activeClass: 'bg-gsb-accent text-white shadow-lg shadow-gsb-accent/25',
  },
];

export default function AgentSelector({ currentAgent, onSelect }) {
  return (
    <div className="flex gap-2 p-2">
      {AGENTS.map((agent) => {
        const Icon = agent.icon;
        const isActive = currentAgent === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => onSelect(agent.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              text-sm font-medium
              ${
                isActive
                  ? agent.activeClass
                  : 'bg-gsb-surface text-gray-400 hover:bg-gsb-surface-light hover:text-gray-200'
              }
            `}
            aria-pressed={isActive}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{agent.name}</span>
            <span className="sm:hidden">{agent.name.split(' ').pop()}</span>
          </button>
        );
      })}
    </div>
  );
}
