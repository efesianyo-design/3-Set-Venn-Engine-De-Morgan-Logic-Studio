/**
 * 3-Set Boolean Algebra Logic Engine & Parser
 * Evaluates symbolic set-builder queries and maps them to Venn regions [1..8].
 */

import { VennRegionInfo, DeMorganProofPreset } from '../types';

export type { DeMorganProofPreset };

export const VENN_REGIONS: VennRegionInfo[] = [
  {
    id: 1,
    name: 'Only A',
    setNotation: "A ∩ B' ∩ C'",
    latex: 'A \\cap B^c \\cap C^c',
    description: 'Elements belonging strictly to Set A alone',
    triple: [true, false, false],
    labelPos: { x: 180, y: 175 },
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'Only B',
    setNotation: "B ∩ A' ∩ C'",
    latex: 'B \\cap A^c \\cap C^c',
    description: 'Elements belonging strictly to Set B alone',
    triple: [false, true, false],
    labelPos: { x: 420, y: 175 },
    color: '#10b981',
  },
  {
    id: 3,
    name: 'Only C',
    setNotation: "C ∩ A' ∩ B'",
    latex: 'C \\cap A^c \\cap B^c',
    description: 'Elements belonging strictly to Set C alone',
    triple: [false, false, true],
    labelPos: { x: 300, y: 395 },
    color: '#f59e0b',
  },
  {
    id: 4,
    name: 'A and B only',
    setNotation: "(A ∩ B) ∩ C'",
    latex: '(A \\cap B) \\cap C^c',
    description: 'Intersection of A and B, excluding Set C',
    triple: [true, true, false],
    labelPos: { x: 300, y: 155 },
    color: '#8b5cf6',
  },
  {
    id: 5,
    name: 'A and C only',
    setNotation: "(A ∩ C) ∩ B'",
    latex: '(A \\cap C) \\cap B^c',
    description: 'Intersection of A and C, excluding Set B',
    triple: [true, false, true],
    labelPos: { x: 235, y: 285 },
    color: '#06b6d4',
  },
  {
    id: 6,
    name: 'B and C only',
    setNotation: "(B ∩ C) ∩ A'",
    latex: '(B \\cap C) \\cap A^c',
    description: 'Intersection of B and C, excluding Set A',
    triple: [false, true, true],
    labelPos: { x: 365, y: 285 },
    color: '#ec4899',
  },
  {
    id: 7,
    name: 'All Three',
    setNotation: 'A ∩ B ∩ C',
    latex: 'A \\cap B \\cap C',
    description: 'Central core: elements belonging to all sets A, B, and C',
    triple: [true, true, true],
    labelPos: { x: 300, y: 245 },
    color: '#f43f5e',
  },
  {
    id: 8,
    name: 'Outside All Three',
    setNotation: "(A ∪ B ∪ C)'",
    latex: '(A \\cup B \\cup C)^c',
    description: 'Universal complement: elements outside sets A, B, and C',
    triple: [false, false, false],
    labelPos: { x: 75, y: 65 },
    color: '#64748b',
  },
];

// Presets for quick evaluation
export interface ExpressionPreset {
  id: string;
  name: string;
  expression: string;
  latex: string;
  category: string;
  description: string;
  regions: number[];
}

