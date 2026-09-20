/**
 * Set Theory & De Morgan Studio Help Guide Modal
 * Comprehensive pedagogical reference on 3-Set Venn Regions, De Morgan's Laws, and PIE.
 */

import React from 'react';
import { VENN_REGIONS } from '../utils/setLogic';
import { MathView } from './MathView';
import { HelpCircle, BookOpen, Layers, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="help-guide-card"
        className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                SIR EUGENE TECHNOLOGIES
              </div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Set Logic & De Morgan Study Guide <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* Section 1: The 8 Disjoint Venn Regions */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> The 8 Disjoint Elementary Venn Regions
            </h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              In any 3-set Venn diagram with sets <MathView math="A, B, C" /> inside a universal set <MathView math="\mathbb{U}" />, exactly <strong className="text-white">8 mutually disjoint regions</strong> are formed:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VENN_REGIONS.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl flex items-start gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 text-white"
                    style={{ backgroundColor: r.color }}
                  >
                    r{r.id}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{r.name}</div>
                    <div className="font-mono text-amber-300 text-[11px] my-0.5">
                      <MathView math={r.latex} />
                    </div>
                    <div className="text-[11px] text-slate-400">{r.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: De Morgan's Fundamental Laws */}
          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> De Morgan's Laws of Set Algebra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-800/70 border border-indigo-500/30 p-4 rounded-2xl">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  1. Complement of a Union
                </div>
                <div className="font-serif text-base text-amber-300 my-2">
                  <MathView math="(A \cup B \cup C)^c = A^c \cap B^c \cap C^c" block />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Elements outside the union belong to the intersection of the individual complements."
                </p>
              </div>

              <div className="bg-slate-800/70 border border-indigo-500/30 p-4 rounded-2xl">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  2. Complement of an Intersection
                </div>
                <div className="font-serif text-base text-amber-300 my-2">
                  <MathView math="(A \cap B \cap C)^c = A^c \cup B^c \cup C^c" block />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Elements not in the common triple intersection belong to at least one complement."
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Principle of Inclusion-Exclusion (PIE) */}
          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Principle of Inclusion-Exclusion (PIE)
            </h3>
            <div className="bg-slate-800/70 border border-emerald-500/30 p-4 rounded-2xl">
              <p className="text-xs text-slate-300 mb-2">
                For three arbitrary finite sets <MathView math="A, B, C" />:
              </p>
              <div className="font-serif text-sm sm:text-base text-emerald-300 my-2 overflow-x-auto">
                <MathView
                  math="n(A \cup B \cup C) = n(A) + n(B) + n(C) - [n(A \cap B) + n(A \cap C) + n(B \cap C)] + n(A \cap B \cap C)"
                  block
                />
              </div>
              <div className="font-serif text-sm text-slate-300 my-2">
                <MathView math="n(\mathbb{U}) = n(A \cup B \cup C) + n((A \cup B \cup C)^c)" block />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition"
          >
            Got It, Back to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
