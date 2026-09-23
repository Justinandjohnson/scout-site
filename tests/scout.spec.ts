import { expect, test } from '@playwright/test'

test.describe('Scout two-stage cinematic site', () => {
  test('renders the phone stage headline and the movie video', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Your group chat just made a movie.' })).toBeVisible()

    const film = page.locator('video.film')
    await expect(film).toHaveCount(1)
    await expect(film).toHaveAttribute('src', '/media/pinger-worlds-30s.mp4')
    // muted + playsinline are required so scrubbing works without user gesture.
    await expect(film).toHaveJSProperty('muted', true)
    await expect(film).toHaveJSProperty('playsInline', true)
  })

  test('stage-1 progress advances as the page scrolls', async ({ page }) => {
    await page.goto('/')

    const progress = page.getByTestId('progress-value')
    await expect(progress).toHaveText('0%')

    // Drive real scroll through the phone stage track.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2))
    await expect(async () => {
      const text = await progress.textContent()
      const value = Number.parseInt(text?.replace('%', '') ?? '0', 10)
      expect(value).toBeGreaterThan(0)
    }).toPass({ timeout: 5_000 })
  })

  test('has no horizontal overflow on a phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('reduced-motion shows every message without depending on scrub', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

    // The reduced-motion fallback grid is revealed and readable.
    await expect(page.getByRole('heading', { name: '1 · The group chat' })).toBeVisible()
    // The get-started instructions are reachable regardless of motion.
    await expect(page.getByRole('heading', { name: 'Add Scout to your group chat' })).toBeVisible()

    await context.close()
  })
})
