// @ts-check
const { test, expect, devices } = require('@playwright/test')

const BASE = 'http://localhost:5173'

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

/**
 * Signs in as a given role using the mock auth dev panel.
 * Works when VITE_SUPABASE_URL=mock (default .env.local).
 */
async function signInAs(page, role) {
    await page.goto(BASE + '/login')
    await page.waitForLoadState('networkidle')

    // Click the role radio
    await page.click(`input[type="radio"][value="${role}"]`)

    // Click submit
    await page.click('button[type="submit"]')

    // Wait for dashboard to load
    await page.waitForURL(BASE + '/', { timeout: 8000 })
    await page.waitForLoadState('networkidle')
}

// ─────────────────────────────────────────────────────────
// 1. Auth & Role Restriction Tests
// ─────────────────────────────────────────────────────────

test.describe('Role Restrictions', () => {
    test('student: cannot access /events/create', async ({ page }) => {
        await signInAs(page, 'student')
        await page.goto(BASE + '/events/create')
        await page.waitForLoadState('networkidle')

        // Should redirect or show access denied message
        const body = await page.content()
        const isRestricted =
            body.includes('Access Restricted') ||
            body.includes('do not have permission') ||
            page.url() === BASE + '/'

        expect(isRestricted).toBe(true)
    })

    test('student: no star button on project cards', async ({ page }) => {
        await signInAs(page, 'student')

        // Navigate to Projects tab
        await page.click('button:has-text("Project Comunity")')
        await page.waitForTimeout(500)

        // Star buttons should NOT be visible for students
        const starButtons = await page.$$('[data-testid^="star-btn-"]')
        expect(starButtons.length).toBe(0)
    })

    test('faculty: star button visible on project cards', async ({ page }) => {
        await signInAs(page, 'faculty')

        // Navigate to Projects tab
        await page.click('button:has-text("Project Comunity")')
        await page.waitForTimeout(500)

        // At least one star button should be visible
        const starButtons = await page.$$('[data-testid^="star-btn-"]')
        expect(starButtons.length).toBeGreaterThan(0)
    })

    test('faculty: can access /events/create', async ({ page }) => {
        await signInAs(page, 'faculty')
        await page.goto(BASE + '/events/create')
        await page.waitForLoadState('networkidle')

        // Should see the event creation form heading
        await expect(page.locator('text=Create Event')).toBeVisible()
    })

    test('unauthenticated: redirected to /login from /', async ({ page }) => {
        // Clear any existing mock auth
        await page.goto(BASE)
        await page.evaluate(() => localStorage.removeItem('campus-gpt-mock-auth'))
        await page.reload()
        await page.waitForURL('**/login', { timeout: 5000 })
        expect(page.url()).toContain('/login')
    })
})

// ─────────────────────────────────────────────────────────
// 2. Double-Tap Rename Tests
// ─────────────────────────────────────────────────────────

test.describe('Double-Tap Rename', () => {
    test('desktop: double-click on session item enters rename mode', async ({ page }) => {
        await signInAs(page, 'student')

        // Wait for Study Buddy tab to be active (default)
        await page.waitForSelector('[data-testid^="session-item-"]', { timeout: 5000 })

        const sessionItem = await page.$('[data-testid^="session-item-"]')
        expect(sessionItem).not.toBeNull()

        // Double-click to trigger rename
        await sessionItem.dblclick()
        await page.waitForTimeout(200)

        // Rename input should appear
        const renameInput = await page.$('input[aria-label="Rename study session"]')
        expect(renameInput).not.toBeNull()
    })

    test('desktop: Enter key confirms rename', async ({ page }) => {
        await signInAs(page, 'student')
        await page.waitForSelector('[data-testid^="session-item-"]')

        const sessionItem = await page.$('[data-testid^="session-item-"]')
        await sessionItem.dblclick()
        await page.waitForTimeout(200)

        const input = await page.$('input[aria-label="Rename study session"]')
        await input.fill('My Renamed Session')
        await input.press('Enter')
        await page.waitForTimeout(300)

        // Input should be gone; new name should appear
        const inputAfter = await page.$('input[aria-label="Rename study session"]')
        expect(inputAfter).toBeNull()

        const body = await page.content()
        expect(body).toContain('My Renamed Session')
    })

    test('touch: double-tap within 300ms enters rename mode', async ({ page }) => {
        await signInAs(page, 'student')
        await page.waitForSelector('[data-testid^="session-item-"]')

        const sessionItem = await page.$('[data-testid^="session-item-"]')
        const box = await sessionItem.boundingBox()

        // Simulate two touchstart events within 200ms
        const tapPoint = { x: box.x + box.width / 2, y: box.y + box.height / 2 }

        await page.touchscreen.tap(tapPoint.x, tapPoint.y)
        await page.waitForTimeout(100)
        await page.touchscreen.tap(tapPoint.x, tapPoint.y)
        await page.waitForTimeout(200)

        const renameInput = await page.$('input[aria-label="Rename study session"]')
        expect(renameInput).not.toBeNull()
    })
})

