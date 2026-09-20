/**
 * 3-Set Venn Engine & De Morgan Logic Studio
 * By Sir Eugene Technologies
 * Offline-First Progressive Web App (PWA) with React 18, KaTeX, and Web Audio API.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HeaderRibbon } from './components/HeaderRibbon';
import { VennDiagram } from './components/VennDiagram';
import { LogicQueryBuilder } from './components/LogicQueryBuilder';
import { SocraticCoachBar } from './components/SocraticCoachBar';
import { BottomToolbar } from './components/BottomToolbar';
import { StudentGateModal } from './components/StudentGateModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { DeMorganVerifier } from './components/DeMorganVerifier';
import { SurveySolverModal } from './components/SurveySolverModal';
import { HelpGuideModal } from './components/HelpGuideModal';

import { StudentProfile, ActivityLog } from './types';
import {
  evaluateSetExpression,
  ExpressionPreset,
  formatRegionsToExpression,
} from './utils/setLogic';
import {
  getStoredStudentProfile,
  saveStudentProfile,
  getStoredActivityLogs,
  appendActivityLog,
} from './utils/storage';

export const App: React.FC = () => {
  // Student Profile & Gate
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isGateOpen, setIsGateOpen] = useState<boolean>(true);
  const [canDismissGate, setCanDismissGate] = useState<boolean>(false);

  // Active Venn & Logic State
  const [expression, setExpression] = useState<string>('A ∪ B');
  const [shadedRegions, setShadedRegions] = useState<number[]>([1, 2, 4, 5, 6, 7]);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // Custom Survey Values & Set Names
  const [regionValues, setRegionValues] = useState<Record<number, number>>({});
  const [setAName, setSetAName] = useState<string>('Set A');
  const [setBName, setSetBName] = useState<string>('Set B');
  const [setCName, setSetCName] = useState<string>('Set C');

  // Display label mode: 'numbers' (r1..r8) | 'formulas' (A∩B..) | 'values' (custom cardinalities)
  const [labelMode, setLabelMode] = useState<'numbers' | 'formulas' | 'values'>('numbers');

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Modals visibility
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isDeMorganOpen, setIsDeMorganOpen] = useState<boolean>(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const existing = getStoredStudentProfile();
    if (existing && existing.fullName) {
      setStudentProfile(existing);
      setIsGateOpen(false);
      setCanDismissGate(true);
    } else {
      setIsGateOpen(true);
      setCanDismissGate(false);
    }
    setActivityLogs(getStoredActivityLogs());
  }, []);

  // Save student profile
  const handleSaveProfile = (profile: StudentProfile) => {
    saveStudentProfile(profile);
    setStudentProfile(profile);
    setIsGateOpen(false);
    setCanDismissGate(true);

    // Log login activity
    const newLog = appendActivityLog({
      studentName: profile.fullName,
      studentId: profile.classId,
      studentLevel: profile.level,
      actionType: 'SESSION_START',
      expressionOrTopic: 'Student Entry Gate Passed',
      regionsShaded: shadedRegions,
      status: 'VERIFIED',
    });
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Evaluate Expression input changes
  const handleExpressionChange = useCallback(
    (expr: string) => {
      setExpression(expr);
      const evalResult = evaluateSetExpression(expr);
      if (evalResult.error) {
        setEvaluationError(evalResult.error);
      } else {
        setEvaluationError(null);
        setShadedRegions(evalResult.regions);

        // Log query activity
        if (studentProfile) {
          const log = appendActivityLog({
            studentName: studentProfile.fullName,
            studentId: studentProfile.classId,
            studentLevel: studentProfile.level,
            actionType: 'EXPRESSION_EVAL',
            expressionOrTopic: expr,
            regionsShaded: evalResult.regions,
            status: 'EVALUATED',
          });
          setActivityLogs((prev) => [log, ...prev]);
        }
      }
    },
    [studentProfile]
  );

  // Select Preset Expression
  const handleSelectPreset = (preset: ExpressionPreset) => {
    setExpression(preset.expression);
    setShadedRegions(preset.regions);
    setEvaluationError(null);

    if (studentProfile) {
      const log = appendActivityLog({
        studentName: studentProfile.fullName,
        studentId: studentProfile.classId,
        studentLevel: studentProfile.level,
        actionType: 'PRESET_SELECT',
        expressionOrTopic: preset.name + ' (' + preset.expression + ')',
        regionsShaded: preset.regions,
        status: 'VERIFIED',
      });
      setActivityLogs((prev) => [log, ...prev]);
    }
  };

  // Manual Venn Region Click Toggle
  const handleToggleRegion = (regionId: number) => {
    let next: number[];
    if (shadedRegions.includes(regionId)) {
      next = shadedRegions.filter((r) => r !== regionId);
    } else {
      next = [...shadedRegions, regionId].sort((a, b) => a - b);
    }
    setShadedRegions(next);
    const repr = formatRegionsToExpression(next);
    setExpression(repr);
    setEvaluationError(null);
  };

  // Toolbar Actions
  const handleClearShading = () => {
    setShadedRegions([]);
    setExpression('∅');
    setEvaluationError(null);
  };

  const handleShadeAll = () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8];
    setShadedRegions(all);
    setExpression('𝕌');
    setEvaluationError(null);
  };

  const handleInvertSelection = () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8];
    const inverted = all.filter((r) => !shadedRegions.includes(r));
    setShadedRegions(inverted);
    setExpression(`(${expression || 'E'})'`);
    setEvaluationError(null);
  };

  // Total Cardinality Sum of shaded regions
  const totalCardinalitySum = useMemo(() => {
    return shadedRegions.reduce((sum, rId) => {
      const val = regionValues[rId];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  }, [shadedRegions, regionValues]);

  // Survey Solution Application
  const handleApplySurveyToVenn = (
    vals: Record<number, number>,
    aName: string,
    bName: string,
    cName: string
  ) => {
    setRegionValues(vals);
    setSetAName(aName);
    setSetBName(bName);
    setSetCName(cName);
    setLabelMode('values');
    // Shade all 7 internal regions by default for survey view
    setShadedRegions([1, 2, 3, 4, 5, 6, 7]);
    setExpression(`${aName} ∪ ${bName} ∪ ${cName}`);
  };

  // Log De Morgan Proof Completion
  const handleLogProof = (lawTitle: string, isSuccess: boolean, regions: number[]) => {
    if (studentProfile) {
      const log = appendActivityLog({
        studentName: studentProfile.fullName,
        studentId: studentProfile.classId,
        studentLevel: studentProfile.level,
        actionType: 'DEMORGAN_PROOF',
        expressionOrTopic: lawTitle,
        regionsShaded: regions,
        status: isSuccess ? 'PROVED_EQUIVALENT' : 'INCOMPLETE',
      });
      setActivityLogs((prev) => [log, ...prev]);
    }
  };

  // Log Survey Solve
  const handleLogSurvey = (topic: string, regionsMap: Record<number, number>) => {
    if (studentProfile) {
      const log = appendActivityLog({
        studentName: studentProfile.fullName,
        studentId: studentProfile.classId,
        studentLevel: studentProfile.level,
        actionType: 'SURVEY_SOLVE',
        expressionOrTopic: topic,
        regionsShaded: Object.keys(regionsMap).map(Number),
        status: 'SOLVED_PIE',
      });
      setActivityLogs((prev) => [log, ...prev]);
    }
  };

  return (
    <div
      id="root-studio-container"
      className="w-full h-[100dvh] min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none antialiased"
    >
      {/* Top Swipeable Header Ribbon */}
      <HeaderRibbon
        studentProfile={studentProfile}
        expression={expression}
        shadedRegionsCount={shadedRegions.length}
        totalCardinalitySum={totalCardinalitySum}
        onOpenProfile={() => setIsGateOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenDeMorganProof={() => setIsDeMorganOpen(true)}
      />

      {/* Main Interactive Stage & Logic Workbench */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 overflow-hidden p-2 sm:p-3 gap-2 sm:gap-3">
        {/* Left / Center Column: 3-Set Interactive SVG Venn Stage */}
        <section
          id="venn-stage-section"
          aria-label="Venn Diagram Canvas"
          className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-1 sm:p-3 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden shadow-inner"
        >
          <VennDiagram
            shadedRegions={shadedRegions}
            onToggleRegion={handleToggleRegion}
            regionValues={regionValues}
            setAName={setAName}
            setBName={setBName}
            setCName={setCName}
            showLabels={labelMode}
            interactive={true}
          />
        </section>

        {/* Right / Side Column: Logic Query Builder & Evaluation Panel */}
        <section
          id="logic-builder-section"
          aria-label="Logic Query Panel"
          className="w-full lg:w-[420px] flex flex-col justify-between overflow-y-auto no-scrollbar gap-2 flex-shrink-0"
        >
          <LogicQueryBuilder
            expression={expression}
            onChangeExpression={handleExpressionChange}
            onSelectPreset={handleSelectPreset}
            evaluationError={evaluationError}
            shadedRegions={shadedRegions}
            onClear={handleClearShading}
          />
        </section>
      </main>

      {/* Sir Eugene Socratic Coach Bar */}
      <SocraticCoachBar
        expression={expression}
        shadedRegions={shadedRegions}
        studentName={studentProfile?.fullName}
      />

      {/* Docked Action Strip */}
      <BottomToolbar
        onClearShading={handleClearShading}
        onShadeAll={handleShadeAll}
        onInvertSelection={handleInvertSelection}
        onOpenSurveySolver={() => setIsSurveyOpen(true)}
        onOpenDeMorgan={() => setIsDeMorganOpen(true)}
        labelMode={labelMode}
        onChangeLabelMode={setLabelMode}
        shadedCount={shadedRegions.length}
      />

      {/* Mandatory Student Entry Gate Modal */}
      <StudentGateModal
        isOpen={isGateOpen}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
        canDismiss={canDismissGate}
        onClose={() => setIsGateOpen(false)}
      />

      {/* Super Admin & Grading Portal Modal */}
      <SuperAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        logs={activityLogs}
        onRefreshLogs={() => setActivityLogs(getStoredActivityLogs())}
      />

      {/* Dual De Morgan Proof Verifier Modal */}
      <DeMorganVerifier
        isOpen={isDeMorganOpen}
        onClose={() => setIsDeMorganOpen(false)}
        onLogProofCompletion={handleLogProof}
      />

      {/* 3-Set Cardinality Survey Solver Modal */}
      <SurveySolverModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onApplyToVenn={handleApplySurveyToVenn}
        onLogSurveySolve={handleLogSurvey}
      />

      {/* Help & Pedagogical Study Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default App;