export const EXPRESSION_PRESETS: ExpressionPreset[] = [
  {
    id: 'set-a',
    name: 'Set A',
    expression: 'A',
    latex: 'A',
    category: 'Basic Sets',
    description: 'All elements in Set A (Regions 1, 4, 5, 7)',
    regions: [1, 4, 5, 7],
  },
  {
    id: 'set-b',
    name: 'Set B',
    expression: 'B',
    latex: 'B',
    category: 'Basic Sets',
    description: 'All elements in Set B (Regions 2, 4, 6, 7)',
    regions: [2, 4, 6, 7],
  },
  {
    id: 'set-c',
    name: 'Set C',
    expression: 'C',
    latex: 'C',
    category: 'Basic Sets',
    description: 'All elements in Set C (Regions 3, 5, 6, 7)',
    regions: [3, 5, 6, 7],
  },
  {
    id: 'union-ab',
    name: 'A ∪ B',
    expression: 'A ∪ B',
    latex: 'A \\cup B',
    category: 'Unions',
    description: 'Elements belonging to Set A or Set B or both',
    regions: [1, 2, 4, 5, 6, 7],
  },
  {
    id: 'union-abc',
    name: 'A ∪ B ∪ C',
    expression: 'A ∪ B ∪ C',
    latex: 'A \\cup B \\cup C',
    category: 'Unions',
    description: 'Total union: elements in at least one of the three sets',
    regions: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 'intersect-ab',
    name: 'A ∩ B',
    expression: 'A ∩ B',
    latex: 'A \\cap B',
    category: 'Intersections',
    description: 'Elements common to both Set A and Set B',
    regions: [4, 7],
  },
  {
    id: 'intersect-abc',
    name: 'A ∩ B ∩ C',
    expression: 'A ∩ B ∩ C',
    latex: 'A \\cap B \\cap C',
    category: 'Intersections',
    description: 'Elements common to all three sets A, B, and C (Region 7)',
    regions: [7],
  },
  {
    id: 'demorgan-lhs-3',
    name: "(A ∪ B ∪ C)'",
    expression: "(A ∪ B ∪ C)'",
    latex: '(A \\cup B \\cup C)^c',
    category: "De Morgan's Laws",
    description: 'Complement of the 3-set union (Region 8)',
    regions: [8],
  },
  {
    id: 'demorgan-rhs-3',
    name: "A' ∩ B' ∩ C'",
    expression: "A' ∩ B' ∩ C'",
    latex: "A^c \\cap B^c \\cap C^c",
    category: "De Morgan's Laws",
    description: "Intersection of complements: De Morgan dual of (A ∪ B ∪ C)'",
    regions: [8],
  },
  {
    id: 'demorgan-lhs-2',
    name: "(A ∩ B)'",
    expression: "(A ∩ B)'",
    latex: '(A \\cap B)^c',
    category: "De Morgan's Laws",
    description: 'Complement of intersection A ∩ B',
    regions: [1, 2, 3, 5, 6, 8],
  },
  {
    id: 'demorgan-rhs-2',
    name: "A' ∪ B'",
    expression: "A' ∪ B'",
    latex: "A^c \\cup B^c",
    category: "De Morgan's Laws",
    description: "Union of complements: De Morgan dual of (A ∩ B)'",
    regions: [1, 2, 3, 5, 6, 8],
  },
  {
    id: 'diff-a-bc',
    name: 'A \\ (B ∪ C)',
    expression: 'A - (B ∪ C)',
    latex: 'A \\setminus (B \\cup C)',
    category: 'Set Differences',
    description: 'Only Set A strictly (Region 1)',
    regions: [1],
  },
  {
    id: 'diff-b-ac',
    name: 'B \\ (A ∪ C)',
    expression: 'B - (A ∪ C)',
    latex: 'B \\setminus (A \\cup C)',
    category: 'Set Differences',
    description: 'Only Set B strictly (Region 2)',
    regions: [2],
  },
  {
    id: 'exactly-one',
    name: 'Exactly One Set',
    expression: "(A ∩ B' ∩ C') ∪ (B ∩ A' ∩ C') ∪ (C ∩ A' ∩ B')",
    latex: '(A \\cap B^c \\cap C^c) \\cup (B \\cap A^c \\cap C^c) \\cup (C \\cap A^c \\cap B^c)',
    category: 'Symmetric & Quantifiers',
    description: 'Elements belonging to exactly one set (Regions 1, 2, 3)',
    regions: [1, 2, 3],
  },
  {
    id: 'exactly-two',
    name: 'Exactly Two Sets',
    expression: "((A ∩ B) ∩ C') ∪ ((A ∩ C) ∩ B') ∪ ((B ∩ C) ∩ A')",
    latex: '((A \\cap B) \\cap C^c) \\cup ((A \\cap C) \\cap B^c) \\cup ((B \\cap C) \\cap A^c)',
    category: 'Symmetric & Quantifiers',
    description: 'Elements belonging to exactly two sets (Regions 4, 5, 6)',
    regions: [4, 5, 6],
  },
  {
    id: 'at-least-two',
    name: 'At Least Two Sets',
    expression: '(A ∩ B) ∪ (A ∩ C) ∪ (B ∩ C)',
    latex: '(A \\cap B) \\cup (A \\cap C) \\cup (B \\cap C)',
    category: 'Symmetric & Quantifiers',
    description: 'Elements in at least 2 sets (Regions 4, 5, 6, 7)',
    regions: [4, 5, 6, 7],
  },
  {
    id: 'symmetric-diff-ab',
    name: 'A Δ B',
    expression: '(A - B) ∪ (B - A)',
    latex: 'A \\Delta B = (A \\setminus B) \\cup (B \\setminus A)',
    category: 'Symmetric & Quantifiers',
    description: 'Symmetric difference: in A or B, but not both',
    regions: [1, 5, 2, 6],
  },
];

