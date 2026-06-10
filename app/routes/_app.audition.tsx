import { useState } from "react";
import { Star, Calendar, Mic, CheckCircle2, Circle, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { Link } from "react-router";
import { invokeLLM } from "@qb/agentic";

type DayPlan = {
  day: string;
  focus: string;
  tasks: string[];
};

const DEFAULT_PLAN: DayPlan[] = [
  {
    day: "Day 1–2",
    focus: "Learn the melody",
    tasks: [
      "Listen to the original cast recording 3 times with lyrics in hand",
      "Identify any notes that feel uncomfortable or out of range",
      "Speak the lyrics aloud — understand every word and emotion",
    ],
  },
  {
    day: "Day 3–4",
    focus: "Pitch accuracy",
    tasks: [
      "Sing through the piece slowly, recording yourself",
      "Use the VocalRise pitch monitor on the trickiest phrases",
      "Repeat any flat/sharp phrases 5 times slowly before moving on",
    ],
  },
  {
    day: "Day 5–6",
    focus: "Breath & phrasing",
    tasks: [
      "Mark your breath points on the lyric sheet",
      "Practice each phrase on a single breath — support from the diaphragm",
      "Work on the emotional arc: where does the song build? Where does it land?",
    ],
  },
  {
    day: "Day 7–8",
    focus: "Confidence & delivery",
    tasks: [
      "Perform the whole piece standing up, as if in front of the panel",
      "Record a video — watch it back and note 1 thing to improve",
      "Practice your entrance: walk in, pause, breathe, then sing",
    ],
  },
  {
    day: "Day 9–10",
    focus: "Polish & repetition",
    tasks: [
      "Run the piece twice a day — once for technique, once for performance",
      "Share it with a friend or family member and perform for them",
      "Focus on enjoying it — confidence comes from repetition",
    ],
  },
  {
    day: "Audition Day",
    focus: "Show up & trust yourself",
    tasks: [
      "Do your full vocal warm-up — no skipping",
      "Arrive 15 minutes early so you can settle and breathe",
      "Remember: they want you to succeed. You are prepared.",
    ],
  },
];

function ReadinessBar({ score }: { score: number }) {
  const color =
    score >= 75 ? "#16A34A" : score >= 50 ? "#D97706" : "#DC2626";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 font-medium">Readiness</span>
        <span className="font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function AuditionPage() {
  const { config, loading } = useConfigurables();
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
  const auditionSong = config?.auditionSong ?? "";
  const auditionDate = config?.auditionDate ? new Date(config.auditionDate) : null;
  const practiceSongs = config?.practiceSongs ?? [];

  const auditionSongDetail = practiceSongs.find(
    (s) => s.title.toLowerCase() === auditionSong.toLowerCase(),
  );

  const daysToAudition = auditionDate
    ? Math.max(0, Math.ceil((auditionDate.getTime() - Date.now()) / 86400000))
    : null;

  const totalTasks = DEFAULT_PLAN.flatMap((d) => d.tasks).length;
  const doneTasks = checkedTasks.size;
  const readiness = Math.round((doneTasks / totalTasks) * 100);

  const toggleTask = (key: string) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleGetAIPlan = async () => {
    setAiLoading(true);
    setAiPlan(null);
    try {
      const songTitle = auditionSong || "a musical theatre song";
      const days = daysToAudition ?? 14;
      const result = await invokeLLM({
        message: `Create a personalised ${days}-day audition preparation plan for a complete singing beginner preparing to audition with "${songTitle}" for a musical theatre production. They have no prior singing experience. Give practical daily focus areas and specific tasks. Return a JSON object with key "plan" that is a string — a short, readable plain-text plan (no markdown, just numbered days or phases).`,
        schema: {
          type: "object",
          properties: { plan: { type: "string" } },
          required: ["plan"],
        },
        systemPrompt:
          "You are a warm, experienced musical theatre vocal coach. You specialize in helping complete beginners prepare for their first audition. Give practical, specific, achievable guidance.",
      });

      if (result.response && typeof (result.response as any).plan === "string") {
        setAiPlan((result.response as any).plan);
      }
    } catch {
      setAiPlan("Could not generate a plan right now. Use the standard plan below.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #D97706 0%, #EA580C 100%)` }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Star size={18} className="opacity-80" />
            <span className="text-sm font-medium opacity-80">Audition Prep</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">Audition Mode</h1>
          {auditionSong && (
            <p className="text-white/75 text-sm mt-1">{auditionSong}</p>
          )}
          {daysToAudition !== null && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
              <Calendar size={14} />
              <span className="text-sm font-semibold">
                {daysToAudition === 0
                  ? "Audition is today!"
                  : `${daysToAudition} day${daysToAudition !== 1 ? "s" : ""} until audition`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Readiness score */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <ReadinessBar score={readiness} />
          <p className="text-xs text-gray-400 mt-2">
            {doneTasks} of {totalTasks} prep tasks completed
          </p>
        </div>

        {/* Audition song detail */}
        {auditionSongDetail && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Your Audition Song
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFF7ED" }}
              >
                <Mic size={22} style={{ color: accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{auditionSongDetail.title}</p>
                <p className="text-xs text-gray-500">{auditionSongDetail.show}</p>
                {auditionSongDetail.notes && (
                  <p className="text-xs text-gray-400 mt-0.5">{auditionSongDetail.notes}</p>
                )}
              </div>
            </div>
            <Link
              to={`/practice/${auditionSongDetail.id}`}
              className="mt-3 flex items-center justify-between text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
              style={{ background: "#FFF7ED", color: accent }}
            >
              <span>Practice this song now</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {/* AI personalised plan */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Sparkles size={16} style={{ color: primary }} />
            <p className="text-sm font-semibold text-gray-800">
              Get a Personalised Plan from {coachName}
            </p>
          </div>
          <div className="p-4">
            {aiPlan ? (
              <div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {aiPlan}
                </p>
                <button
                  onClick={handleGetAIPlan}
                  className="mt-3 text-xs font-semibold"
                  style={{ color: primary }}
                >
                  Regenerate plan
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Get a day-by-day practice plan personalised for your audition song and
                  timeline — generated by your AI vocal coach.
                </p>
                <button
                  onClick={handleGetAIPlan}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: primary }}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Building your plan...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Build My Practice Plan
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Standard checklist plan */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
            Standard Audition Prep Checklist
          </h2>
          {DEFAULT_PLAN.map((phase) => (
            <div key={phase.day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div
                className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {phase.day}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{phase.focus}</p>
                </div>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                {phase.tasks.map((task, i) => {
                  const key = `${phase.day}-${i}`;
                  const done = checkedTasks.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleTask(key)}
                      className="w-full flex items-start gap-3 text-left active:scale-95 transition-all"
                    >
                      {done ? (
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={18} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <p
                        className={`text-sm leading-relaxed ${
                          done ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {task}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
