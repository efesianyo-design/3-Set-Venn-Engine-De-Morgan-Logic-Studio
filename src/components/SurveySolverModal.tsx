/**
 * Cardinality Word Problem Solver Modal
 * Solves 3-Set Survey Problems with Step-by-Step PIE KaTeX Derivations.
 */

import React, { useState } from 'react';
import {
  SURVEY_PRESETS,
  SurveyPreset,
  solvePieSurvey,
  PieCalculationResult,
} from '../utils/pieSolver';
import { MathView } from './MathView';
import { playButtonClickSound, playActionToggleSound } from '../utils/audio';
import {
  Calculator,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';

interface SurveySolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToVenn: (
    regionValues: Record<number, number>,
    setAName: string,
    setBName: string,
    setCName: string
  ) => void;
  onLogSurveySolve: (topic: string, regionsMap: Record<number, number>) => void;
}

export const SurveySolverModal: React.FC<SurveySolverModalProps> = ({
  isOpen,
  onClose,
  onApplyToVenn,
  onLogSurveySolve,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SurveyPreset>(
    SURVEY_PRESETS[0]
  );
  const [nU, setNU] = useState(SURVEY_PRESETS[0].totalUniversal);
  const [nA, setNA] = useState(SURVEY_PRESETS[0].nA);
  const [nB, setNB] = useState(SURVEY_PRESETS[0].nB);
  const [nC, setNC] = useState(SURVEY_PRESETS[0].nC);
  const [nAnB, setNAnB] = useState(SURVEY_PRESETS[0].nAnB);
  const [nAnC, setNAnC] = useState(SURVEY_PRESETS[0].nAnC);
  const [nBnC, setNBnC] = useState(SURVEY_PRESETS[0].nBnC);
  const [nAllThree, setNAllThree] = useState(SURVEY_PRESETS[0].nAllThree);
  const [nNone, setNNone] = useState(SURVEY_PRESETS[0].nNone);
  const [setAName, setSetAName] = useState(SURVEY_PRESETS[0].setAName);
  const [setBName, setSetBName] = useState(SURVEY_PRESETS[0].setBName);
  const [setCName, setSetCName] = useState(SURVEY_PRESETS[0].setCName);

  if (!isOpen) return null;

  const result: PieCalculationResult = solvePieSurvey(
    nU,
    nA,
    nB,
    nC,
    nAnB,
    nAnC,
    nBnC,
    nAllThree,
    nNone
  );

  const handleSelectPreset = (p: SurveyPreset) => {
    playButtonClickSound();
    setSelectedPreset(p);
    setNU(p.totalUniversal);
    setNA(p.nA);
    setNB(p.nB);
    setNC(p.nC);
    setNAnB(p.nAnB);
    setNAnC(p.nAnC);
    setNBnC(p.nBnC);
    setNAllThree(p.nAllThree);
    setNNone(p.nNone);
    setSetAName(p.setAName);
    setSetBName(p.setBName);
    setSetCName(p.setCName);
  };

  const handleApplyToStage = () => {
    playActionToggleSound();
    const regionValues: Record<number, number> = {
      1: result.r1,
      2: result.r2,
      3: result.r3,
      4: result.r4,
      5: result.r5,
      6: result.r6,
      7: result.r7,
      8: result.r8,
    };
    onApplyToVenn(regionValues, setAName, setBName, setCName);
    onLogSurveySolve(selectedPreset.title, regionValues);
    onClose();
  };

  return (
    <div
      id="survey-solver-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="survey-solver-card"
        className="bg-slate-900 border border-emerald-500/40 text-slate-100 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                SIR EUGENE TECHNOLOGIES
              </div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                3-Set Cardinality Survey Solver <Sparkles className="w-4 h-4 text-amber-400" />
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
            Survey Scenarios:
          </span>
          {SURVEY_PRESETS.map((p) => {
            const isSelected = selectedPreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
          {/* Active Preset Scenario Context Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {selectedPreset.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Total n(𝕌) = {nU}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {selectedPreset.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
              {selectedPreset.description}
            </p>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 text-xs text-amber-300 font-medium">
              🎯 <strong>Exam Question:</strong> {selectedPreset.targetQuestion}
            </div>
          </div>

          {/* Survey Input Parameters Grid */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Given Cardinality Parameters</span>
              <span className="text-[11px] text-slate-500 font-normal">
                (Click to customize values)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  TOTAL n(𝕌)
                </label>
                <input
                  type="number"
                  value={nU}
                  onChange={(e) => setNU(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-blue-400 block mb-1 truncate">
                  n({setAName})
                </label>
                <input
                  type="number"
                  value={nA}
                  onChange={(e) => setNA(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-blue-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-400 block mb-1 truncate">
                  n({setBName})
                </label>
                <input
                  type="number"
                  value={nB}
                  onChange={(e) => setNB(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-400 block mb-1 truncate">
                  n({setCName})
                </label>
                <input
                  type="number"
                  value={nC}
                  onChange={(e) => setNC(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-amber-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-rose-400 block mb-1">
                  n(A ∩ B ∩ C) [r7]
                </label>
                <input
                  type="number"
                  value={nAllThree}
                  onChange={(e) => setNAllThree(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-rose-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-purple-400 block mb-1">
                  n(A ∩ B) [Total]
                </label>
                <input
                  type="number"
                  value={nAnB}
                  onChange={(e) => setNAnB(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-purple-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-cyan-400 block mb-1">
                  n(A ∩ C) [Total]
                </label>
                <input
                  type="number"
                  value={nAnC}
                  onChange={(e) => setNAnC(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-cyan-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-pink-400 block mb-1">
                  n(B ∩ C) [Total]
                </label>
                <input
                  type="number"
                  value={nBnC}
                  onChange={(e) => setNBnC(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-pink-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  n(None / Outside) [r8]
                </label>
                <input
                  type="number"
                  value={nNone}
                  onChange={(e) => setNNone(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {!result.isValid && (
            <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{result.validationError}</span>
            </div>
          )}

          {/* Solved 8-Region Cardinalities Breakdown */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              Calculated Disjoint Region Cardinalities (r1..r8)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-blue-500/30 text-center">
                <span className="text-[10px] text-blue-400 block font-bold">r1 (Only A)</span>
                <span className="text-xl font-black text-white">{result.r1}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30 text-center">
                <span className="text-[10px] text-emerald-400 block font-bold">r2 (Only B)</span>
                <span className="text-xl font-black text-white">{result.r2}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-amber-500/30 text-center">
                <span className="text-[10px] text-amber-400 block font-bold">r3 (Only C)</span>
                <span className="text-xl font-black text-white">{result.r3}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-purple-500/30 text-center">
                <span className="text-[10px] text-purple-400 block font-bold">r4 (A & B only)</span>
                <span className="text-xl font-black text-white">{result.r4}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30 text-center">
                <span className="text-[10px] text-cyan-400 block font-bold">r5 (A & C only)</span>
                <span className="text-xl font-black text-white">{result.r5}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-pink-500/30 text-center">
                <span className="text-[10px] text-pink-400 block font-bold">r6 (B & C only)</span>
                <span className="text-xl font-black text-white">{result.r6}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-rose-500/30 text-center">
                <span className="text-[10px] text-rose-400 block font-bold">r7 (All Three)</span>
                <span className="text-xl font-black text-rose-400">{result.r7}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-600 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">r8 (Outside All)</span>
                <span className="text-xl font-black text-slate-300">{result.r8}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step KaTeX Derivation */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Step-by-Step Algebraic Derivation
            </div>

            <div className="space-y-3">
              {result.latexSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-200 overflow-x-auto"
                >
                  <MathView math={step} block />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handleApplyToStage}
            disabled={!result.isValid}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" /> Apply Solution to Venn Stage <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
