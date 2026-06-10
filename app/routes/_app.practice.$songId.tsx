import { useParams, Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useEffect, useRef, useState, useCallback } from "react";
import { detectPitch, frequencyToNote, getPitchAccuracy, getCorrectionTip } from "~/lib/pitch-detector";
import type { NoteInfo } from "~/lib/pitch-detector";
import { Mic, MicOff, ChevronLeft, Volume2, AlertCircle, CheckCircle2, Target } from "lucide-react";

type CorrectionNote = {
  note: string;
  cents: number;
  tip: string;
  accuracy: "on-pitch" | "slightly-off" | "wrong";
  timestamp: number;
};

const ACCURACY_COLORS = {
  "on-pitch": { bg: "#D1FAE5", text: "#065F46", bar: "#16A34A" },
  "slightly-off": { bg: "#FEF3C7", text: "#92400E", bar: "#D97706" },
  wrong: { bg: "#FEE2E2", text: "#991B1B", bar: "#DC2626" },
};

function PitchMeter({ cents, isListening }: { cents: number | null; isListening: boolean }) {
  if (!isListening || cents === null) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-300">
        <Mic size={32} className="mb-2 opacity-40" />
        <p className="text-xs">Tap Start to begin listening</p>
      </div>
    );
  }

  const accuracy = getPitchAccuracy(cents);
  const colors = ACCURACY_COLORS[accuracy];
  // Map cents (-50 to +50) to a 0-100 bar fill, centered at 50
  const normalized = Math.max(0, Math.min(100, ((cents + 50) / 100) * 100));

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ background: colors.bg, color: colors.text }}
      >
        {accuracy === "on-pitch"
          ? "On Pitch!"
          : accuracy === "slightly-off"
          ? cents < 0 ? "A little flat" : "A little sharp"
          : cents < 0 ? "Too flat" : "Too sharp"}
      </div>

      {/* Pitch bar */}
      <div className="w-full max-w-xs relative h-6 rounded-full bg-gray-100 overflow-hidden">
        {/* Centre marker */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300 z-10" />
        {/* Pitch indicator */}
        <div
          className="absolute top-1 bottom-1 w-4 rounded-full transition-all duration-100"
          style={{
            left: `calc(${normalized}% - 8px)`,
            background: colors.bar,
            boxShadow: `0 0 8px ${colors.bar}66`,
          }}
        />
      </div>

      <div className="flex justify-between w-full max-w-xs text-xs text-gray-400 px-1">
        <span>Flat</span>
        <span>Perfect</span>
        <span>Sharp</span>
      </div>
    </div>
  );
}

