/**
 * Principle of Inclusion-Exclusion (PIE) Solver for 3-Set Survey Word Problems
 * Computes exact cardinalities for each of the 8 disjoint regions and generates LaTeX proofs.
 */

import { SurveyPreset } from '../types';

export type { SurveyPreset };

export interface PieCalculationResult {
  r1: number; // Only A
  r2: number; // Only B
  r3: number; // Only C
  r4: number; // A & B only
  r5: number; // A & C only
  r6: number; // B & C only
  r7: number; // All 3
  r8: number; // Outside all
  nUnion: number; // n(A ∪ B ∪ C)
  nUniversal: number; // n(U)
  isValid: boolean;
  validationError?: string;
  latexSteps: string[];
}

export const SURVEY_PRESETS: SurveyPreset[] = [
  {
    id: 'shs-electives',
    title: 'SHS Science Electives Enrollment',
    category: 'Academics & SHS Education',
    description: 'A survey of 120 Senior High School students regarding their elective science subject choices.',
    setAName: 'Elective Math',
    setBName: 'Physics',
    setCName: 'Chemistry',
    totalUniversal: 120,
    nA: 65,
    nB: 55,
    nC: 50,
    nAnB: 28,
    nAnC: 25,
    nBnC: 22,
    nAllThree: 12,
    nNone: 13,
    targetQuestion: 'How many students study (i) Elective Math only, (ii) Exactly two subjects, (iii) At least one subject?',
  },
  {
    id: 'src-election',
    title: 'SRC Presidential Voting Survey',
    category: 'Student Politics & Governance',
    description: 'In an SRC election exit poll of 100 students who voted on proposals by candidates Eugene, Afua, and Kwame.',
    setAName: 'Eugene (Tech)',
    setBName: 'Afua (Welfare)',
    setCName: 'Kwame (Sports)',
    totalUniversal: 100,
    nA: 48,
    nB: 45,
    nC: 40,
    nAnB: 20,
    nAnC: 18,
    nBnC: 16,
    nAllThree: 8,
    nNone: 13,
    targetQuestion: 'Determine how many voters supported candidate Eugene only, and how many supported exactly two candidates.',
  },
  {
    id: 'blood-antigens',
    title: 'Blood Antigen & Typing Immunology',
    category: 'Biology & Medical Science',
    description: 'Blood sample analysis of 200 hospital patients tested for Antigen A, Antigen B, and Rh Factor (D).',
    setAName: 'Antigen A',
    setBName: 'Antigen B',
    setCName: 'Rh Factor (+)',
    totalUniversal: 200,
    nA: 85,
    nB: 70,
    nC: 140,
    nAnB: 35,
    nAnC: 60,
    nBnC: 50,
    nAllThree: 25,
    nNone: 25,
    targetQuestion: 'Find the number of individuals with O-positive blood (Rh+ only) and AB-negative blood (A and B without Rh).',
  },
  {
    id: 'device-ownership',
    title: 'Student Digital Device Survey',
    category: 'Technology & Computing',
    description: 'Survey of 150 college students regarding personal computing hardware used for remote coursework.',
    setAName: 'Smartphone',
    setBName: 'Laptop',
    setCName: 'Tablet',
    totalUniversal: 150,
    nA: 135,
    nB: 95,
    nC: 60,
    nAnB: 85,
    nAnC: 50,
    nBnC: 40,
    nAllThree: 35,
    nNone: 0,
    targetQuestion: 'Calculate the number of students who rely solely on a smartphone, and those with all three devices.',
  },
  {
    id: 'sports-participation',
    title: 'Inter-House Sports League',
    category: 'Athletics & Extracurriculars',
    description: 'House sports coordinator survey of 80 student athletes across three discipline leagues.',
    setAName: 'Football',
    setBName: 'Basketball',
    setCName: 'Athletics (Track)',
    totalUniversal: 80,
    nA: 42,
    nB: 36,
    nC: 30,
    nAnB: 18,
    nAnC: 14,
    nBnC: 12,
    nAllThree: 6,
    nNone: 10,
    targetQuestion: 'How many athletes participate in football only, and how many participate in at least two sports?',
  },
];

/**
 * Solve for region cardinalities and generate step-by-step LaTeX derivation.
 */