export const DEMORGAN_PRESETS: DeMorganProofPreset[] = [
  {
    id: 'demorgan-3set-union',
    title: 'De Morgan 3-Set Union Law',
    lawName: "De Morgan's First Law (3-Set)",
    lhsRaw: "(A ∪ B ∪ C)'",
    lhsLatex: '(A \\cup B \\cup C)^c',
    rhsRaw: "A' ∩ B' ∩ C'",
    rhsLatex: "A^c \\cap B^c \\cap C^c",
    description: 'The complement of a union equals the intersection of complements across all three sets.',
  },
  {
    id: 'demorgan-3set-intersect',
    title: 'De Morgan 3-Set Intersection Law',
    lawName: "De Morgan's Second Law (3-Set)",
    lhsRaw: "(A ∩ B ∩ C)'",
    lhsLatex: '(A \\cap B \\cap C)^c',
    rhsRaw: "A' ∪ B' ∪ C'",
    rhsLatex: "A^c \\cup B^c \\cup C^c",
    description: 'The complement of an intersection equals the union of the individual complements.',
  },
  {
    id: 'demorgan-2set-union',
    title: 'De Morgan 2-Set Union Law',
    lawName: "De Morgan's First Law (2-Set)",
    lhsRaw: "(A ∪ B)'",
    lhsLatex: '(A \\cup B)^c',
    rhsRaw: "A' ∩ B'",
    rhsLatex: "A^c \\cap B^c",
    description: 'Elements not in A or B are simultaneously outside A AND outside B.',
  },
  {
    id: 'demorgan-2set-intersect',
    title: 'De Morgan 2-Set Intersection Law',
    lawName: "De Morgan's Second Law (2-Set)",
    lhsRaw: "(A ∩ B)'",
    lhsLatex: '(A \\cap B)^c',
    rhsRaw: "A' ∪ B'",
    rhsLatex: "A^c \\cup B^c",
    description: 'Elements not in the intersection belong to either the complement of A or the complement of B.',
  },
  {
    id: 'distributive-intersect-union',
    title: 'Distributive Law (∩ over ∪)',
    lawName: 'Distributive Law of Sets',
    lhsRaw: 'A ∩ (B ∪ C)',
    lhsLatex: 'A \\cap (B \\cup C)',
    rhsRaw: '(A ∩ B) ∪ (A ∩ C)',
    rhsLatex: '(A \\cap B) \\cup (A \\cap C)',
    description: 'Intersection distributes over union: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
  },
  {
    id: 'distributive-union-intersect',
    title: 'Distributive Law (∪ over ∩)',
    lawName: 'Dual Distributive Law of Sets',
    lhsRaw: 'A ∪ (B ∩ C)',
    lhsLatex: 'A \\cup (B \\cap C)',
    rhsRaw: '(A ∪ B) ∩ (A ∪ C)',
    rhsLatex: '(A \\cup B) \\cap (A \\cup C)',
    description: 'Union distributes over intersection: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C).',
  },
  {
    id: 'absorption-law',
    title: 'Absorption Law',
    lawName: 'Absorption Identity',
    lhsRaw: 'A ∪ (A ∩ B)',
    lhsLatex: 'A \\cup (A \\cap B)',
    rhsRaw: 'A',
    rhsLatex: 'A',
    description: 'A ∪ (A ∩ B) simplifies directly back to Set A.',
  },
];