export default function SongPracticePage() {
  const { songId } = useParams();
  const { config, loading } = useConfigurables();
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteInfo | null>(null);
  const [corrections, setCorrections] = useState<CorrectionNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState<{ on: number; close: number; off: number }>({
    on: 0,
    close: 0,
    off: 0,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastCorrectionRef = useRef<number>(0);

  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const songs = config?.practiceSongs ?? [];
  const song = songs.find((s) => s.id === songId);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setCurrentNote(null);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);
        const freq = detectPitch(buffer, audioCtx.sampleRate);

        if (freq && freq > 60 && freq < 1500) {
          const noteInfo = frequencyToNote(freq);
          setCurrentNote(noteInfo);

          const accuracy = getPitchAccuracy(noteInfo.cents);
          setSessionScore((prev) => ({
            on: accuracy === "on-pitch" ? prev.on + 1 : prev.on,
            close: accuracy === "slightly-off" ? prev.close + 1 : prev.close,
            off: accuracy === "wrong" ? prev.off + 1 : prev.off,
          }));

          // Emit correction tip at most once per 2 seconds for wrong/slightly-off
          const now = Date.now();
          if (accuracy !== "on-pitch" && now - lastCorrectionRef.current > 2000) {
            lastCorrectionRef.current = now;
            const tip = getCorrectionTip(noteInfo.note, noteInfo.cents);
            setCorrections((prev) =>
              [
                {
                  note: noteInfo.note,
                  cents: noteInfo.cents,
                  tip,
                  accuracy,
                  timestamp: now,
                },
                ...prev,
              ].slice(0, 6),
            );
          }
        } else {
          setCurrentNote(null);
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
      setIsListening(true);
    } catch (err) {
      setError(
        "Could not access your microphone. Please allow microphone permission and try again.",
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <AlertCircle size={40} className="text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Song not found.</p>
        <Link to="/practice" className="mt-4 text-sm font-semibold" style={{ color: primary }}>
          Back to Practice
        </Link>
      </div>
    );
  }

  const totalSamples = sessionScore.on + sessionScore.close + sessionScore.off;
  const pitchPct = totalSamples > 0 ? Math.round((sessionScore.on / totalSamples) * 100) : null;

  const accuracy = currentNote ? getPitchAccuracy(currentNote.cents) : null;
  const acColors = accuracy ? ACCURACY_COLORS[accuracy] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-5 text-white flex flex-col gap-1"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #6D28D9 100%)` }}
      >
        <Link to="/practice" className="flex items-center gap-1 text-white/70 text-sm mb-2 w-fit">
          <ChevronLeft size={16} />
          Practice
        </Link>
        <h1 className="text-xl font-bold leading-tight">{song.title}</h1>
        <p className="text-white/70 text-sm">{song.show}</p>
        {song.notes && (
          <p className="text-white/50 text-xs mt-0.5 leading-snug">{song.notes}</p>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Pitch monitor card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Live Pitch Monitor</h2>
              {currentNote && (
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background: acColors?.bg ?? "#F3F4F6", color: acColors?.text ?? "#374151" }}
                >
                  <Target size={14} />
                  {currentNote.note}{currentNote.octave}
                  <span className="text-xs font-normal">
                    ({currentNote.cents >= 0 ? "+" : ""}{currentNote.cents}¢)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 pb-4">
            <PitchMeter cents={currentNote?.cents ?? null} isListening={isListening} />

            {/* Controls */}
            <div className="flex gap-3 mt-2">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-600 active:scale-95 transition-all"
                >
                  <MicOff size={18} />
                  Stop Listening
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
                  style={{ background: primary }}
                >
                  <Mic size={18} />
                  Start Listening
                </button>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 rounded-xl px-3 py-2.5">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Session score */}
        {totalSamples > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">Session Score</h3>
              {pitchPct !== null && (
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#EDE9FE", color: primary }}
                >
                  {pitchPct}% on pitch
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 text-center py-2 rounded-xl bg-green-50">
                <p className="text-lg font-bold text-green-700">{sessionScore.on}</p>
                <p className="text-xs text-green-600">On pitch</p>
              </div>
              <div className="flex-1 text-center py-2 rounded-xl bg-amber-50">
                <p className="text-lg font-bold text-amber-700">{sessionScore.close}</p>
                <p className="text-xs text-amber-600">Close</p>
              </div>
              <div className="flex-1 text-center py-2 rounded-xl bg-red-50">
                <p className="text-lg font-bold text-red-700">{sessionScore.off}</p>
                <p className="text-xs text-red-600">Off pitch</p>
              </div>
            </div>
          </div>
        )}

        {/* Coaching tips feed */}
        {corrections.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
              Coach's Notes
            </h3>
            {corrections.map((c) => {
              const cc = ACCURACY_COLORS[c.accuracy];
              return (
                <div
                  key={c.timestamp}
                  className="bg-white rounded-2xl shadow-sm p-4"
                  style={{ borderLeft: `4px solid ${cc.bar}` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {c.accuracy === "on-pitch" ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} style={{ color: cc.bar }} />
                    )}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cc.bg, color: cc.text }}
                    >
                      {c.note} — {c.cents >= 0 ? "+" : ""}{c.cents}¢{" "}
                      {c.accuracy === "slightly-off"
                        ? `(${c.cents < 0 ? "flat" : "sharp"})`
                        : c.accuracy === "wrong"
                        ? `(too ${c.cents < 0 ? "flat" : "sharp"})`
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">{c.tip}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Coaching intro if no corrections yet */}
        {corrections.length === 0 && !isListening && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-purple-300">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
              How to use this screen
            </p>
            <ol className="text-sm text-gray-600 space-y-1.5 leading-relaxed list-decimal list-inside">
              <li>Tap <strong>Start Listening</strong> and allow microphone access.</li>
              <li>Sing a phrase from the song above.</li>
              <li>Watch the pitch meter in real time — green means you are on pitch.</li>
              <li>If you go flat or sharp, your coach explains exactly how to fix it.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
