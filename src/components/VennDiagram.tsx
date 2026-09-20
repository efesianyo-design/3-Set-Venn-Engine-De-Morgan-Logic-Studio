/**
 * Interactive 3-Set Venn Diagram Stage (SVG Engine)
 * High-performance 60 FPS vector renderer with 8 distinct shadeable regions,
 * gesture/button zoom & pan, cardinalities display, and instant sound feedback.
 */

import React, { useState, useRef } from 'react';
import { VENN_REGIONS } from '../utils/setLogic';
import { playRegionClickSound } from '../utils/audio';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface VennDiagramProps {
  shadedRegions: number[];
  onToggleRegion: (regionId: number) => void;
  regionValues?: Record<number, number | string>; // Custom cardinality numbers e.g. from Survey Solver
  setAName?: string;
  setBName?: string;
  setCName?: string;
  showLabels?: 'numbers' | 'formulas' | 'values' | 'none';
  interactive?: boolean;
  mini?: boolean; // For De Morgan side-by-side comparison
  diagramTitle?: string;
  highlightDifference?: boolean;
  differingRegions?: number[];
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({
  shadedRegions,
  onToggleRegion,
  regionValues,
  setAName = 'Set A',
  setBName = 'Set B',
  setCName = 'Set C',
  showLabels = 'numbers',
  interactive = true,
  mini = false,
  diagramTitle,
  highlightDifference = false,
  differingRegions = [],
  zoomLevel: controlledZoom,
  onZoomChange,
}) => {
  const [internalZoom, setInternalZoom] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoom = controlledZoom !== undefined ? controlledZoom : internalZoom;
  const setZoom = (z: number) => {
    const clamped = Math.max(0.7, Math.min(2.0, z));
    if (onZoomChange) onZoomChange(clamped);
    else setInternalZoom(clamped);
  };

  const idPrefix = mini ? 'mini_' + (diagramTitle?.replace(/\s+/g, '_') || 'diag') : 'main_venn';

  const handleRegionClick = (regionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;
    playRegionClickSound(regionId);
    onToggleRegion(regionId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${
        mini ? 'p-1' : 'p-2 sm:p-4'
      }`}
    >
      {/* Title Header if in comparative/mini mode */}
      {diagramTitle && (
        <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800 mb-2">
          <span className="font-bold text-xs sm:text-sm text-amber-300 font-mono">
            {diagramTitle}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {shadedRegions.length} shaded
          </span>
        </div>
      )}

      {/* SVG Venn Stage Container */}
      <div
        className="relative w-full max-w-full flex items-center justify-center transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <svg
          id={`${idPrefix}_svg`}
          viewBox="0 0 600 500"
          className="w-full h-auto max-h-[70vh] sm:max-h-[62vh] object-contain drop-shadow-xl overflow-visible"
        >
          <defs>
            {/* Circle Clipping Paths */}
            <clipPath id={`${idPrefix}_clip_A`}>
              <circle cx="230" cy="210" r="145" />
            </clipPath>
            <clipPath id={`${idPrefix}_clip_B`}>
              <circle cx="370" cy="210" r="145" />
            </clipPath>
            <clipPath id={`${idPrefix}_clip_C`}>
              <circle cx="300" cy="320" r="145" />
            </clipPath>

            {/* Region 1: Only A (A - B - C) */}
            <mask id={`${idPrefix}_mask_r1`}>
              <circle cx="230" cy="210" r="145" fill="#ffffff" />
              <circle cx="370" cy="210" r="145" fill="#000000" />
              <circle cx="300" cy="320" r="145" fill="#000000" />
            </mask>

            {/* Region 2: Only B (B - A - C) */}
            <mask id={`${idPrefix}_mask_r2`}>
              <circle cx="370" cy="210" r="145" fill="#ffffff" />
              <circle cx="230" cy="210" r="145" fill="#000000" />
              <circle cx="300" cy="320" r="145" fill="#000000" />
            </mask>

            {/* Region 3: Only C (C - A - B) */}
            <mask id={`${idPrefix}_mask_r3`}>
              <circle cx="300" cy="320" r="145" fill="#ffffff" />
              <circle cx="230" cy="210" r="145" fill="#000000" />
              <circle cx="370" cy="210" r="145" fill="#000000" />
            </mask>

            {/* Region 4: A and B only ((A ∩ B) - C) */}
            <mask id={`${idPrefix}_mask_r4`}>
              <circle cx="230" cy="210" r="145" fill="#ffffff" clipPath={`url(#${idPrefix}_clip_B)`} />
              <circle cx="300" cy="320" r="145" fill="#000000" />
            </mask>

            {/* Region 5: A and C only ((A ∩ C) - B) */}
            <mask id={`${idPrefix}_mask_r5`}>
              <circle cx="230" cy="210" r="145" fill="#ffffff" clipPath={`url(#${idPrefix}_clip_C)`} />
              <circle cx="370" cy="210" r="145" fill="#000000" />
            </mask>

            {/* Region 6: B and C only ((B ∩ C) - A) */}
            <mask id={`${idPrefix}_mask_r6`}>
              <circle cx="370" cy="210" r="145" fill="#ffffff" clipPath={`url(#${idPrefix}_clip_C)`} />
              <circle cx="230" cy="210" r="145" fill="#000000" />
            </mask>

            {/* Region 7: All Three (A ∩ B ∩ C) */}
            <mask id={`${idPrefix}_mask_r7`}>
              <g clipPath={`url(#${idPrefix}_clip_B)`}>
                <circle cx="230" cy="210" r="145" fill="#ffffff" clipPath={`url(#${idPrefix}_clip_C)`} />
              </g>
            </mask>

            {/* Region 8: Outside all three (Universal - (A ∪ B ∪ C)) */}
            <mask id={`${idPrefix}_mask_r8`}>
              <rect x="0" y="0" width="600" height="500" fill="#ffffff" />
              <circle cx="230" cy="210" r="145" fill="#000000" />
              <circle cx="370" cy="210" r="145" fill="#000000" />
              <circle cx="300" cy="320" r="145" fill="#000000" />
            </mask>

            {/* Linear and Radial Gradients for Shaded Visual Aesthetics */}
            <radialGradient id={`${idPrefix}_grad_blue`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_green`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_amber`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_purple`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_cyan`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_pink`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_rose`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8" />
            </radialGradient>
            <radialGradient id={`${idPrefix}_grad_slate`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.55" />
            </radialGradient>

            {/* Pattern for Diff Highlighting if proof comparison */}
            <pattern id={`${idPrefix}_diff_pat`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="3" />
            </pattern>
          </defs>

          {/* Universal Set Rectangle Background */}
          <rect
            x="5"
            y="5"
            width="590"
            height="490"
            rx="24"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="3"
            className="transition-colors"
          />

          {/* Universal Set Label (top left) */}
          <g transform="translate(25, 38)">
            <rect x="-10" y="-18" width="54" height="26" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text
              x="17"
              y="0"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="16"
              fontWeight="900"
              fontFamily="KaTeX_Main, Georgia, serif"
            >
              𝕌
            </text>
          </g>

          {/* 8 Disjoint Rendered Regions (Background / Shaded Layer) */}
          {VENN_REGIONS.map((region) => {
            const isShaded = shadedRegions.includes(region.id);
            const isHovered = hoveredRegion === region.id;
            const isDiff = highlightDifference && differingRegions.includes(region.id);

            let fillColor = 'transparent';
            if (isDiff) {
              fillColor = `url(#${idPrefix}_diff_pat)`;
            } else if (isShaded) {
              const gradMap: Record<number, string> = {
                1: `url(#${idPrefix}_grad_blue)`,
                2: `url(#${idPrefix}_grad_green)`,
                3: `url(#${idPrefix}_grad_amber)`,
                4: `url(#${idPrefix}_grad_purple)`,
                5: `url(#${idPrefix}_grad_cyan)`,
                6: `url(#${idPrefix}_grad_pink)`,
                7: `url(#${idPrefix}_grad_rose)`,
                8: `url(#${idPrefix}_grad_slate)`,
              };
              fillColor = gradMap[region.id] || region.color;
            } else if (isHovered && interactive) {
              fillColor = 'rgba(255, 255, 255, 0.12)';
            }

            return (
              <rect
                key={region.id}
                id={`region_${region.id}`}
                x="0"
                y="0"
                width="600"
                height="500"
                mask={`url(#${idPrefix}_mask_r${region.id})`}
                fill={fillColor}
                onClick={(e) => handleRegionClick(region.id, e)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`transition-all duration-150 ${
                  interactive ? 'cursor-pointer' : ''
                }`}
              />
            );
          })}

          {/* Circle Outlines and Decorative Bounds */}
          {/* Set A Circle */}
          <circle
            cx="230"
            cy="210"
            r="145"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeDasharray="none"
            className="pointer-events-none opacity-90"
          />
          {/* Set B Circle */}
          <circle
            cx="370"
            cy="210"
            r="145"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            className="pointer-events-none opacity-90"
          />
          {/* Set C Circle */}
          <circle
            cx="300"
            cy="320"
            r="145"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            className="pointer-events-none opacity-90"
          />

          {/* Main Set Labels (Outside circle headers) */}
          {/* Set A Label */}
          <g transform="translate(130, 85)" className="pointer-events-none">
            <rect x="-65" y="-16" width="130" height="32" rx="12" fill="#1e3a8a" fillOpacity="0.9" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif">
              {setAName}
            </text>
          </g>

          {/* Set B Label */}
          <g transform="translate(470, 85)" className="pointer-events-none">
            <rect x="-65" y="-16" width="130" height="32" rx="12" fill="#064e3b" fillOpacity="0.9" stroke="#34d399" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif">
              {setBName}
            </text>
          </g>

          {/* Set C Label */}
          <g transform="translate(300, 485)" className="pointer-events-none">
            <rect x="-65" y="-16" width="130" height="32" rx="12" fill="#78350f" fillOpacity="0.9" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif">
              {setCName}
            </text>
          </g>

          {/* Centroid Interactive Badges & Cardinalities */}
          {showLabels !== 'none' &&
            VENN_REGIONS.map((region) => {
              const isShaded = shadedRegions.includes(region.id);
              const customVal = regionValues?.[region.id];
              const { x, y } = region.labelPos;

              // What text to show
              let labelText = `r${region.id}`;
              if (showLabels === 'values' && customVal !== undefined) {
                labelText = String(customVal);
              } else if (showLabels === 'formulas') {
                labelText = region.setNotation;
              } else if (customVal !== undefined && Number(customVal) > 0) {
                labelText = `${customVal}`;
              }

              return (
                <g
                  key={`label_${region.id}`}
                  transform={`translate(${x}, ${y})`}
                  onClick={(e) => handleRegionClick(region.id, e)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className={`transition-transform duration-100 ${
                    interactive ? 'cursor-pointer hover:scale-115' : ''
                  }`}
                >
                  <circle
                    r={mini ? 13 : 17}
                    fill={isShaded ? '#ffffff' : '#1e293b'}
                    stroke={isShaded ? region.color : '#475569'}
                    strokeWidth={isShaded ? 2.5 : 1.5}
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y={mini ? 4 : 5}
                    textAnchor="middle"
                    fill={isShaded ? '#0f172a' : '#f8fafc'}
                    fontSize={mini ? 10 : 12}
                    fontWeight="900"
                    fontFamily="ui-monospace, monospace"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Floating Canvas Controls (Zoom & Quick Labels) */}
      {!mini && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-700/70 p-1 rounded-2xl shadow-xl z-20">
          <button
            onClick={() => setZoom(zoom + 0.15)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(zoom - 0.15)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 text-xs font-mono font-bold"
            title="Reset Zoom"
            aria-label="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Region Tooltip Overlay */}
      {hoveredRegion && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-xl text-xs shadow-2xl flex items-center gap-2 pointer-events-none z-30 animate-in fade-in">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: VENN_REGIONS[hoveredRegion - 1].color }} />
          <span className="font-bold text-white">Region {hoveredRegion}: {VENN_REGIONS[hoveredRegion - 1].name}</span>
          <span className="font-mono text-amber-300 text-[11px]">({VENN_REGIONS[hoveredRegion - 1].setNotation})</span>
        </div>
      )}
    </div>
  );
};
