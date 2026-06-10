import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, Mic2 } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useTranscribe, TranscriptionUpload, TranscriptionResult } from "@qb/audio-analyzer";

export default function PracticeUploadPage() {
  const { config, loading } = useConfigurables();
  const { submit, ticketId, isSubmitting } = useTranscribe();

  const primary = config?.brandColor?.primary ?? "#7C3AED";
  const coachName = config?.coachName ?? "Coach Rose";

  const handleUpload = (file: File) => {
    submit({ files: [file] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6 text-white"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #6D28D9 100%)` }}
      >
        <Link to="/practice" className="flex items-center gap-1 text-white/70 text-sm mb-3 w-fit">
          <ChevronLeft size={16} />
          Back to Practice
        </Link>
        <h1 className="text-xl font-bold">Analyze a Recording</h1>
        <p className="text-white/75 text-sm mt-1">
          Upload a voice recording to get detailed pitch coaching from {coachName}
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Instructions */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3">
          <Mic2 size={20} className="text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-800 mb-1">What to upload</p>
            <ul className="text-xs text-purple-600 space-y-1 leading-relaxed">
              <li>• A recording of yourself singing a song part (MP3, WAV, M4A, WebM)</li>
              <li>• Keep it under 5 minutes for the best results</li>
              <li>• Record in a quiet space — background noise makes analysis less accurate</li>
            </ul>
          </div>
        </div>

        {/* Upload component */}
        {!ticketId && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <TranscriptionUpload
              isLoading={isSubmitting}
              onUpload={handleUpload}
            />
          </div>
        )}

        {/* Results */}
        {ticketId && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                {coachName}'s Analysis
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Analyzing your recording — this usually takes 20–60 seconds
              </p>
            </div>
            <div className="p-4">
              <TranscriptionResult ticketId={ticketId}>
                <TranscriptionResult.Loading />
                <TranscriptionResult.Error />
                <TranscriptionResult.Content>
                  <TranscriptionResult.Header />
                  <TranscriptionResult.Status />
                  <TranscriptionResult.Scores />
                  <TranscriptionResult.Summary />
                  <TranscriptionResult.Issues />
                  <TranscriptionResult.Strengths />
                  <TranscriptionResult.Transcript />
                </TranscriptionResult.Content>
              </TranscriptionResult>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
