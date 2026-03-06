import { z } from 'zod'

// Project schema
export const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    repoLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    liveLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

// Event schema
export const eventSchema = z.object({
    title: z.string().min(3, 'Event title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    venue: z.string().min(2, 'Venue is required'),
    deadline: z.string().refine((d) => {
        const date = new Date(d)
        return !isNaN(date.getTime()) && date > new Date()
    }, 'Deadline must be a future date'),
    duration: z.string().min(1, 'Duration is required'),
})

// UI Validation Checks
export function validateLayout(elements) {
    const issues = []

    elements.forEach((el) => {
        const rect = el.getBoundingClientRect()

        // Check if element overflows viewport
        if (rect.right > window.innerWidth) {
            issues.push({ element: el.tagName, issue: 'Element overflows viewport horizontally' })
            console.warn('[UI Validation] Element overflows viewport:', el)
        }

        // Check minimum touch target size
        if (el.tagName === 'BUTTON' && (rect.width < 44 || rect.height < 44)) {
            issues.push({ element: el.tagName, issue: 'Button touch target too small (< 44px)' })
        }

        // Check for empty text in important elements
        if (['H1', 'H2', 'H3'].includes(el.tagName) && !el.textContent?.trim()) {
            issues.push({ element: el.tagName, issue: 'Empty heading detected' })
            console.warn('[UI Validation] Empty heading:', el)
        }
    })

    return issues
}

export function checkContrast(bgHex, textHex) {
    const toRGB = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255
        return [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    }
    const L = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const L1 = L(toRGB(bgHex))
    const L2 = L(toRGB(textHex))
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    if (ratio < 4.5) {
        console.warn(`[UI Validation] Low contrast ratio: ${ratio.toFixed(2)} (requires >= 4.5)`)
    }
    return ratio
}

export function runUIValidation() {
    const interactive = document.querySelectorAll('button, a, input, textarea')
    const issues = validateLayout([...interactive])

    // Check grid alignment
    const grids = document.querySelectorAll('[data-grid]')
    grids.forEach((grid) => {
        const children = [...grid.children]
        if (children.length === 0) {
            console.warn('[UI Validation] Empty grid detected:', grid)
            issues.push({ element: 'GRID', issue: 'Empty grid' })
        }
    })

    if (issues.length === 0) {
        console.log('[UI Validation] ✅ All checks passed')
    } else {
        console.warn('[UI Validation] ⚠️ Issues found:', issues)
    }

    return issues
}