// ─────────────────────────────────────────────────────────
// 3. Responsive Screenshot Tests
// ─────────────────────────────────────────────────────────

const VIEWPORTS = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
]

for (const vp of VIEWPORTS) {
    test(`responsive: dashboard renders correctly at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await signInAs(page, 'student')

        // Take screenshot and store for visual diffing
        await page.screenshot({
            path: `tests/visual-tests/captures/dashboard-${vp.name}-${vp.width}x${vp.height}.png`,
            fullPage: false,
        })

        // Basic checks: tab bar present
        await expect(page.locator('text=Study Boudy')).toBeVisible()
        await expect(page.locator('text=Project Comunity')).toBeVisible()
        await expect(page.locator('text=Event Alert')).toBeVisible()
    })

    test(`responsive: events/create page at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await signInAs(page, 'faculty')
        await page.goto(BASE + '/events/create')
        await page.waitForLoadState('networkidle')

        await page.screenshot({
            path: `tests/visual-tests/captures/events-create-${vp.name}.png`,
            fullPage: false,
        })

        await expect(page.locator('text=Create Event')).toBeVisible()
    })
}

// ─────────────────────────────────────────────────────────
// 4. Core UI Functional Tests
// ─────────────────────────────────────────────────────────

test.describe('Core UI Functional Tests', () => {
    test('tabs switch correctly', async ({ page }) => {
        await signInAs(page, 'student')

        // Click Project Community
        await page.click('button:has-text("Project Comunity")')
        await page.waitForTimeout(400)
        await expect(page.locator('text=Project Community')).toBeVisible()

        // Click Event Alert
        await page.click('button:has-text("Event Alert")')
        await page.waitForTimeout(400)

        // Student should NOT see Create Event button
        const createEventBtn = await page.$('text=Create Event')
        expect(createEventBtn).toBeNull()
    })

    test('faculty sees Create Event button in events tab', async ({ page }) => {
        await signInAs(page, 'faculty')

        await page.click('button:has-text("Event Alert")')
        await page.waitForTimeout(400)

        await expect(page.locator('button:has-text("Create Event")')).toBeVisible()
    })

    test('add project page loads correctly', async ({ page }) => {
        await signInAs(page, 'student')
        await page.click('button:has-text("Project Comunity")')
        await page.waitForTimeout(400)

        await page.click('button:has-text("Add Project")')
        await page.waitForURL('**/add-project', { timeout: 5000 })
        await expect(page.locator('text=Add Project Page')).toBeVisible()
    })

    test('chat input sends message and shows LLM response', async ({ page }) => {
        await signInAs(page, 'student')
        await page.waitForSelector('textarea[aria-label="Chat message input"]')

        await page.fill('textarea[aria-label="Chat message input"]', 'What is photosynthesis?')
        await page.click('button[aria-label="Send message"]')
        await page.waitForTimeout(1500)

        // Mock response should appear
        const messages = await page.$$('.flex.gap-3')
        expect(messages.length).toBeGreaterThan(0)
    })
})
