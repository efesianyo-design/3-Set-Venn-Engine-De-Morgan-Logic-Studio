/**
 * Top Swipeable Header Ribbon
 * Compact, fast, and feature-rich navigation bar for the Venn Studio.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  HelpCircle,
  Wifi,
  WifiOff,
  User,
  Layers,
  Sparkles,
  BookOpenCheck,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { getAudioMuted, setAudioMuted, playButtonClickSound } from '../utils/audio';

interface HeaderRibbonProps {
  studentProfile: StudentProfile | null;
  expression: string;
  shadedRegionsCount: number;
  totalCardinalitySum: number;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenHelp: () => void;
  onOpenDeMorganProof: () => void;
}

export const HeaderRibbon: React.FC<HeaderRibbonProps> = ({
  studentProfile,
  expression,
  shadedRegionsCount,
  totalCardinalitySum,
  onOpenProfile,
  onOpenAdmin,
  onOpenHelp,
  onOpenDeMorganProof,
}) => {
  const [muted, setMuted] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    setMuted(getAudioMuted());
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) {
      playButtonClickSound();
    }
  };

  return (
    <header
      id="top-header-ribbon"
      className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 sm:px-4 sm:py-2.5 shadow-md flex-shrink-0 z-30 select-none"
    >
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm font-black text-sm">
            3V
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                Sir Eugene Technologies
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO PWA
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Hands-on & Visual Mathematics
            </span>
          </div>
        </div>

        {/* Compact Live Set Badge */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs flex-shrink-0">
          <div className="flex items-center gap-1 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold uppercase text-slate-300">Set:</span>
          </div>
          <span className="font-mono font-bold text-amber-300 max-w-[130px] sm:max-w-[200px] truncate">
            {expression || 'Custom Shading'}
          </span>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400">Shaded:</span>
            <span className="font-bold text-blue-400">
              {shadedRegionsCount} <span className="text-[10px] text-slate-500">/ 8</span>
            </span>
          </div>
          {totalCardinalitySum > 0 && (
            <>
              <div className="h-3 w-px bg-slate-700" />
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">n(E):</span>
                <span className="font-bold text-emerald-400">{totalCardinalitySum}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* De Morgan Quick Verifier Toggle */}
          <button
            id="btn-demorgan-proof-header"
            onClick={() => {
              playButtonClickSound();
              onOpenDeMorganProof();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition active:scale-95"
            title="Open De Morgan Proof Verifier"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">De Morgan</span> Laws
          </button>

          {/* Student Profile Button */}
          <button
            id="btn-student-profile"
            onClick={() => {
              playButtonClickSound();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition active:scale-95"
            title="Student Profile Settings"
          >
            <span className="text-sm leading-none">{studentProfile?.avatar || '🌟'}</span>
            <span className="max-w-[90px] sm:max-w-[120px] truncate font-semibold text-white">
              {studentProfile?.fullName?.split(' ')[0] || 'Student'}
            </span>
          </button>

          {/* Super Admin Portal (PIN: 1234) */}
          <button
            id="btn-super-admin"
            onClick={() => {
              playButtonClickSound();
              onOpenAdmin();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition active:scale-95"
            title="Super Admin Portal (PIN: 1234)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Offline / Online Status Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-orange-500/15 text-orange-300 border-orange-500/30 animate-pulse'
            }`}
            title={isOnline ? 'Online mode with AI Socratic Coach' : 'Classroom Offline Mode (100% functional)'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline text-[11px]">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px]">Offline</span>
              </>
            )}
          </div>

          {/* Audio Synthesizer Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
            title={muted ? 'Unmute Audio Synthesizer' : 'Mute Audio Synthesizer'}
            aria-label="Sound Toggle"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-blue-400" />
            )}
          </button>

          {/* Help & Pedagogical Guide */}
          <button
            id="btn-open-help"
            onClick={() => {
              playButtonClickSound();
              onOpenHelp();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
            title="Open Set Theory & De Morgan Guide"
            aria-label="Help Guide"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
