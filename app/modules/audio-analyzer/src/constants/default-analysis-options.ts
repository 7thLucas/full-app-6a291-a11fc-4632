import type { TranscriptionAnalysisOptions } from "../libs/types";

/**
 * Default analysis options for VocalRise singing practice sessions.
 * Customized for musical theatre vocal coaching context.
 */
export const defaultAnalysisOptions: TranscriptionAnalysisOptions = {
  context:
    "Singing practice session by a complete beginner learning musical theatre. Evaluate pitch accuracy, breath support, tone quality, and note clarity. Provide encouraging, beginner-friendly feedback.",
  speaker_roles: ["singer"],
  primary_role: "singer",
  default_role: "singer",
  role_display: {
    singer: "Singer",
  },
  scoring_rules: [
    {
      id: "pitch_accuracy",
      title: "Pitch Accuracy",
      rule: "Score 0-{max_score} for how accurately the singer hits the target notes. Penalize flat or sharp notes. Identify specific moments where pitch was off and suggest beginner-friendly corrections.",
      params: { max_score: "100" },
    },
    {
      id: "breath_support",
      title: "Breath Support",
      rule: "Score 0-{max_score} for breath control and support. Penalize running out of air, shaky or unsupported tone, and poor phrase shaping. Reward smooth sustained notes.",
      params: { max_score: "100" },
    },
    {
      id: "tone_clarity",
      title: "Tone & Clarity",
      rule: "Score 0-{max_score} for tone quality and lyric clarity. Reward a clear, resonant tone and intelligible words. Penalize swallowed vowels or overly tight/forced tone.",
      params: { max_score: "100" },
    },
    {
      id: "musical_expression",
      title: "Musical Expression",
      rule: "Score 0-{max_score} for musical expression, dynamics, and confidence. Reward expressive delivery and appropriate volume variation. Penalize flat, emotionless delivery.",
      params: { max_score: "100" },
    },
  ],
};
