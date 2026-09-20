/**
 * Super Admin Portal Modal
 * PIN Protected (Default: 1234)
 * Searchable activity log table & one-click CSV export for instructors and teachers.
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Search,
  X,
  Users,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  KeyRound,
} from 'lucide-react';
import { ActivityLog } from '../types';
import { exportLogsToCSV, clearAllActivityLogs } from '../utils/storage';
import { playButtonClickSound, playActionToggleSound } from '../utils/audio';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
  onRefreshLogs: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({
  isOpen,
  onClose,
  logs,
  onRefreshLogs,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      playActionToggleSound();
    } else {
      setPinError(true);
    }
  };

  const handleExportCSV = () => {
    playButtonClickSound();
    const csvContent = exportLogsToCSV(logs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sir_Eugene_Venn_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all stored student activity logs?')) {
      clearAllActivityLogs();
      onRefreshLogs();
      playActionToggleSound();
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.expressionOrTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actionType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === 'ALL' || log.actionType === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, selectedFilter]);

  // Statistics
  const uniqueStudents = useMemo(() => {
    const set = new Set(logs.map((l) => l.studentId));
    return set.size;
  }, [logs]);

  const proofCount = useMemo(() => {
    return logs.filter((l) => l.actionType === 'DEMORGAN_PROOF').length;
  }, [logs]);

  return (
    <div
      id="super-admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="super-admin-modal-card"
        className="bg-slate-900 border border-slate-700/80 text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                SIR EUGENE TECHNOLOGIES
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Super Admin & Teacher Grading Portal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate (PIN: 1234) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 mb-4 border border-slate-700">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Teacher / Admin Access</h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your Instructor PIN code to inspect student session activity logs and download CSV gradebooks. (Default PIN: <strong className="text-amber-400">1234</strong>)
            </p>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter 4-digit PIN (1234)"
                  maxLength={6}
                  className={`w-full px-4 py-3 text-center text-xl tracking-[0.5em] font-mono bg-slate-800 border ${
                    pinError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  autoFocus
                />
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-semibold">
                  Invalid PIN. Please enter default PIN: 1234
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
              >
                <KeyRound className="w-4 h-4" /> Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 bg-slate-900/60 border-b border-slate-800 flex-shrink-0">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-400" /> Total Logs
                </div>
                <div className="text-lg font-black text-white">{logs.length}</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" /> Active Students
                </div>
                <div className="text-lg font-black text-emerald-400">{uniqueStudents}</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-indigo-400" /> Proofs Done
                </div>
                <div className="text-lg font-black text-indigo-400">{proofCount}</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 flex flex-col justify-center gap-1">
                <button
                  onClick={handleExportCSV}
                  disabled={logs.length === 0}
                  className="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student name, ID, or expression..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['ALL', 'EXPRESSION_EVAL', 'DEMORGAN_PROOF', 'SURVEY_SOLVE'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      selectedFilter === f
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {f === 'ALL' ? 'All Logs' : f.replace('_', ' ')}
                  </button>
                ))}

                {logs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                    title="Clear All Logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Logs Table */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No activity logs found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">Student</th>
                        <th className="p-2.5">Class / ID</th>
                        <th className="p-2.5">Action</th>
                        <th className="p-2.5">Topic / Formula</th>
                        <th className="p-2.5">Regions</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-2.5 text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap font-sans">
                            {log.studentName}
                          </td>
                          <td className="p-2.5 text-slate-400 whitespace-nowrap">{log.studentId}</td>
                          <td className="p-2.5 whitespace-nowrap font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {log.actionType}
                            </span>
                          </td>
                          <td className="p-2.5 text-amber-300 max-w-[200px] truncate">
                            {log.expressionOrTopic}
                          </td>
                          <td className="p-2.5 text-slate-300">
                            [{log.regionsShaded.join(', ')}]
                          </td>
                          <td className="p-2.5 whitespace-nowrap font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
