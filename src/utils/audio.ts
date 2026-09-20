/**
 * Web Audio API Synthesizer for 3-Set Venn Engine & De Morgan Logic Studio
 * Pure client-side synthesis without external audio files.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

// Initialize or get AudioContext
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
  try {
    localStorage.setItem('venn_sound_muted', muted ? 'true' : 'false');
  } catch {
    // Ignore localStorage failures
  }
}

export function getAudioMuted(): boolean {
  try {
    const saved = localStorage.getItem('venn_sound_muted');
    if (saved !== null) {
      isMuted = saved === 'true';
    }
  } catch {
    // Ignore
  }
  return isMuted;
}

// Region Click Tone (different harmonic pitch per region 1..8)
export function playRegionClickSound(regionId: number) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const pitches: Record<number, number> = {
    1: 329.63, // E4 (Only A)
    2: 392.00, // G4 (Only B)
    3: 440.00, // A4 (Only C)
    4: 493.88, // B4 (A & B only)
    5: 523.25, // C5 (A & C only)
    6: 587.33, // D5 (B & C only)
    7: 659.25, // E5 (All Three - high harmonic)
    8: 261.63, // C4 (Outside All - deep baseline)
  };

  const freq = pitches[regionId] || 440;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

// Button Click / Symbol Operator Click
export function playButtonClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

// Avatar selection click
export function playAvatarClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

// De Morgan Law Proof Success Chime
export function playProofVerifiedSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major arpeggio)
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.01, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.2, noteTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.48);
  });
}

// Launch / Submit Celebratory Sound
export function playLaunchWorkspaceSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.01, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.22, noteTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.55);
  });
}

// Invert / Toggle Action sound
export function playActionToggleSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

// Error Blip
export function playErrorSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.setValueAtTime(180, now + 0.08);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}
