// Scout launch site — content + scroll math for the two pinned stages.
// Stage 1 = the phone (a real group chat texting Scout, the movie builds live).
// Stage 2 = the theater (the finished 30s film + the get-started path).

export const VIDEO_DURATION_SECONDS = 30

// The exact Seedance 2.5 prompt that produced the train film (outputs/paper-storm).
// Shown in the theater panel so viewers can see the prompt behind the movie.
export const trainMoviePrompt = `Opening context first. A dark, storm-lashed passenger train speeds through night; rain hammers the black windows and the ceiling lights flicker. The plot is simple and must read in the first 3 seconds: a ghost haunting this train car is the threat, and the physical rule of this world is that WATER destroys it and anything it makes. Establish who the hero is, what the danger is, and how it can be beaten, immediately.

Global visual style: gritty, cinematic supernatural thriller; handheld urgency, high-contrast practical lighting, cold blue night broken by warm flickering car lights, volumetric haze, rain streaks on glass, shallow depth of field, filmic grain. Photoreal live-action, not animation.

Scene and locked goal: the hero must realize water is the weapon and use it to stop the paper-plane attack before the car is overrun. Visible threat: an entity that folds paper airplanes which fly on their own, strike passengers, and burst into sparks. Dramatic question: can he reach the water in time?

Location: the interior of a single rain-soaked night train car — rows of seats, an aisle down the middle, luggage racks above, dark windows with rain, a wall-mounted water cooler / emergency water tank near the far door.

First-frame / blocking: start on the hero mid-car, one hand gripping a seat-back, staring down the aisle as a faint translucent ghost drifts toward him through flickering light; other passengers seated, uneasy.

Timed beat structure:
0-6s (setup): thunder cracks; the translucent ghost glides down the aisle toward the hero; rain and flicker establish the storm; the hero locks eyes on it — the danger is unmistakable.
6-12s (turn): the ghost hardens into a solid man and begins folding paper airplanes at impossible speed; the first planes launch and slice through the air of the car.
12-18s (escalation): paper airplanes slam into passengers and burst into sparks and flame; people scream, unbuckle, and run toward the far end of the car; the hero shields himself, searching.
18-24s (realization): a plane clips the wall-mounted water tank and fizzles to mush on the wet metal — the hero SEES it dissolve on contact with water; understanding hits his face; he lunges for the water tank.
24-30s (payoff): the hero rips the water tank free and hurls a sheet of water down the aisle; airplanes disintegrate mid-flight and the solid man recoils, steaming and softening where the water hits — the rule pays off. Final beat: one last half-folded plane trembles in the man's dissolving hand as the hero stands braced, soaked, ready. Cliffhanger.

Optics / camera / physics / lighting: 0-6s slow push-in down the aisle; 6-12s quick handheld reframe to the folding hands then a plane's flight; 12-18s whip-pans and shaky wide of the panicking car; 18-24s snap to the hero's face then a hard tilt to the water tank; 24-30s a driving low push as the water sheet crosses the frame in slow-ish motion. Practical flicker, lightning flashes through windows, sparks from bursting planes, splashing water catching light. Keep cause and effect in the same shot (plane meets water, plane dissolves).

Audio last. Generate native sound only from visible causes: heavy rain and thunder, the rhythmic clatter of train on tracks, crisp paper folds and the whoosh of flying planes, sharp popping bursts on impact, passengers shouting and running, a big water whoosh at the climax, low tense score rising into the payoff. One line of dialogue, the hero at 19-20s, urgent, low: "Water — it's water." No other speech.

Do not change the plot, the characters, the wardrobe, the water-beats-the-threat rule, the outcome, or the timing. Do not add subtitles, captions, on-screen text, logos, or watermarks.`

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

export function progressToTime(progress: number, duration = VIDEO_DURATION_SECONDS) {
  return clamp(progress) * Math.max(duration, 0)
}

// ---------------------------------------------------------------------------
// STAGE 1 — THE PHONE
// A "Weekend Crew" group texts Scout a scene. Scout replies ONCE with a watch
// link, then each person's text becomes one indispensable act beat.
// ---------------------------------------------------------------------------

export type Author = 'mara' | 'devon' | 'ty' | 'scout'

