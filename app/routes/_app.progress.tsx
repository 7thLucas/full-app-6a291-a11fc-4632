import { useState, useEffect } from "react";
import {
  TrendingUp,
  Flame,
  Target,
  BookOpen,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { invokeLLM } from "@qb/agentic";

type LessonModule = {
  id: string;
  title: string;
  description: string;
  category: "breathing" | "pitch" | "tone" | "performance";
  duration: string;
  tips: string[];
};

const LESSON_MODULES: LessonModule[] = [
  {
    id: "breathing-basics",
    title: "Diaphragmatic Breathing",
    description: "The foundation of every great singer. Learn to breathe from your diaphragm, not your chest — the secret to supported, sustained notes.",
    category: "breathing",
    duration: "5 min read",
    tips: [
      "Place one hand on your belly button. When you inhale, your hand should move outward — not your chest.",
      "Practice breathing in for 4 counts, holding for 2, and releasing slowly for 8 counts.",
      "Try humming on a single note and imagine pushing the sound with your belly, not your throat.",
    ],
  },
  {
    id: "posture",
    title: "Singing Posture",
    description: "How you stand directly affects how you sound. Good posture opens your airways, frees your chest, and lets your voice resonate fully.",
    category: "breathing",
    duration: "4 min read",
    tips: [
      "Stand with feet shoulder-width apart. Feel grounded and balanced, not rigid.",
      "Lengthen through the crown of your head — imagine a string pulling you gently upward.",
      "Let your shoulders drop and back, and keep your chin level — not jutting forward.",
    ],
  },
  {
    id: "pitch-matching",
    title: "Ear Training: Matching Pitch",
    description: "Singing in tune starts with hearing the target note clearly in your mind before you sing it. This lesson builds that inner listening.",
    category: "pitch",
    duration: "6 min read",
    tips: [
      "Before singing a note, hum it internally first — let it ring in your head.",
      "Use a piano app or singing bowl. Play a note, listen, then match it with your voice.",
      "If you go flat, think brighter, not higher. Imagine your sound lifting and brightening in the front of your face.",
    ],
  },
  {
    id: "vowel-resonance",
    title: "Open Vowels & Resonance",
    description: "Singers make vowels, not consonants. This lesson teaches you to shape open, resonant vowel sounds that project and carry in a theatre.",
    category: "tone",
    duration: "5 min read",
    tips: [
      "On the vowel AH, keep your jaw relaxed and dropped — imagine holding a small egg between your back teeth.",
      "For a brighter sound, raise your soft palate (the soft roof of your mouth). Yawning helps activate this.",
      "Sing 'AH-EE-AH' slowly on one note. Notice the shift in resonance between the vowels.",
    ],
  },
  {
    id: "musical-theatre-style",
    title: "Musical Theatre Style",
    description: "Musical theatre singing is storytelling. It's different from pop or classical — the words and emotion come first, the voice serves the character.",
    category: "performance",
    duration: "7 min read",
    tips: [
      "Read the lyric aloud as an actor first. Understand exactly what your character is feeling.",
      "Speak-sing a tricky phrase before you sing it. The melody should feel like a natural extension of speech.",
      "In musical theatre, consonants are crisp and intentional. Land every final consonant — especially 'T', 'D', and 'N'.",
    ],
  },
  {
    id: "audition-confidence",
    title: "Audition Confidence & Stage Presence",
    description: "Nerves are normal. This lesson gives you tools to channel stage fright into energy, and to walk into the room already feeling prepared.",
    category: "performance",
    duration: "6 min read",
    tips: [
      "Develop a consistent pre-audition ritual — the same warm-up, the same affirmation — to signal to your nervous system that you are ready.",
      "Eye contact with the panel communicates confidence. Pick one point in the room and sing to it like it matters.",
      "If you make a mistake mid-audition, do not apologise or stop. Keep going. Panels remember how you recovered, not that you stumbled.",
    ],
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  breathing: { bg: "#E0F2FE", text: "#0369A1", badge: "#0EA5E9" },
  pitch: { bg: "#EDE9FE", text: "#6D28D9", badge: "#7C3AED" },
  tone: { bg: "#D1FAE5", text: "#065F46", badge: "#16A34A" },
  performance: { bg: "#FEF3C7", text: "#92400E", badge: "#D97706" },
};

function getStreak(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("vr_streak") ?? 0);
}

export default function ProgressPage() {
  const { config, loading } = useConfigurables();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [coachFeedback, setCoachFeedback] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const accent = config?.brandColor?.accent ?? "#EA580C";
  const coachName = config?.coachName ?? "Coach Rose";
  const auditionSong = config?.auditionSong ?? "your audition song";
  const showStreaks = config?.showProgressStreaks ?? true;

  const handleGetCoachFeedback = async () => {
    setFeedbackLoading(true);
    setCoachFeedback(null);
    try {
      const result = await invokeLLM({
        message: `The user is a complete singing beginner preparing for their first musical theatre audition. Their audition song is "${auditionSong}". They have been practicing for ${streak} days in a row. Give them 3 short, specific, encouraging coaching tips for today's practice session — focused on musical theatre technique. Keep each tip under 2 sentences. Use a warm, supportive tone. Return as a JSON object with key "tips" containing an array of 3 strings.`,
        schema: {
          type: "object",
          properties: {
            tips: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["tips"],
        },
        systemPrompt:
          "You are a warm, encouraging, and highly experienced musical theatre vocal coach. You specialise in working with complete beginners. You give specific, actionable, beginner-friendly advice.",
      });

      if (result.response && Array.isArray((result.response as any).tips)) {
        const tips = (result.response as any).tips as string[];
        setCoachFeedback(tips.join("\n\n"));
      }
    } catch {
      setCoachFeedback("Coach is unavailable right now. Try again in a moment.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const toggleLesson = (id: string) => {
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #6D28D9 100%)` }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="opacity-80" />
            <span className="text-sm font-medium opacity-80">Progress & Lessons</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">Your Progress</h1>
          <p className="text-white/75 text-sm mt-1">
            Track your journey and deepen your technique
          </p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {showStreaks && mounted && (
            <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#FFF7ED" }}
              >
                <Flame size={18} style={{ color: accent }} />
              </div>
              <p className="text-lg font-bold text-gray-900">{streak}</p>
              <p className="text-xs text-gray-400 text-center leading-tight">Day streak</p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen size={18} style={{ color: primary }} />
            </div>
            <p className="text-lg font-bold text-gray-900">{LESSON_MODULES.length}</p>
            <p className="text-xs text-gray-400 text-center leading-tight">Lessons</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#D1FAE5" }}
            >
              <Target size={18} className="text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">4</p>
            <p className="text-xs text-gray-400 text-center leading-tight">Categories</p>
          </div>
        </div>

        {/* AI Coach Tip */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Sparkles size={16} style={{ color: primary }} />
            <p className="text-sm font-semibold text-gray-800">
              Ask {coachName} for Today's Tips
            </p>
          </div>
          <div className="p-4">
            {coachFeedback ? (
              <div className="space-y-3">
                {coachFeedback.split("\n\n").map((tip, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                      style={{ background: primary }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 italic leading-relaxed">{tip}</p>
                  </div>
                ))}
                <button
                  onClick={handleGetCoachFeedback}
                  className="text-xs font-semibold mt-2"
                  style={{ color: primary }}
                >
                  Get new tips
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Get 3 personalised coaching tips for your practice session today — powered by AI
                  and tailored to your audition song.
                </p>
                <button
                  onClick={handleGetCoachFeedback}
                  disabled={feedbackLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: primary }}
                >
                  {feedbackLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Get Today's Tips
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
            Vocal Technique Lessons
          </h2>
          {LESSON_MODULES.map((lesson) => {
            const cc = CATEGORY_COLORS[lesson.category] ?? CATEGORY_COLORS.pitch;
            const isOpen = expandedLesson === lesson.id;

            return (
              <div key={lesson.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-4 text-left"
                  onClick={() => toggleLesson(lesson.id)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cc.bg }}
                  >
                    <BookOpen size={16} style={{ color: cc.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full capitalize"
                        style={{ background: cc.bg, color: cc.text }}
                      >
                        {lesson.category}
                      </span>
                      <span className="text-xs text-gray-400">{lesson.duration}</span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 rotate-90 transition-transform" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 transition-transform" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 border-t border-gray-50">
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">
                      {lesson.description}
                    </p>
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {coachName}'s Tips
                      </p>
                      {lesson.tips.map((tip, i) => (
                        <div key={i} className="flex gap-2.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                            style={{ background: cc.badge }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
