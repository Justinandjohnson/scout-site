import { describe, expect, it } from 'vitest'
import {
  VIDEO_DURATION_SECONDS,
  actTiles,
  actsLit,
  beatsRevealed,
  chatBeats,
  clamp,
  progressToTheaterChapter,
  progressToTime,
  theaterChapters,
} from './scout'

describe('scout scroll math', () => {
  it('clamps progress into the accepted range', () => {
    expect(clamp(-0.2)).toBe(0)
    expect(clamp(0.42)).toBe(0.42)
    expect(clamp(1.8)).toBe(1)
  })

  it('maps progress to video time with duration bounds', () => {
    expect(progressToTime(0.5, 30)).toBe(15)
    expect(progressToTime(2, 30)).toBe(30)
    expect(progressToTime(-1, 30)).toBe(0)
    expect(progressToTime(0.5, -4)).toBe(0)
  })

  it('uses the local thirty-second movie as the default timing contract', () => {
    expect(VIDEO_DURATION_SECONDS).toBe(30)
    expect(progressToTime(1)).toBe(30)
  })

  it('reveals chat beats as stage-1 progress grows', () => {
    expect(chatBeats).toHaveLength(8)
    expect(beatsRevealed(0)).toBe(0)
    expect(beatsRevealed(0.5)).toBe(4)
    expect(beatsRevealed(1)).toBe(8)
  })

  it('lights act tiles only once the causing text is revealed', () => {
    expect(actTiles).toHaveLength(3)
    // No player-action beats revealed yet.
    expect(actsLit(0)).toBe(0)
    // All eight beats revealed -> all three player actions have landed.
    expect(actsLit(1)).toBe(3)
    // Monotonic: lighting never decreases as progress grows.
    let previous = 0
    for (let p = 0; p <= 1.0001; p += 0.1) {
      const lit = actsLit(p)
      expect(lit).toBeGreaterThanOrEqual(previous)
      previous = lit
    }
  })

  it('maps theater progress to one of the three acts', () => {
    expect(theaterChapters).toHaveLength(3)
    expect(progressToTheaterChapter(0)).toBe(0)
    expect(progressToTheaterChapter(0.33)).toBe(0)
    expect(progressToTheaterChapter(0.34)).toBe(1)
    expect(progressToTheaterChapter(0.67)).toBe(2)
    expect(progressToTheaterChapter(1)).toBe(2)
  })

  it('binds exactly one Scout watch link in the thread', () => {
    const linked = chatBeats.filter((b) => b.link)
    expect(linked).toHaveLength(1)
    expect(linked[0].author).toBe('scout')
  })
})
