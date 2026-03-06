/**
 * useDoubleTap — detects double-tap on touch devices and double-click on desktop.
 *
 * Usage:
 *   const handleDoubleTap = useDoubleTap(() => setEditing(true))
 *   <div onDoubleClick={handleDoubleTap.onDoubleClick} onTouchStart={handleDoubleTap.onTouchStart}>
 *
 * Touch: two taps within `ms` milliseconds triggers callback.
 * Desktop: native dblclick event triggers callback.
 */
export function useDoubleTap(callback, ms = 300) {
    let lastTap = 0
    let tapTimeout = null

    const onTouchStart = (event) => {
        const now = Date.now()
        const timeSinceLast = now - lastTap

        if (timeSinceLast <= ms && timeSinceLast > 0) {
            // Double tap detected
            clearTimeout(tapTimeout)
            callback(event)
            lastTap = 0
        } else {
            lastTap = now
            // Reset after double-tap window expires
            tapTimeout = setTimeout(() => {
                lastTap = 0
            }, ms)
        }
    }

    const onDoubleClick = (event) => {
        callback(event)
    }

    return { onTouchStart, onDoubleClick }
}
