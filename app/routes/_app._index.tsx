import { Link } from "react-router";
import { Flame, Mic, BookOpen, Star, ChevronRight, Music2, Zap } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useEffect, useState } from "react";

function getDayStreak(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("vr_streak");
  const lastVisit = localStorage.getItem("vr_last_visit");
  const today = new Date().toDateString();
  if (lastVisit === today) return Number(stored ?? 0);
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastVisit === yesterday) {
    const next = Number(stored ?? 0) + 1;
    localStorage.setItem("vr_streak", String(next));
    localStorage.setItem("vr_last_visit", today);
    return next;
  }
  localStorage.setItem("vr_streak", "1");
  localStorage.setItem("vr_last_visit", today);
  return 1;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { config, loading } = useConfigurables();
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStreak(getDayStreak());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  const appName = config?.appName ?? "VocalRise";
  const tagline = config?.tagline ?? "Find Your Voice. Sing with Confidence.";
  const welcomeMessage = config?.welcomeMessage ?? "Ready to sing today?";
  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const accent = config?.brandColor?.accent ?? "#EA580C";
  const showStreaks = config?.showProgressStreaks ?? true;
  const homeCtaLabel = config?.homeCtaLabel ?? "Start Today's Warm-Up";
  const practiceCtaLabel = config?.practiceCtaLabel ?? "Practice a Song";
  const coachName = config?.coachName ?? "Coach Rose";
  const auditionSong = config?.auditionSong ?? "";
  const auditionDate = config?.auditionDate ? new Date(config.auditionDate) : null;
  const practiceSongs = config?.practiceSongs ?? [];

  const daysToAudition = auditionDate
    ? Math.max(0, Math.ceil((auditionDate.getTime() - Date.now()) / 86400000))
    : null;

  const quickActions = [
    {
      icon: Zap,
      label: homeCtaLabel,
      to: "/warmup",
      color: primary,
      bg: "#EDE9FE",
    },
    {
      icon: Mic,
      label: practiceCtaLabel,
      to: "/practice",
      color: "#EA580C",
      bg: "#FFF7ED",
    },
    {
      icon: BookOpen,
      label: "Vocal Lessons",
      to: "/progress",
      color: "#0891B2",
      bg: "#E0F2FE",
    },
    {
      icon: Star,
      label: "Audition Prep",
      to: "/audition",
      color: "#D97706",
      bg: "#FFFBEB",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #6D28D9 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 bg-white translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Music2 size={20} className="opacity-80" />
              <span className="text-sm font-medium opacity-80">{appName}</span>
            </div>
            {showStreaks && mounted && streak > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ background: accent, color: "white" }}
              >
                <Flame size={14} />
                {streak} day{streak !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-3 mb-1">
            {getGreeting()}, Tavish!
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">{welcomeMessage}</p>
          <p className="text-white/60 text-xs mt-1 italic">{tagline}</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-5">
        {/* Audition countdown */}
        {daysToAudition !== null && auditionSong && (
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "#FFFBEB", borderLeft: `4px solid ${accent}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: accent }}
            >
              <Star size={22} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                Audition Countdown
              </p>
              <p className="text-base font-bold text-gray-900 truncate">{auditionSong}</p>
              <p className="text-sm text-gray-500">
                {daysToAudition === 0
                  ? "Today is the day! Go get them!"
                  : `${daysToAudition} day${daysToAudition !== 1 ? "s" : ""} to go`}
              </p>
            </div>
            <Link to="/audition" className="text-amber-500">
              <ChevronRight size={20} />
            </Link>
          </div>
        )}

        {/* Quick actions grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, to, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md active:scale-95 transition-all duration-150"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-sm font-semibold text-gray-800 leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured songs */}
        {practiceSongs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Your Songs
              </h2>
              <Link
                to="/practice"
                className="text-xs font-semibold"
                style={{ color: primary }}
              >
                See all
              </Link>
            </div>
            <div className="space-y-2">
              {practiceSongs.slice(0, 2).map((song) => (
                <Link
                  key={song.id}
                  to={`/practice/${song.id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#EDE9FE" }}
                  >
                    <Music2 size={18} style={{ color: primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.show}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full capitalize flex-shrink-0"
                    style={{
                      background:
                        song.difficulty === "beginner"
                          ? "#D1FAE5"
                          : song.difficulty === "intermediate"
                          ? "#FEF3C7"
                          : "#FEE2E2",
                      color:
                        song.difficulty === "beginner"
                          ? "#065F46"
                          : song.difficulty === "intermediate"
                          ? "#92400E"
                          : "#991B1B",
                    }}
                  >
                    {song.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coach tip */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-purple-400">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
            {coachName} says
          </p>
          <p className="text-sm text-gray-700 italic leading-relaxed">
            "Every great singer started exactly where you are. Consistent practice — even 10 minutes
            a day — builds real muscle memory and pitch accuracy. Show up, and you will improve."
          </p>
        </div>
      </div>
    </div>
  );
}
