# VocalRise — Design Guidelines

## Colors
- **Primary:** Purple #7C3AED (Tailwind `purple-700`) — used for primary actions, active states, headers
- **Accent:** Orange #EA580C (Tailwind `orange-500`) — used for highlights, streaks, celebration moments, CTAs
- **Background:** White (#FFFFFF)
- **Surface:** Light gray (#F9FAFB / Tailwind `gray-50`) for cards and panels
- **Text:** Near-black (#111827 / Tailwind `gray-900`) for primary text; mid-gray (#6B7280 / `gray-500`) for secondary
- **Success / On-pitch:** Green (#16A34A / `green-600`)
- **Error / Off-pitch:** Red (#DC2626 / `red-600`)
- **Warning / Close:** Amber (#D97706 / `amber-600`)

## Typography
- **Headlines:** Bold, large, rounded feel — confidence-building tone
- **Body:** Clean and readable; short sentences; beginner-friendly language
- **Coaching tips:** Slightly smaller, italicized or in a distinct card style to feel like a coach speaking

## Key UI Patterns
- **Pitch meter / live feedback bar:** Central, prominent visual during practice sessions — a flowing horizontal or circular pitch indicator showing real-time note accuracy (green = on pitch, amber = slightly off, red = wrong note)
- **Note correction card:** Appears after a wrong note is detected; clean card with the note name, what went wrong, and a one-line coaching tip
- **Progress rings / streaks:** Visual and celebratory; orange accent for streaks and milestones
- **Song practice screen:** Full-screen immersive; scrolling lyrics with pitch overlay per syllable/note; model audio toggle
- **Warm-up exercises:** Step-by-step with audio cues and visual feedback

## Elevation & Depth
- Cards use subtle shadow (Tailwind `shadow-sm` to `shadow-md`)
- Active/focus states use a purple ring
- Bottom tab bar with frosted glass or white background, purple active icon

## Navigation
- **Bottom tab bar** (mobile-first): Home, Practice, Warm-Up, Progress, Audition
- **Home / Dashboard:** Daily greeting, today's warm-up, streak status, quick-start for current song
- Clean, uncluttered layouts; no more than 2-3 actions per screen

## Overall Feel
Warm, encouraging, and modern. Think "supportive coach meets clean productivity app." Not clinical or karaoke-bar. Every screen should make a nervous beginner feel capable and motivated.
