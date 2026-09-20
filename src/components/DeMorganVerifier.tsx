/**
 * Dual De Morgan Proof Verifier Mode
 * Side-by-side comparative Venn diagrams and real-time Boolean equivalence proof engine.
 */

import React, { useState, useEffect } from 'react';
import {
  DEMORGAN_PRESETS,
  DeMorganProofPreset,
  verifyDeMorganEquivalence,
} from '../utils/setLogic';
import { VennDiagram } from './VennDiagram';
import { MathView } from './MathView';
import { playProofVerifiedSound, playButtonClickSound } from '../utils/audio';
import { CheckCircle2, AlertTriangle, BookOpenCheck, ArrowRightLeft, Sparkles, X } from 'lucide-react';

interface DeMorganVerifierProps {
  isOpen: boolean;
  onClose: () => void;
  onLogProofCompletion: (lawTitle: string, isSuccess: boolean, regions: number[]) => void;
}

export const DeMorganVerifier: React.FC<DeMorganVerifierProps> = ({
  isOpen,
  onClose,
  onLogProofCompletion,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DeMorganProofPreset>(
    DEMORGAN_PRESETS[0]
  );
  const [customLhs, setCustomLhs] = useState(DEMORGAN_PRESETS[0].lhsRaw);
  const [customRhs, setCustomRhs] = useState(DEMORGAN_PRESETS[0].rhsRaw);

  const verification = verifyDeMorganEquivalence(customLhs, customRhs);

  useEffect(() => {
    if (verification.isEquivalent && isOpen) {
      playProofVerifiedSound();
      onLogProofCompletion(
        selectedPreset.title || `${customLhs} = ${customRhs}`,
        true,
        verification.lhsRegions
      );
    }
  }, [customLhs, customRhs, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: DeMorganProofPreset) => {
    playButtonClickSound();
    setSelectedPreset(preset);
    setCustomLhs(preset.lhsRaw);
    setCustomRhs(preset.rhsRaw);
  };

  return (
    <div
      id="demorgan-verifier-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="demorgan-verifier-card"
        className="bg-slate-900 border border-indigo-500/40 text-slate-100 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                SIR EUGENE TECHNOLOGIES
              </div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                De Morgan Law Proof Verifier <Sparkles className="w-4 h-4 text-amber-400" />
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

        {/* Presets Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Select Law:
          </span>
          {DEMORGAN_PRESETS.map((p) => {
            const isSelected = selectedPreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Main Proof Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4">
          {/* Active Law Description & Formula Bar */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
              {selectedPreset.lawName}
            </div>
            <div className="text-base sm:text-xl font-serif text-amber-300 font-bold py-1 overflow-x-auto">
              <MathView
                math={`\\Large ${selectedPreset.lhsLatex} \\iff ${selectedPreset.rhsLatex}`}
                block
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
              {selectedPreset.description}
            </p>
          </div>

          {/* Side-by-Side Comparative Venn Diagram Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LHS Diagram */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Left-Hand Side (LHS)
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {customLhs}
                </span>
              </div>
              <input
                type="text"
                value={customLhs}
                onChange={(e) => setCustomLhs(e.target.value)}
                className="w-full px-3 py-1.5 mb-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter LHS expression"
              />
              <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
                <VennDiagram
                  shadedRegions={verification.lhsRegions}
                  onToggleRegion={() => {}}
                  interactive={false}
                  mini={true}
                  diagramTitle="LHS Boundary Stage"
                />
              </div>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                Shaded: [{verification.lhsRegions.join(', ') || '∅'}]
              </div>
            </div>

            {/* RHS Diagram */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Right-Hand Side (RHS)
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {customRhs}
                </span>
              </div>
              <input
                type="text"
                value={customRhs}
                onChange={(e) => setCustomRhs(e.target.value)}
                className="w-full px-3 py-1.5 mb-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter RHS expression"
              />
              <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
                <VennDiagram
                  shadedRegions={verification.rhsRegions}
                  onToggleRegion={() => {}}
                  interactive={false}
                  mini={true}
                  diagramTitle="RHS Boundary Stage"
                />
              </div>
              <div className="mt-2 text-[11px] text-slate-400 font-mono">
                Shaded: [{verification.rhsRegions.join(', ') || '∅'}]
              </div>
            </div>
          </div>

          {/* Real-time Proof Equivalence Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              verification.isEquivalent
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/20'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
            }`}
          >
            {verification.isEquivalent ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            )}
            <div className="flex-1 text-xs sm:text-sm">
              {verification.isEquivalent ? (
                <div>
                  <strong className="font-extrabold text-emerald-400 text-sm block">
                    ✨ PROVED EQUIVALENT: De Morgan's Law Verified!
                  </strong>
                  Both LHS and RHS evaluate to the exact identical set of Venn regions{' '}
                  <span className="font-mono font-bold text-white">
                    [{verification.lhsRegions.join(', ') || '∅'}]
                  </span>
                  . The proof holds identically under all truth assignments.
                </div>
              ) : (
                <div>
                  <strong className="font-bold text-amber-400 block">
                    Expressions are not equivalent
                  </strong>
                  Differing regions:{' '}
                  <span className="font-mono font-bold text-white">
                    [{verification.differingRegions.join(', ')}]
                  </span>
                  . Adjust the symbolic queries to verify exact equivalence.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
