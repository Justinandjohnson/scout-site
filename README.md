# Cinematic Site

Local environment for building scroll-driven video sites from generated story clips.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The first screen is the cinematic scroll
experience itself.

## Build

```bash
npm run build
```

## Test

```bash
npm run test
npm run test:e2e
```

The Playwright checks run against the built preview server and expect installed
browser binaries to already be available.

## Swap The Video

Replace `public/media/pinger-worlds-30s.mp4` with another generated clip, then update the `src` in `src/App.tsx` if the filename changes.

The current prototype uses:

`../prototype-video/openrouter-h3-simulation/pinger-worlds-30s.mp4`

## Reference Workflow

The canonical reference repository for this implementation is the pair of
procedural tutorial packages in the project root:

- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpUbmc/`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpvjXH/`

Those folders retain downloaded metadata, captions, and contact sheets for the
tutorial process. They are not visual assets or mood boards for this app, and the
site does not copy, preserve, or serve their TikTok media.

The workflow translated into this environment is:

1. Select and retain tutorial references under `outputs/`.
2. Generate or provide a project-owned local video asset.
3. Put that asset at `public/media/pinger-worlds-30s.mp4` or update the app path.
4. Use it as a scroll-bound full-screen background.
5. Keep foreground overlays minimal: story chapter, progress, and accessible chapter controls.
6. Prove desktop/mobile/reduced-motion behavior with browser checks.
7. Build or preview locally before any recording or deployment step.

For future supplied reference videos, capture them through the installed
`/watch` workflow so the same output-folder contract is preserved.
