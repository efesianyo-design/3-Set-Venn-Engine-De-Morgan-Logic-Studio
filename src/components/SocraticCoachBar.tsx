/**
 * Sir Eugene Socratic AI Coach Ribbon
 * Slim docked bar offering guiding set-theoretic questions without revealing direct regional solutions.
 * Embedded offline heuristics + /api/socratic-hint server-side AI Coach integration.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, RefreshCw, Bot, MessageSquare } from 'lucide-react';
import { playButtonClickSound } from '../utils/audio';

interface SocraticCoachBarProps {
  expression: string;
  shadedRegions: number[];
  studentName?: string;
  activeMode?: string;
}

export const SocraticCoachBar: React.FC<SocraticCoachBarProps> = ({
  expression,
  shadedRegions,
  studentName,
  activeMode = 'venn_stage',
}) => {
  const [hint, setHint] = useState<string>('');
  const [author, setAuthor] = useState<string>('Sir Eugene (Heuristic Coach)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Update default heuristic hint when shaded regions change
  useEffect(() => {
    const defaultHint = getOfflineHeuristicHint(shadedRegions, expression);
    setHint(defaultHint);
  }, [shadedRegions, expression]);

  const handleAskCoach = async () => {
    playButtonClickSound();
    setIsLoading(true);
    try {
      const res = await fetch('/api/socratic-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression,
          shadedRegions,
          studentName,
          activeMode,
        }),
      });
      const data = await res.json();
      if (data.hint) {
        setHint(data.hint);
        setAuthor(data.author || 'Sir Eugene Coach');
        setExpanded(true);
      }
    } catch {
      setHint(getOfflineHeuristicHint(shadedRegions, expression));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="socratic-coach-bar"
      className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-2 sm:px-4 sm:py-2.5 flex-shrink-0 z-20 transition-all select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Left Badge & Socratic Guidance Message */}
        <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {author}
              </span>
              <span className="text-[10px] text-slate-500">• Guiding Query</span>
            </div>
            <p className="text-xs text-slate-200 leading-snug line-clamp-2 sm:line-clamp-1 font-medium">
              {hint || "Click any region or query to explore Sir Eugene's Socratic insights."}
            </p>
          </div>
        </div>

        {/* Right Action Button: Ask Coach */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            id="btn-ask-coach"
            onClick={handleAskCoach}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Consulting...' : 'Ask Coach'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function getOfflineHeuristicHint(shadedRegions: number[], expression: string): string {
  if (shadedRegions.length === 0) {
    return "Socratic Query: The diagram is completely clear. What set operation yields an empty set ∅ in all three domains?";
  }
  if (shadedRegions.length === 8) {
    return "Socratic Query: All 8 regions are selected! How does the Universal Set 𝕌 encompass both the elements inside and outside (A ∪ B ∪ C)?";
  }
  if (shadedRegions.length === 1 && shadedRegions[0] === 7) {
    return "Socratic Query: You have isolated Region 7 (A ∩ B ∩ C). What happens if an element satisfies set conditions A and B, but fails C?";
  }
  if (shadedRegions.length === 1 && shadedRegions[0] === 8) {
    return "Socratic Query: Region 8 is the complement (A ∪ B ∪ C)'. By De Morgan's Law, what intersection of individual complements produces this exact region?";
  }
  if (shadedRegions.includes(1) && shadedRegions.includes(2) && shadedRegions.includes(3) && shadedRegions.length === 3) {
    return "Socratic Query: You have shaded 'Exactly One Set'. How can you state this mathematically using exclusive set differences?";
  }
  return `Socratic Query: Analyzing your ${shadedRegions.length} shaded region(s). Which set-builder property unites these while excluding the other ${8 - shadedRegions.length}?`;
}
