/**
 * Real-time pitch detection using the Web Audio API (YIN algorithm approximation via autocorrelation).
 * Browser-only — do not import from server code.
 */

export type NoteInfo = {
  frequency: number;
  note: string;
  octave: number;
  cents: number; // deviation from exact note: negative = flat, positive = sharp
};

export type PitchAccuracy = "on-pitch" | "slightly-off" | "wrong";

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function frequencyToNote(frequency: number): NoteInfo {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const rounded = Math.round(noteNum);
  const cents = Math.round((noteNum - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor((rounded + 57) / 12);
  return {
    frequency,
    note: NOTE_STRINGS[noteIndex],
    octave,
    cents,
  };
}

export function getPitchAccuracy(cents: number): PitchAccuracy {
  const abs = Math.abs(cents);
  if (abs <= 15) return "on-pitch";
  if (abs <= 35) return "slightly-off";
  return "wrong";
}

export function getCorrectionTip(note: string, cents: number): string {
  if (Math.abs(cents) <= 15) {
    return `Great — you're right on ${note}! Keep that placement.`;
  }
  if (cents < -15) {
    const tips = [
      `That ${note} was a little flat. Try raising the back of your tongue slightly — like saying a gentle "EE" vowel shape inside.`,
      `You're singing ${note} a touch low. Imagine the note is sitting higher in your head, behind your eyes, and direct the sound there.`,
      `${note} was flat. Try brightening your vowel — open your mouth a fraction wider and keep your soft palate lifted.`,
      `That was below ${note}. Take a slightly deeper breath before the phrase and engage your core to support the pitch upward.`,
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  // cents > 15 — sharp
  const tips = [
    `That ${note} was a touch sharp. Relax your jaw and let your vowel deepen slightly — breathe into a broader sound.`,
    `You're singing ${note} a little high. Imagine the note dropping gently into your chest — let the sound be rounder and more settled.`,
    `${note} was sharp. Loosen any tension in your throat and aim for a warmer, darker tone on that syllable.`,
    `That was above ${note}. Make sure you're not pushing with too much air pressure — support from the diaphragm, not the throat.`,
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Autocorrelation-based fundamental frequency detection (YIN-inspired).
 * Returns the detected frequency in Hz, or null if no clear pitch is found.
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  const threshold = 0.2;

  // Check RMS — if signal is too quiet, return null
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null;

  // Autocorrelation
  const correlations = new Float32Array(MAX_SAMPLES);
  for (let i = 0; i < MAX_SAMPLES; i++) {
    let val = 0;
    for (let j = 0; j < MAX_SAMPLES; j++) {
      val += buffer[j] * buffer[j + i];
    }
    correlations[i] = val;
  }

  // Find first dip below threshold * correlations[0]
  let d = 0;
  while (d < MAX_SAMPLES && correlations[d] > threshold * correlations[0]) {
    d++;
  }

  // Find peak after that dip
  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < MAX_SAMPLES; i++) {
    if (correlations[i] > maxVal) {
      maxVal = correlations[i];
      maxPos = i;
    }
  }

  if (maxPos === -1 || maxVal < threshold * correlations[0]) return null;

  // Parabolic interpolation for sub-sample precision
  let T0 = maxPos;
  if (maxPos > 0 && maxPos < MAX_SAMPLES - 1) {
    const x1 = correlations[maxPos - 1];
    const x2 = correlations[maxPos];
    const x3 = correlations[maxPos + 1];
    T0 = maxPos + (x3 - x1) / (2 * (2 * x2 - x1 - x3));
  }

  return sampleRate / T0;
}
