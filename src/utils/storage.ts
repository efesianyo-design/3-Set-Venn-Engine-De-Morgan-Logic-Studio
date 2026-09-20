/**
 * Local Storage Management for 3-Set Venn Engine & De Morgan Logic Studio
 * Persistent offline storage for Student Profiles & Super Admin Activity Logs.
 */

import { StudentProfile, ActivityLog } from '../types';

const PROFILE_KEY = 'venn_student_profile';
const LOGS_KEY = 'venn_activity_logs';

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch (err) {
    console.error('Error reading student profile from localStorage:', err);
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving student profile:', err);
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (err) {
    console.error('Error clearing student profile:', err);
  }
}

export function getStoredActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActivityLog[];
  } catch (err) {
    console.error('Error reading activity logs from localStorage:', err);
    return [];
  }
}

export function logStudentActivity(
  profile: StudentProfile | null,
  actionType: ActivityLog['actionType'],
  expressionOrTopic: string,
  regionsShaded: number[],
  status: ActivityLog['status'] = 'COMPLETED',
  details?: string
): void {
  try {
    const currentLogs = getStoredActivityLogs();
    const newLog: ActivityLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      studentName: profile?.fullName || 'Anonymous Scholar',
      studentId: profile?.classId || 'GUEST-001',
      level: profile?.level || 'Form 1 (Year 1 SHS)',
      actionType,
      expressionOrTopic,
      regionsShaded,
      status,
      details,
    };

    // Keep most recent 500 logs to prevent storage overflow
    const updated = [newLog, ...currentLogs].slice(0, 500);
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error logging student activity:', err);
  }
}

export function appendActivityLog(logInput: {
  studentName: string;
  studentId: string;
  studentLevel?: string;
  actionType: ActivityLog['actionType'];
  expressionOrTopic: string;
  regionsShaded: number[];
  status: ActivityLog['status'];
  details?: string;
}): ActivityLog {
  const newLog: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    studentName: logInput.studentName,
    studentId: logInput.studentId,
    level: logInput.studentLevel || 'Form 1 (Year 1 SHS)',
    actionType: logInput.actionType,
    expressionOrTopic: logInput.expressionOrTopic,
    regionsShaded: logInput.regionsShaded,
    status: logInput.status,
    details: logInput.details,
  };

  try {
    const currentLogs = getStoredActivityLogs();
    const updated = [newLog, ...currentLogs].slice(0, 500);
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error appending activity log:', err);
  }
  return newLog;
}

export const getStoredStudentProfile = getStoredProfile;
export const saveStudentProfile = saveStoredProfile;

export function clearAllActivityLogs(): void {
  try {
    localStorage.removeItem(LOGS_KEY);
  } catch (err) {
    console.error('Error clearing activity logs:', err);
  }
}


/**
 * Formats logs into clean CSV format for Super Admin grading download.
 */
export function exportLogsToCSV(logs: ActivityLog[]): string {
  const headers = ['Timestamp', 'Student Name', 'Class / House / ID', 'Level', 'Action Type', 'Expression / Topic', 'Regions Shaded', 'Status', 'Details'];
  const rows = logs.map((l) => [
    `"${l.timestamp}"`,
    `"${l.studentName.replace(/"/g, '""')}"`,
    `"${l.studentId.replace(/"/g, '""')}"`,
    `"${l.level.replace(/"/g, '""')}"`,
    `"${l.actionType}"`,
    `"${l.expressionOrTopic.replace(/"/g, '""')}"`,
    `"${l.regionsShaded.join(';')}"`,
    `"${l.status}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
