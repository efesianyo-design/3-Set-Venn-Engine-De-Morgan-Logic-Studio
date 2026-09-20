/**
 * Docked Action Strip (Bottom Toolbar)
 * Fast tactile action buttons with safe-area padding for classroom & mobile ergonomics.
 */

import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  FlipHorizontal,
  Calculator,
  BookOpenCheck,
  Tag,
} from 'lucide-react';
import { playButtonClickSound, playActionToggleSound } from '../utils/audio';

interface BottomToolbarProps {
  onClearShading: () => void;
  onShadeAll: () => void;
  onInvertSelection: () => void;
  onOpenSurveySolver: () => void;
  onOpenDeMorgan: () => void;
  labelMode: 'numbers' | 'formulas' | 'values';
  onChangeLabelMode: (mode: 'numbers' | 'formulas' | 'values') => void;
  shadedCount: number;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  onClearShading,
  onShadeAll,
  onInvertSelection,
  onOpenSurveySolver,
  onOpenDeMorgan,
  labelMode,
  onChangeLabelMode,
  shadedCount,
}) => {
  const cycleLabelMode = () => {
    playButtonClickSound();
    if (labelMode === 'numbers') onChangeLabelMode('formulas');
    else if (labelMode === 'formulas') onChangeLabelMode('values');
    else onChangeLabelMode('numbers');
  };

  return (
    <div
      id="docked-action-strip"
      className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] flex-shrink-0 z-20 select-none shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        {/* Shading Manipulation Strip */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Clear Shading */}
          <button
            id="btn-clear-shading"
            onClick={() => {
              playActionToggleSound();
              onClearShading();
            }}
            disabled={shadedCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Clear all shaded regions (∅)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Shade All */}
          <button
            id="btn-shade-all"
            onClick={() => {
              playActionToggleSound();
              onShadeAll();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Shade all 8 regions (Universal Set 𝕌)"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Shade</span> All
          </button>

          {/* Invert Selection */}
          <button
            id="btn-invert-selection"
            onClick={() => {
              playActionToggleSound();
              onInvertSelection();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Invert current shaded regions (Complement E')"
          >
            <FlipHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Invert</span>
          </button>

          {/* Toggle Region Badge Labels (r1 vs A∩B' vs Cardinality Values) */}
          <button
            id="btn-toggle-labels"
            onClick={cycleLabelMode}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition active:scale-95"
            title="Cycle region label display format"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize text-[11px] text-indigo-300 font-mono">
              {labelMode === 'numbers' ? 'r1..r8' : labelMode === 'formulas' ? 'A∩B' : 'Values'}
            </span>
          </button>
        </div>

        {/* Primary Feature Launchers Strip */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* De Morgan Proof Verifier */}
          <button
            id="btn-demorgan-proofs-bottom"
            onClick={() => {
              playButtonClickSound();
              onOpenDeMorgan();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>De Morgan Proofs</span>
          </button>

          {/* Solve 3-Set Survey Word Problem */}
          <button
            id="btn-solve-survey-bottom"
            onClick={() => {
              playButtonClickSound();
              onOpenSurveySolver();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Solve Survey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