// Tokenizer & Parser for Set Expressions
type Token =
  | { type: 'VAR'; name: 'A' | 'B' | 'C' | 'U' | 'EMPTY' }
  | { type: 'UNION' }
  | { type: 'INTERSECT' }
  | { type: 'DIFF' }
  | { type: 'SYMDIFF' }
  | { type: 'COMPLEMENT' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.trim();

  while (i < s.length) {
    const ch = s[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (ch === 'A' || ch === 'a') {
      tokens.push({ type: 'VAR', name: 'A' });
      i++;
    } else if (ch === 'B' || ch === 'b') {
      tokens.push({ type: 'VAR', name: 'B' });
      i++;
    } else if (ch === 'C' || ch === 'c') {
      tokens.push({ type: 'VAR', name: 'C' });
      i++;
    } else if (ch === 'U' || ch === 'u') {
      // Check if it's U as Universal or U as Union
      // If preceded by a variable or closing paren and followed by variable or open paren, it's UNION
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.type === 'VAR' || prev.type === 'RPAREN' || prev.type === 'COMPLEMENT')) {
        tokens.push({ type: 'UNION' });
      } else {
        tokens.push({ type: 'VAR', name: 'U' });
      }
      i++;
    } else if (ch === '∪' || ch === '+' || s.startsWith('\\cup', i)) {
      tokens.push({ type: 'UNION' });
      i += s.startsWith('\\cup', i) ? 4 : 1;
    } else if (ch === '∩' || ch === '&' || ch === '*' || s.startsWith('\\cap', i)) {
      tokens.push({ type: 'INTERSECT' });
      i += s.startsWith('\\cap', i) ? 4 : 1;
    } else if (ch === '-' || ch === '\\' || s.startsWith('\\setminus', i)) {
      tokens.push({ type: 'DIFF' });
      i += s.startsWith('\\setminus', i) ? 9 : 1;
    } else if (ch === 'Δ' || ch === '^' || s.startsWith('\\Delta', i)) {
      tokens.push({ type: 'SYMDIFF' });
      i += s.startsWith('\\Delta', i) ? 6 : 1;
    } else if (ch === "'" || ch === '`' || ch === '’' || s.startsWith('^c', i) || s.startsWith('\\prime', i)) {
      tokens.push({ type: 'COMPLEMENT' });
      i += s.startsWith('^c', i) ? 2 : s.startsWith('\\prime', i) ? 6 : 1;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      tokens.push({ type: 'LPAREN' });
      i++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      tokens.push({ type: 'RPAREN' });
      i++;
    } else if (s.startsWith('∅', i) || s.startsWith('\\emptyset', i) || s.startsWith('phi', i)) {
      tokens.push({ type: 'VAR', name: 'EMPTY' });
      i += s.startsWith('\\emptyset', i) ? 8 : s.startsWith('phi', i) ? 3 : 1;
    } else {
      // Skip unknown character
      i++;
    }
  }

  return tokens;
}

// AST Nodes
type AST =
  | { type: 'VAR'; name: 'A' | 'B' | 'C' | 'U' | 'EMPTY' }
  | { type: 'UNION'; left: AST; right: AST }
  | { type: 'INTERSECT'; left: AST; right: AST }
  | { type: 'DIFF'; left: AST; right: AST }
  | { type: 'SYMDIFF'; left: AST; right: AST }
  | { type: 'COMPLEMENT'; child: AST };

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  public parse(): AST {
    if (this.tokens.length === 0) {
      return { type: 'VAR', name: 'EMPTY' };
    }
    const node = this.parseUnionSymDiff();
    return node;
  }

  // Precedence level 1: Union, Set Difference, Symmetric Difference
  private parseUnionSymDiff(): AST {
    let left = this.parseIntersect();

    while (this.peek()) {
      const tok = this.peek()!;
      if (tok.type === 'UNION') {
        this.next();
        const right = this.parseIntersect();
        left = { type: 'UNION', left, right };
      } else if (tok.type === 'DIFF') {
        this.next();
        const right = this.parseIntersect();
        left = { type: 'DIFF', left, right };
      } else if (tok.type === 'SYMDIFF') {
        this.next();
        const right = this.parseIntersect();
        left = { type: 'SYMDIFF', left, right };
      } else {
        break;
      }
    }
    return left;
  }

  // Precedence level 2: Intersection
  private parseIntersect(): AST {
    let left = this.parseComplement();

    while (this.peek()) {
      const tok = this.peek()!;
      if (tok.type === 'INTERSECT') {
        this.next();
        const right = this.parseComplement();
        left = { type: 'INTERSECT', left, right };
      } else if (
        tok.type === 'VAR' ||
        tok.type === 'LPAREN'
      ) {
        // Implicit intersection e.g., A B or A(B ∪ C)
        const right = this.parseComplement();
        left = { type: 'INTERSECT', left, right };
      } else {
        break;
      }
    }
    return left;
  }

  // Precedence level 3: Postfix Complement
  private parseComplement(): AST {
    let node = this.parsePrimary();

    while (this.peek() && this.peek()!.type === 'COMPLEMENT') {
      this.next();
      node = { type: 'COMPLEMENT', child: node };
    }
    return node;
  }

  // Primary: Variables or Parentheses
  private parsePrimary(): AST {
    const tok = this.peek();
    if (!tok) {
      return { type: 'VAR', name: 'EMPTY' };
    }

    if (tok.type === 'VAR') {
      this.next();
      return { type: 'VAR', name: tok.name };
    }

    if (tok.type === 'LPAREN') {
      this.next();
      const node = this.parseUnionSymDiff();
      if (this.peek() && this.peek()!.type === 'RPAREN') {
        this.next();
      }
      return node;
    }

    this.next();
    return { type: 'VAR', name: 'EMPTY' };
  }
}

