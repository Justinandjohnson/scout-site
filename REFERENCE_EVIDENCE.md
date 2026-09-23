# Reference Evidence

The site uses only the local project movie at `public/media/pinger-worlds-30s.mp4`.
The two TikTok packages are treated primarily as procedural tutorials for how to
make this class of site, not as visual assets, mood boards, or media sources.
Their metadata, captions, and contact sheets stay in the output folders and are
not copied into this app.

## Canonical Reference Paths

- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpUbmc/download/video.info.json`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpUbmc/download/video.eng-US.vtt`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpUbmc/frame_contact_sheet.jpg`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpvjXH/download/video.info.json`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpvjXH/download/video.eng-US.vtt`
- `/Users/jjohnson/Documents/ChatGPT/hackathon/outputs/tiktok-ZSqKpvjXH/frame_contact_sheet.jpg`

## Workflow Mapped Into This Environment

- Reference selection: keep tutorial captures under `outputs/` and cite them as
  process evidence. Do not import their remote media into the site.
- Asset generation: use a project-owned local movie as the current generated
  asset stand-in. Future generated clips should be dropped into
  `public/media/` only after they belong to the project.
- Reference-controlled video: encode the site around a stable local video path
  and documented duration helpers, so new clips can replace the current movie
  without changing the scroll pipeline.
- Scroll-bound background: make the local video the full-viewport background and
  bind chapter/progress state to page scroll with GSAP ScrollTrigger and Lenis.
- Minimal overlays: keep the foreground to four story beats, compact progress,
  and accessible chapter buttons rather than recreating tutorial UI chrome.
- Responsive proof: automated checks cover mobile overflow and reduced motion
  once Playwright browser binaries are installed.
- Deployment and recording: use the nested Vite build/preview flow for local
  review. This task does not deploy, publish, record, or preserve TikTok media.