export type ChatBeat = {
  author: Author
  name: string
  text: string
  // Which act tile lights up when this beat lands (undefined = no tile change).
  act?: 1 | 2 | 3
  // Marks Scout's single binding reply that drops the watch link.
  link?: boolean
  // A real, clickable URL to the finished movie (rendered as an <a>).
  href?: string
}

export const chatBeats: ChatBeat[] = [
  {
    author: 'mara',
    name: 'Mara',
    text: "ok Scout — we're stuck in a parking garage and the elevator just died 😅",
  },
  {
    author: 'devon',
    name: 'Devon',
    text: 'make it scary. the lights keep flickering',
  },
  {
    author: 'ty',
    name: 'Ty',
    text: 'and something is moving in the stairwell',
  },
  {
    author: 'scout',
    name: 'Scout',
    text: "On it. I'll bind this to one movie so the whole group stays in sync. Watch it build → scout.live/w/garage",
    link: true,
  },
  {
    author: 'mara',
    name: 'Mara',
    text: 'I sprint for the exit ramp',
    act: 1,
  },
  {
    author: 'devon',
    name: 'Devon',
    text: 'I jam the stairwell door with a fire extinguisher',
    act: 2,
  },
  {
    author: 'ty',
    name: 'Ty',
    text: 'I hit the alarm — everyone FREEZE',
    act: 3,
  },
  {
    author: 'scout',
    name: 'Scout',
    text: '🎬 Your 30-second movie is ready. Dropped it in the chat.',
    href: 'https://d8j0ntlcm91z4.cloudfront.net/user_37r81cb52ZXe7tBiuI88i5KvIuy/hf_20260923_173833_218499cd-31d8-44d9-8e70-99550a2b06c6.mp4',
  },
  {
    author: 'devon',
    name: 'Devon',
    text: "that ending 😳 extend it — I need to see what's in the stairwell",
  },
  {
    author: 'scout',
    name: 'Scout',
    text: 'Extending from the last frame — same crew, same garage, +30 seconds. Building now → scout.live/w/garage',
    link: true,
  },
]

// Three act tiles that assemble as the crew texts their moves.
export type ActTile = {
  n: 1 | 2 | 3
  window: string
  job: string
  causedBy: string
}

export const actTiles: ActTile[] = [
  {
    n: 1,
    window: '0–10s',
    job: 'The threat + the rule',
    causedBy: "Mara's run for the ramp",
  },
  {
    n: 2,
    window: '10–20s',
    job: 'The reversal',
    causedBy: 'Devon jams the door',
  },
  {
    n: 3,
    window: '20–30s',
    job: 'The payoff + the dilemma',
    causedBy: 'Ty pulls the alarm',
  },
]

// Given stage-1 progress (0..1), how many chat beats are revealed.
export function beatsRevealed(progress: number, total = chatBeats.length) {
  const p = clamp(progress)
  // Hold the last beat fully visible for the final slice of the scroll.
  return Math.min(total, Math.floor(p * (total + 1)))
}

// Given stage-1 progress, how many act tiles have lit up (0..3).
export function actsLit(progress: number): number {
  const revealed = beatsRevealed(progress)
  return chatBeats.slice(0, revealed).filter((b) => b.act).length
}

// ---------------------------------------------------------------------------
// STAGE 2 — THE THEATER
// The finished film plays (scroll-scrubbed), with the three acts labelled, then
// the get-started path and the product-video slot.
// ---------------------------------------------------------------------------

export type TheaterChapter = {
  kicker: string
  title: string
  body: string
  time: number
}

export const theaterChapters: TheaterChapter[] = [
  {
    kicker: 'Act 01 · 0–10s',
    title: 'The garage turns against them',
    body: 'The threat and the physical rule read in the first beat — then Mara breaks for the ramp.',
    time: 0,
  },
  {
    kicker: 'Act 02 · 10–20s',
    title: 'One move flips the danger',
    body: 'Devon jams the stairwell door. The reversal is caused by a real text, not a writer.',
    time: 10,
  },
  {
    kicker: 'Act 03 · 20–30s',
    title: 'The payoff leaves a dilemma',
    body: "Ty's alarm resolves the scene and sets up the next one the group will want to text.",
    time: 22,
  },
]

export function progressToTheaterChapter(progress: number, count = theaterChapters.length) {
  const safe = Math.max(Math.floor(count), 1)
  return Math.min(safe - 1, Math.floor(clamp(progress) * safe))
}
