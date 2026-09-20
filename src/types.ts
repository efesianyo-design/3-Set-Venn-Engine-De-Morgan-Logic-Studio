/**
 * 3-Set Venn Engine & De Morgan Logic Studio
 * Type Definitions & Interfaces
 */

export interface StudentProfile {
  fullName: string;
  level: string; // e.g. "Form 1 (Year 1 SHS)" | "Form 2 (Year 2 SHS)" | "Form 3 (Year 3 SHS)"
  classId: string; // e.g. "Form 1 Science B / House 4 / ID-102"
  avatar: string; // e.g. '🌟', '🦉', '🚀', '📐', '🧠', '🔬', '💡', '⚡'
  registeredAt: string; // ISO string
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  studentName: string;
  studentId: string;
  level: string;
  actionType:
    | 'EXPRESSION_EVAL'
    | 'DEMORGAN_PROOF'
    | 'SURVEY_SOLVE'
    | 'REGION_EXPLORE'
    | 'SESSION_START'
    | 'PRESET_SELECT'
    | string;
  expressionOrTopic: string;
  regionsShaded: number[];
  status:
    | 'COMPLETED'
    | 'VERIFIED'
    | 'SOLVED'
    | 'EVALUATED'
    | 'PROVED_EQUIVALENT'
    | 'INCOMPLETE'
    | 'SOLVED_PIE'
    | string;
  details?: string;
}

export interface VennRegionInfo {
  id: number;
  name: string;
  setNotation: string;
  latex: string;
  description: string;
  triple: [boolean, boolean, boolean]; // [inA, inB, inC]
  labelPos: { x: number; y: number };
  color: string;
}

export interface SurveyPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  setAName: string;
  setBName: string;
  setCName: string;
  totalUniversal: number;
  nA: number;
  nB: number;
  nC: number;
  nAnB: number;
  nAnC: number;
  nBnC: number;
  nAllThree: number;
  nNone: number;
  targetQuestion: string;
}

export interface DeMorganProofPreset {
  id: string;
  title: string;
  lhsRaw: string;
  lhsLatex: string;
  rhsRaw: string;
  rhsLatex: string;
  description: string;
  lawName: string;
}
