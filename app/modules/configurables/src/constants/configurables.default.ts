/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TPracticeSong = {
  id: string;
  title: string;
  show: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  notes: string;
};

export type TWarmUpExercise = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline: string;
  logoUrl: string;
  brandColor: TBrandColor;
  welcomeMessage: string;
  coachName: string;
  practiceSongs: TPracticeSong[];
  warmUpExercises: TWarmUpExercise[];
  auditionDate: string;
  auditionSong: string;
  showProgressStreaks: boolean;
  homeCtaLabel: string;
  practiceCtaLabel: string;
  footerText: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "VocalRise",
  tagline: "Find Your Voice. Sing with Confidence.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#7C3AED",
    secondary: "#6D28D9",
    accent: "#EA580C",
  },
  welcomeMessage: "Ready to sing today, Tavish?",
  coachName: "Coach Rose",
  practiceSongs: [
    {
      id: "song-1",
      title: "Defying Gravity",
      show: "Wicked",
      difficulty: "intermediate",
      notes: "Assigned part: ensemble. Focus on the bridge phrase starting at bar 32.",
    },
    {
      id: "song-2",
      title: "Any Dream Will Do",
      show: "Joseph and the Amazing Technicolor Dreamcoat",
      difficulty: "beginner",
      notes: "Audition piece. 1-minute cut from verse 1 to first chorus.",
    },
    {
      id: "song-3",
      title: "Somewhere",
      show: "West Side Story",
      difficulty: "beginner",
      notes: "Great for breath control practice. Slow, sustained phrases.",
    },
  ],
  warmUpExercises: [
    {
      id: "warmup-1",
      title: "Lip Trills",
      description: "Blow air through loosely closed lips in a trill. Go up and down a 5-note scale slowly. Relaxes your face and warms up breath support.",
      durationMinutes: 3,
    },
    {
      id: "warmup-2",
      title: "Humming Scale",
      description: "Hum up a major scale (do re mi fa sol) and back down. Keep the sound resonating behind your nose, not in your throat.",
      durationMinutes: 3,
    },
    {
      id: "warmup-3",
      title: "Sirens",
      description: "Glide from your lowest comfortable note to your highest and back, like a siren. This gently stretches your full range.",
      durationMinutes: 2,
    },
    {
      id: "warmup-4",
      title: "Vowel Shapes (AH-EE-OO)",
      description: "Sing the sounds AH, EE, and OO on a single note. Focus on keeping your jaw relaxed and your throat open on each vowel.",
      durationMinutes: 3,
    },
  ],
  auditionDate: "2026-06-24T10:00:00.000Z",
  auditionSong: "Any Dream Will Do",
  showProgressStreaks: true,
  homeCtaLabel: "Start Today's Warm-Up",
  practiceCtaLabel: "Practice a Song",
  footerText: "VocalRise — Your Personal Virtual Vocal Coach",
};