export function solvePieSurvey(
  nU: number,
  nA: number,
  nB: number,
  nC: number,
  nAnB: number,
  nAnC: number,
  nBnC: number,
  nAllThree: number,
  nNone?: number
): PieCalculationResult {
  const latexSteps: string[] = [];

  // 1. Triple Intersection (Region 7)
  const r7 = nAllThree;

  // 2. Exactly Two Sets Intersections (Regions 4, 5, 6)
  const r4 = nAnB - r7; // A & B only
  const r5 = nAnC - r7; // A & C only
  const r6 = nBnC - r7; // B & C only

  // 3. Exactly One Set (Regions 1, 2, 3)
  const r1 = nA - (r4 + r5 + r7); // Only A
  const r2 = nB - (r4 + r6 + r7); // Only B
  const r3 = nC - (r5 + r6 + r7); // Only C

  // 4. Union n(A ∪ B ∪ C)
  const nUnion = r1 + r2 + r3 + r4 + r5 + r6 + r7;

  // 5. Outside (Region 8)
  const calculatedNone = nNone !== undefined ? nNone : Math.max(0, nU - nUnion);
  const r8 = calculatedNone;

  // Check validity
  let isValid = true;
  let validationError: string | undefined;

  if (r1 < 0 || r2 < 0 || r3 < 0 || r4 < 0 || r5 < 0 || r6 < 0 || r7 < 0 || r8 < 0) {
    isValid = false;
    validationError = 'Mathematical contradiction: One or more region cardinalities evaluates to a negative number. Please check the intersection values.';
  } else if (nUnion + r8 !== nU) {
    // If nNone was forced manually and doesn't match
    if (nNone !== undefined && nUnion + nNone !== nU) {
      isValid = false;
      validationError = `Discrepancy: Union (${nUnion}) + None (${nNone}) = ${nUnion + nNone}, which does not equal Universal Total n(U) = ${nU}.`;
    }
  }

  // Generate Step-by-Step LaTeX explanations
  latexSteps.push(`\\textbf{Step 1: Identify the Triple Intersection (Central Core)}`);
  latexSteps.push(`n(A \\cap B \\cap C) = r_7 = ${r7}`);

  latexSteps.push(`\\textbf{Step 2: Calculate Two-Set Exclusive Overlaps}`);
  latexSteps.push(`n(A \\cap B \\text{ only}) = n(A \\cap B) - n(A \\cap B \\cap C) = ${nAnB} - ${r7} = ${r4}`);
  latexSteps.push(`n(A \\cap C \\text{ only}) = n(A \\cap C) - n(A \\cap B \\cap C) = ${nAnC} - ${r7} = ${r5}`);
  latexSteps.push(`n(B \\cap C \\text{ only}) = n(B \\cap C) - n(A \\cap B \\cap C) = ${nBnC} - ${r7} = ${r6}`);

  latexSteps.push(`\\textbf{Step 3: Calculate Strictly Single-Set Regions}`);
  latexSteps.push(`n(\\text{Only } A) = n(A) - (r_4 + r_5 + r_7) = ${nA} - (${r4} + ${r5} + ${r7}) = ${r1}`);
  latexSteps.push(`n(\\text{Only } B) = n(B) - (r_4 + r_6 + r_7) = ${nB} - (${r4} + ${r6} + ${r7}) = ${r2}`);
  latexSteps.push(`n(\\text{Only } C) = n(C) - (r_5 + r_6 + r_7) = ${nC} - (${r5} + ${r6} + ${r7}) = ${r3}`);

  latexSteps.push(`\\textbf{Step 4: Total Union by Principle of Inclusion-Exclusion (PIE)}`);
  latexSteps.push(`n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - [n(A \\cap B) + n(A \\cap C) + n(B \\cap C)] + n(A \\cap B \\cap C)`);
  latexSteps.push(`= ${nA} + ${nB} + ${nC} - [${nAnB} + ${nAnC} + ${nBnC}] + ${r7} = ${nUnion}`);

  latexSteps.push(`\\textbf{Step 5: Complement Region (Outside all three)}`);
  latexSteps.push(`n((A \\cup B \\cup C)^c) = n(\\mathbb{U}) - n(A \\cup B \\cup C) = ${nU} - ${nUnion} = ${r8}`);

  return {
    r1,
    r2,
    r3,
    r4,
    r5,
    r6,
    r7,
    r8,
    nUnion,
    nUniversal: nU,
    isValid,
    validationError,
    latexSteps,
  };
}
