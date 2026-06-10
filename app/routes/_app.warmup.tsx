import { useState } from "react";
import { Zap, CheckCircle2, Clock, ChevronDown, ChevronUp, Mic, Play } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { Link } from "react-router";

export default function WarmUpPage() {
  const { config, loading } = useConfigurables();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const exercises = config?.warmUpExercises ?? [];
  const coachName = config?.coachName ?? "Coach Rose";
  const totalMinutes = exercises.reduce((sum, e) => sum + (e.durationMinutes ?? 0), 0);
  const completedCount = exercises.filter((e) => completed.has(e.id)).length;
  const allDone = completedCount === exercises.length && exercises.length > 0;

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
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
            <Zap size={18} className="opacity-80" />
            <span className="text-sm font-medium opacity-80">Daily Warm-Up</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">Vocal Warm-Up</h1>
          <p className="text-white/75 text-sm mt-1">
            {totalMinutes} min total · {exercises.length} exercises
          </p>
          {exercises.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${(completedCount / exercises.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white/75">{completedCount}/{exercises.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Completion celebration */}
        {allDone && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "#D1FAE5", borderLeft: "4px solid #16A34A" }}
          >
            <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Warm-up complete!</p>
              <p className="text-xs text-green-600 mt-0.5">
                Your voice is ready to sing. Head to Practice to start working on your songs.
              </p>
            </div>
          </div>
        )}

        {/* Coach note */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-purple-300">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
            {coachName} says
          </p>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "Never skip your warm-up. It protects your voice from strain and helps you hit pitches
            more accurately from the very first note. Even 10 minutes makes a real difference."
          </p>
        </div>

        {/* Exercise list */}
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Zap size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No warm-up exercises configured.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
              Today's Exercises
            </h2>
            {exercises.map((exercise, idx) => {
              const isDone = completed.has(exercise.id);
              const isOpen = expanded === exercise.id;

              return (
                <div
                  key={exercise.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
                    isDone ? "opacity-70" : ""
                  }`}
                >
                  <button
                    className="w-full flex items-center gap-4 px-4 py-4 text-left"
                    onClick={() => toggleExpand(exercise.id)}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: isDone ? "#D1FAE5" : "#EDE9FE",
                        color: isDone ? "#065F46" : primary,
                      }}
                    >
                      {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${isDone ? "text-gray-400 line-through" : "text-gray-900"}`}
                      >
                        {exercise.title}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {exercise.durationMinutes} min
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-300 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-300 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed mt-3">
                        {exercise.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => toggleComplete(exercise.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                            isDone
                              ? "bg-gray-100 text-gray-500"
                              : "text-white"
                          }`}
                          style={!isDone ? { background: primary } : undefined}
                        >
                          <CheckCircle2 size={15} />
                          {isDone ? "Mark Incomplete" : "Mark Done"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA to practice */}
        {allDone && (
          <Link
            to="/practice"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-semibold active:scale-95 transition-all shadow-md"
            style={{ background: primary }}
          >
            <Mic size={18} />
            Now go practice a song!
          </Link>
        )}
      </div>
    </div>
  );
}
