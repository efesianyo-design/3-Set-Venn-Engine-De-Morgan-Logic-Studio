/**
 * Mandatory Student Entry Modal
 * Locks workspace until completed, floating white card on backdrop-blur.
 */

import React, { useState } from 'react';
import { User, GraduationCap, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../types';
import { playAvatarClickSound, playLaunchWorkspaceSound } from '../utils/audio';

const AVATAR_OPTIONS = ['🌟', '🦉', '🚀', '📐', '🧠', '🔬', '💡', '⚡'];
const LEVEL_OPTIONS = [
  'Form 1 (Year 1 SHS)',
  'Form 2 (Year 2 SHS)',
  'Form 3 (Year 3 SHS)',
];

interface StudentGateModalProps {
  currentProfile: StudentProfile | null;
  isOpen: boolean;
  onSaveProfile: (profile: StudentProfile) => void;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const StudentGateModal: React.FC<StudentGateModalProps> = ({
  currentProfile,
  isOpen,
  onSaveProfile,
  canDismiss = false,
  onClose,
}) => {
  const [fullName, setFullName] = useState(currentProfile?.fullName || '');
  const [level, setLevel] = useState(currentProfile?.level || LEVEL_OPTIONS[0]);
  const [classId, setClassId] = useState(
    currentProfile?.classId || 'Form 1 Science B / House 4 / ID-102'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentProfile?.avatar || AVATAR_OPTIONS[0]
  );
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setValidationError('Please enter your full student name.');
      return;
    }
    if (!classId.trim()) {
      setValidationError('Please provide your class, house, or student ID.');
      return;
    }

    setValidationError('');
    playLaunchWorkspaceSound();

    const profile: StudentProfile = {
      fullName: fullName.trim(),
      level,
      classId: classId.trim(),
      avatar: selectedAvatar,
      registeredAt: currentProfile?.registeredAt || new Date().toISOString(),
    };

    onSaveProfile(profile);
  };

  const handleAvatarClick = (avatar: string) => {
    setSelectedAvatar(avatar);
    playAvatarClickSound();
  };

  return (
    <div
      id="student-entry-gate-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="student-entry-gate-card"
        className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-w-lg w-full my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Badge & Brand */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl shadow-sm flex-shrink-0 transition-transform transform hover:scale-105">
            {selectedAvatar}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              SIR EUGENE TECHNOLOGIES
            </span>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Student Studio Gate <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
          </div>
        </div>

        {/* Subtitle / Pedagogical Context */}
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          Welcome to 3-Set Venn & De Morgan Logic Studio. Enter your student credentials to log progress, evaluate symbolic set-builder queries, verify De Morgan's laws, and solve survey word problems.
        </p>

        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              FULL NAME
            </label>
            <input
              id="student-name-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Kwesi Mensah / Efua Appiah"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
              autoFocus
            />
          </div>

          {/* 2-Column Grid: Level & Class/House/ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                LEVEL
              </label>
              <select
                id="student-level-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                CLASS / HOUSE / ID
              </label>
              <input
                id="student-classid-input"
                type="text"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="e.g. Form 1 Science B / ID-102"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          {/* Avatar Picker Tray */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              CHOOSE AVATAR BADGE
            </label>
            <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = selectedAvatar === av;
                return (
                  <button
                    key={av}
                    type="button"
                    onClick={() => handleAvatarClick(av)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white scale-110 shadow-md ring-2 ring-blue-400'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                    title={`Select ${av}`}
                  >
                    {av}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              id="btn-launch-workspace"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md uppercase tracking-wider text-sm transition transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              🛡️ LAUNCH SET LOGIC WORKSPACE
            </button>
          </div>

          {canDismiss && onClose && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
              >
                Cancel & Return to Studio
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
