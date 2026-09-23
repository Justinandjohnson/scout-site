import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'
import {
  actTiles,
  actsLit,
  beatsRevealed,
  chatBeats,
  clamp,
  progressToTheaterChapter,
  theaterChapters,
  trainMoviePrompt,
} from './scout'

gsap.registerPlugin(ScrollTrigger)

// Base path so media resolves both locally and under the GitHub Pages subpath.
const BASE = import.meta.env.BASE_URL

// The theater plays both films back-to-back, then loops.
const FILMS = [
  { src: `${BASE}media/featured-upload-30s.mp4`, label: 'The featured film the group chat made' },
  { src: `${BASE}media/higgsfield-upload-30s.mp4`, label: 'A film the group chat made' },
  { src: `${BASE}media/midnight-train-30s.mp4`, label: 'The Midnight Train mystery the group chat made' },
  { src: `${BASE}media/pinger-worlds-30s.mp4`, label: 'The parking-garage movie the weekend crew made' },
]

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reducedMotion
}

function App() {
  const reducedMotion = useReducedMotion()

  const phoneStageRef = useRef<HTMLElement>(null)
  const theaterStageRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [phoneProgress, setPhoneProgress] = useState(0)
  const [theaterProgress, setTheaterProgress] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const [muted, setMuted] = useState(true)

  const revealed = beatsRevealed(phoneProgress)
  const lit = actsLit(phoneProgress)
  const theaterChapterIndex = progressToTheaterChapter(theaterProgress)
  const theaterChapter = theaterChapters[theaterChapterIndex]

  useEffect(() => {
    if (reducedMotion) return

    const phone = phoneStageRef.current
    const theater = theaterStageRef.current
    const video = videoRef.current
    if (!phone || !theater || !video) return

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false })
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(raf)
    }
    frame = window.requestAnimationFrame(raf)

    const phoneTrigger = ScrollTrigger.create({
      trigger: phone,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setPhoneProgress(clamp(self.progress)),
    })

    const theaterTrigger = ScrollTrigger.create({
      trigger: theater,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setTheaterProgress(clamp(self.progress))
      },
    })

    return () => {
      phoneTrigger.kill()
      theaterTrigger.kill()
      lenis.destroy()
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  // Keep the DOM muted property (React's `muted` attribute is unreliable) in sync
  // and (re)start playback whenever the film source or muted state changes. The
  // sound-toggle button is the single source of truth for `muted`; clicking it is
  // itself the user gesture that lets an unmuted play() succeed.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    video.play().catch(() => {})
  }, [muted, videoIndex, videoFailed])

  const phoneLabel = useMemo(() => `${Math.round(phoneProgress * 100)}%`, [phoneProgress])

  return (
    <main className="site">
      <a className="skip-link" href="#get-started">
        Skip to how to add Scout
      </a>

      {/* ============================ STAGE 1 — THE PHONE ============================ */}
      <section
        ref={phoneStageRef}
        className="stage stage--phone"
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
        aria-label="A group chat texts Scout and a movie builds live"
      >
        <div className="stage-lock">
          <div className="phone-copy">
            <p className="kicker">Scout · in your group chat</p>
            <h1>Your group chat just made a movie.</h1>
            <p className="lede">
              Add Scout to a group text. Everyone says what happens. Scout builds it in
              30-second clips and merges them into one movie — live, while you&rsquo;re
              still texting.
            </p>

            <div className="hero-add">
              <img
                className="hero-add-img"
                src={`${BASE}media/scout-contact-qr.png`}
                alt="QR code that adds Scout's contact to your phone"
                width={220}
                height={220}
              />
              <div className="hero-add-copy">
                <p className="kicker">Add the agent</p>
                <strong>Scan to add Scout</strong>
                <span>
                  Point your camera here — Scout drops into your contacts, ready for the
                  group chat.
                </span>
              </div>
            </div>

            <div className="film-strip" aria-label="The movie building act by act">
              {actTiles.map((tile) => (
                <div
                  key={tile.n}
                  className={`act-tile ${tile.n <= lit ? 'lit' : ''}`}
                  aria-current={tile.n === lit ? 'step' : undefined}
                >
                  <span className="act-window">{tile.window}</span>
                  <strong className="act-job">{tile.job}</strong>
                  <span className="act-cause">{tile.n <= lit ? tile.causedBy : 'waiting…'}</span>
                </div>
              ))}
            </div>
            <p className="scroll-hint" aria-hidden="true">
              scroll — the chat plays (<span data-testid="progress-value">{phoneLabel}</span>)
            </p>
          </div>

          <div
            className="phone"
            role="img"
            aria-label="A group text where the crew texts Scout a scene and Scout replies with a watch link"
          >
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-title">
              <span className="dot" aria-hidden="true" />
              Weekend Crew · 4 people
            </div>
            <div className="thread">
              {chatBeats.map((beat, i) => (
                <div
                  key={i}
                  className={`bubble bubble--${beat.author} ${i < revealed ? 'shown' : ''}`}
                >
                  <span className={`bubble-name ${beat.author === 'scout' ? 'scout' : ''}`}>
                    {beat.name}
                  </span>
                  <span className="bubble-text">{beat.text}</span>
                  {beat.link && <span className="bubble-link">scout.live/w/garage ↗</span>}
                  {beat.href && (
                    <a
                      className="bubble-link"
                      href={beat.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ▶ Watch the movie ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STAGE 2 — THE THEATER ============================ */}
      <section
        ref={theaterStageRef}
        className="stage stage--theater"
        aria-label="Watch the finished movie and learn how to add Scout"
      >
        <div className="stage-lock">
          {!videoFailed ? (
            <video
              ref={videoRef}
              className="film"
              src={FILMS[videoIndex].src}
              autoPlay
              muted={muted}
              playsInline
              preload="auto"
              aria-label={FILMS[videoIndex].label}
              onEnded={() => setVideoIndex((i) => (i + 1) % FILMS.length)}
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <div className="film-fallback" role="img" aria-label="Movie unavailable">
              <span>Movie unavailable</span>
            </div>
          )}
          <button
            type="button"
            className="sound-toggle"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
          >
            {muted ? '🔇 Sound off' : '🔊 Sound on'}
          </button>

          <article className="theater-panel" aria-live="polite">
            <p className="kicker light">The theater · scout.live</p>
            <p className="chapter-kicker">{theaterChapter.kicker}</p>
            <h2>{theaterChapter.title}</h2>
            <p>{theaterChapter.body}</p>
            <details className="prompt-reveal">
              <summary>▸ The prompt behind the train film</summary>
              <pre>{trainMoviePrompt}</pre>
            </details>
          </article>

          <nav className="theater-dots" aria-label="Movie acts">
            {theaterChapters.map((c, i) => (
              <span
                key={c.kicker}
                className={i === theaterChapterIndex ? 'active' : ''}
                aria-current={i === theaterChapterIndex ? 'step' : undefined}
              />
            ))}
          </nav>
        </div>
      </section>

      {/* ============================ FEATURE BREAKDOWN ============================ */}
      <section id="get-started" className="get-started" aria-label="How Scout works">
        <div className="get-started-main">
          <p className="kicker">Feature breakdown</p>
          <h2>How it works</h2>
          <ol className="steps">
            <li><strong>Text Scout in.</strong> Add Scout&rsquo;s number to any group message.</li>
            <li><strong>Say what happens.</strong> Everyone texts the scene and their move.</li>
            <li><strong>Scout replies once</strong> and binds a watch link — no chatter, no spam.</li>
            <li><strong>Watch it build.</strong> The theater page fills in act by act.</li>
            <li><strong>The movie lands</strong> back in the chat, made of everyone&rsquo;s texts.</li>
          </ol>
        </div>
      </section>

      {/* Reduced-motion: same message without scrub-dependent motion. */}
      <section className="reduced-fallback" aria-label="Story chapters (reduced motion)">
        <p className="kicker">The whole idea, without the motion</p>
        <div className="reduced-grid">
          <article>
            <h3>1 · The group chat</h3>
            <p>A crew texts Scout a scene. Scout replies once and binds one movie.</p>
          </article>
          <article>
            <h3>2 · Every text is a beat</h3>
            <p>Each person&rsquo;s move becomes one indispensable act of the film.</p>
          </article>
          <article>
            <h3>3 · The theater</h3>
            <p>The 30-second movie plays on a shareable page, made of everyone&rsquo;s texts.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