// Evaluate AST against an elementary region's truth values (inA, inB, inC)
function evaluateAST(ast: AST, inA: boolean, inB: boolean, inC: boolean): boolean {
  switch (ast.type) {
    case 'VAR':
      if (ast.name === 'A') return inA;
      if (ast.name === 'B') return inB;
      if (ast.name === 'C') return inC;
      if (ast.name === 'U') return true;
      if (ast.name === 'EMPTY') return false;
      return false;
    case 'UNION':
      return evaluateAST(ast.left, inA, inB, inC) || evaluateAST(ast.right, inA, inB, inC);
    case 'INTERSECT':
      return evaluateAST(ast.left, inA, inB, inC) && evaluateAST(ast.right, inA, inB, inC);
    case 'DIFF':
      return evaluateAST(ast.left, inA, inB, inC) && !evaluateAST(ast.right, inA, inB, inC);
    case 'SYMDIFF': {
      const l = evaluateAST(ast.left, inA, inB, inC);
      const r = evaluateAST(ast.right, inA, inB, inC);
      return (l && !r) || (!l && r);
    }
    case 'COMPLEMENT':
      return !evaluateAST(ast.child, inA, inB, inC);
    default:
      return false;
  }
}

/**
 * Main evaluation entry: Takes any string expression and returns the list of matching region IDs (1..8).
 */
