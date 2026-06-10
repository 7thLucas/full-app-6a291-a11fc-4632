import { Link } from "react-router";
import { Music2, ChevronRight, Mic, Info } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  beginner: { bg: "#D1FAE5", text: "#065F46" },
  intermediate: { bg: "#FEF3C7", text: "#92400E" },
  advanced: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function PracticePage() {
  const { config, loading } = useConfigurables();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const songs = config?.practiceSongs ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 text-white"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #6D28D9 100%)` }}
      >
        <h1 className="text-2xl font-bold">Song Practice</h1>
        <p className="text-white/75 text-sm mt-1">
          Select a song to practice with live pitch feedback
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Info card */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3">
          <Mic size={20} className="text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800 mb-0.5">How it works</p>
            <p className="text-xs text-purple-600 leading-relaxed">
              Choose a song, then sing into your microphone. The app listens in real time,
              identifies any notes that are off, and your virtual coach explains exactly how
              to fix them — in plain, beginner-friendly language.
            </p>
          </div>
        </div>

        {/* Song list */}
        {songs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Music2 size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No songs added yet.</p>
            <p className="text-xs mt-1">Add songs via the app settings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
              Your Practice Songs
            </h2>
            {songs.map((song) => {
              const dc = DIFFICULTY_COLORS[song.difficulty] ?? DIFFICULTY_COLORS.beginner;
              return (
                <Link
                  key={song.id}
                  to={`/practice/${song.id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#EDE9FE" }}
                  >
                    <Music2 size={22} style={{ color: primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.show}</p>
                    {song.notes && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{song.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: dc.bg, color: dc.text }}
                    >
                      {song.difficulty}
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Upload recording section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Or upload a recording
              </p>
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-sm text-gray-600 mb-3">
              Already recorded yourself singing? Upload the audio file to get detailed
              pitch analysis and coaching notes from your virtual coach.
            </p>
            <Link
              to="/practice/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: primary }}
            >
              <Mic size={16} />
              Analyze a Recording
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
