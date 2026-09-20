/**
 * Symbolic Logic Query Builder
 * High-speed visual keypad & expression evaluator for 3-Set Boolean Algebra.
 */

import React from 'react';
import {
  EXPRESSION_PRESETS,
  ExpressionPreset,
  formatRegionsToLatex,
} from '../utils/setLogic';
import { MathView } from './MathView';
import { playButtonClickSound } from '../utils/audio';
import { Delete, Sparkles, Check, AlertCircle, RotateCcw } from 'lucide-react';

interface LogicQueryBuilderProps {
  expression: string;
  onChangeExpression: (expr: string) => void;
  onSelectPreset: (preset: ExpressionPreset) => void;
  evaluationError: string | null;
  shadedRegions: number[];
  onClear: () => void;
}

export const LogicQueryBuilder: React.FC<LogicQueryBuilderProps> = ({
  expression,
  onChangeExpression,
  onSelectPreset,
  evaluationError,
  shadedRegions,
  onClear,
}) => {
  const handleAppend = (sym: string) => {
    playButtonClickSound();
    onChangeExpression(expression + sym);
  };

  const handleBackspace = () => {
    playButtonClickSound();
    if (expression.length > 0) {
      onChangeExpression(expression.slice(0, -1));
    }
  };

  const keys = [
    { label: 'A', value: 'A', style: 'bg-blue-600/30 text-blue-300 border-blue-500/40 hover:bg-blue-600/50' },
    { label: 'B', value: 'B', style: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/50' },
    { label: 'C', value: 'C', style: 'bg-amber-600/30 text-amber-300 border-amber-500/40 hover:bg-amber-600/50' },
    { label: '𝕌', value: 'U', style: 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600' },
    { label: '∪ (Union)', value: ' ∪ ', style: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/50' },
    { label: '∩ (Intersect)', value: ' ∩ ', style: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/50' },
    { label: "′ (Compl.)", value: "'", style: 'bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600/50' },
    { label: '∖ (Diff)', value: ' - ', style: 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600' },
    { label: 'Δ (SymDiff)', value: ' Δ ', style: 'bg-pink-600/30 text-pink-300 border-pink-500/40 hover:bg-pink-600/50' },
    { label: '(', value: '(', style: 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' },
    { label: ')', value: ')', style: 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' },
  ];

  return (
    <div className="w-full flex flex-col gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl select-none">
      {/* Expression Input & KaTeX Preview */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> Symbolic Set Query
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Regions: [{shadedRegions.join(', ') || '∅'}]
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            id="logic-expression-input"
            type="text"
            value={expression}
            onChange={(e) => onChangeExpression(e.target.value)}
            placeholder="e.g. (A ∪ B)' ∩ C or click symbols below..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-300 font-mono text-sm sm:text-base font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {expression && (
            <button
              onClick={() => {
                playButtonClickSound();
                onClear();
              }}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clear expression"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live LaTeX Formulation Render */}
        <div className="flex items-center justify-between min-h-[32px] px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
          <div className="text-slate-400 font-mono text-[11px]">LaTeX:</div>
          <div className="text-white font-serif overflow-x-auto no-scrollbar whitespace-nowrap text-xs sm:text-sm pl-2">
            <MathView math={formatRegionsToLatex(shadedRegions)} />
          </div>
        </div>

        {evaluationError && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs bg-red-950/40 border border-red-800/60 px-3 py-1.5 rounded-xl font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{evaluationError}</span>
          </div>
        )}
      </div>

      {/* Interactive Symbol Keypad */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {keys.map((k) => (
          <button
            key={k.label}
            onClick={() => handleAppend(k.value)}
            className={`py-2 px-1 rounded-xl font-bold text-xs sm:text-sm border transition transform active:scale-95 shadow-sm ${k.style}`}
          >
            {k.label}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="col-span-1 py-2 px-1 rounded-xl font-bold text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 flex items-center justify-center transition active:scale-95"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Expression Chips Bar */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-800/70">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Standard Set Presets:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs whitespace-nowrap">
          {EXPRESSION_PRESETS.map((p) => {
            const isCurrent = expression.trim() === p.expression.trim();
            return (
              <button
                key={p.id}
                onClick={() => {
                  playButtonClickSound();
                  onSelectPreset(p);
                }}
                className={`px-2.5 py-1 rounded-xl border text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={p.description}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