export function evaluateExpression(expression: string): {
  regions: number[];
  error: string | null;
} {
  try {
    const trimmed = expression.trim();
    if (!trimmed) {
      return { regions: [], error: null };
    }

    const tokens = tokenize(trimmed);
    if (tokens.length === 0) {
      return { regions: [], error: null };
    }

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const matchingRegions: number[] = [];
    for (const region of VENN_REGIONS) {
      const [inA, inB, inC] = region.triple;
      if (evaluateAST(ast, inA, inB, inC)) {
        matchingRegions.push(region.id);
      }
    }

    return { regions: matchingRegions, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid set expression syntax';
    return { regions: [], error: message };
  }
}

/**
 * Checks if two expressions or region sets are mathematically equivalent.
 */
export function verifyDeMorganEquivalence(
  lhsExp: string,
  rhsExp: string
): {
  isEquivalent: boolean;
  lhsRegions: number[];
  rhsRegions: number[];
  differingRegions: number[];
  lhsError: string | null;
  rhsError: string | null;
} {
  const lhsRes = evaluateExpression(lhsExp);
  const rhsRes = evaluateExpression(rhsExp);

  if (lhsRes.error || rhsRes.error) {
    return {
      isEquivalent: false,
      lhsRegions: lhsRes.regions,
      rhsRegions: rhsRes.regions,
      differingRegions: [],
      lhsError: lhsRes.error,
      rhsError: rhsRes.error,
    };
  }

  const lhsSet = new Set(lhsRes.regions);
  const rhsSet = new Set(rhsRes.regions);

  const diff: number[] = [];
  for (let i = 1; i <= 8; i++) {
    const inL = lhsSet.has(i);
    const inR = rhsSet.has(i);
    if (inL !== inR) {
      diff.push(i);
    }
  }

  return {
    isEquivalent: diff.length === 0,
    lhsRegions: lhsRes.regions,
    rhsRegions: rhsRes.regions,
    differingRegions: diff,
    lhsError: null,
    rhsError: null,
  };
}

/**
 * Generates clean LaTeX string from an array of shaded region IDs.
 */
export function formatRegionsToLatex(regions: number[]): string {
  if (regions.length === 0) return '\\emptyset';
  if (regions.length === 8) return '\\mathbb{U} \\text{ (Universal Set)}';

  const sorted = [...regions].sort((a, b) => a - b);
  const key = sorted.join(',');

  // Common recognized shapes
  const lookup: Record<string, string> = {
    '1': "A \\cap B^c \\cap C^c \\text{ (Only } A)",
    '2': "B \\cap A^c \\cap C^c \\text{ (Only } B)",
    '3': "C \\cap A^c \\cap B^c \\text{ (Only } C)",
    '4': "(A \\cap B) \\cap C^c \\text{ (} A \\cap B \\text{ only)}",
    '5': "(A \\cap C) \\cap B^c \\text{ (} A \\cap C \\text{ only)}",
    '6': "(B \\cap C) \\cap A^c \\text{ (} B \\cap C \\text{ only)}",
    '7': "A \\cap B \\cap C \\text{ (All 3)}",
    '8': "(A \\cup B \\cup C)^c \\text{ (Outside All)}",
    '1,4,5,7': "A",
    '2,4,6,7': "B",
    '3,5,6,7': "C",
    '1,2,4,5,6,7': "A \\cup B",
    '1,3,4,5,6,7': "A \\cup C",
    '2,3,4,5,6,7': "B \\cup C",
    '1,2,3,4,5,6,7': "A \\cup B \\cup C",
    '4,7': "A \\cap B",
    '5,7': "A \\cap C",
    '6,7': "B \\cap C",
    '1,2,3': "\\text{Exactly 1 Set: } (A \\text{ only}) \\cup (B \\text{ only}) \\cup (C \\text{ only})",
    '4,5,6': "\\text{Exactly 2 Sets: } (A \\cap B) \\cup (A \\cap C) \\cup (B \\cap C) \\setminus (A \\cap B \\cap C)",
    '4,5,6,7': "\\text{At least 2 Sets: } (A \\cap B) \\cup (A \\cap C) \\cup (B \\cap C)",
  };

  if (lookup[key]) {
    return lookup[key];
  }

  // Fallback composite formula
  return sorted.map((r) => VENN_REGIONS[r - 1].latex).join(' \\;\\cup\\; ');
}

export const evaluateSetExpression = evaluateExpression;

/**
 * Converts shaded region IDs into an intuitive textual expression for display.
 */
export function formatRegionsToExpression(regions: number[]): string {
  if (regions.length === 0) return '∅';
  if (regions.length === 8) return '𝕌';
  const sorted = [...regions].sort((a, b) => a - b);
  const key = sorted.join(',');

  const map: Record<string, string> = {
    '1': "A ∩ B' ∩ C' (Only A)",
    '2': "B ∩ A' ∩ C' (Only B)",
    '3': "C ∩ A' ∩ B' (Only C)",
    '4': "(A ∩ B) ∩ C'",
    '5': "(A ∩ C) ∩ B'",
    '6': "(B ∩ C) ∩ A'",
    '7': 'A ∩ B ∩ C',
    '8': "(A ∪ B ∪ C)'",
    '1,4,5,7': 'A',
    '2,4,6,7': 'B',
    '3,5,6,7': 'C',
    '1,2,4,5,6,7': 'A ∪ B',
    '1,3,4,5,6,7': 'A ∪ C',
    '2,3,4,5,6,7': 'B ∪ C',
    '1,2,3,4,5,6,7': 'A ∪ B ∪ C',
    '4,7': 'A ∩ B',
    '5,7': 'A ∩ C',
    '6,7': 'B ∩ C',
    '1,2,3': 'Exactly One Set',
    '4,5,6': 'Exactly Two Sets',
    '4,5,6,7': 'At Least Two Sets',
  };

  return map[key] || `Regions [${sorted.join(', ')}]`;
}

