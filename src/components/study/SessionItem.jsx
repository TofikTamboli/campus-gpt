import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Pencil, Check } from 'lucide-react'
import { useDoubleTap } from '../../utils/sessionRename'

/**
 * SessionItem — single session row in the Study Buddy sidebar.
 *
 * Supports:
 * - Double-click (desktop) and double-tap (touch) to enter rename mode
 * - Inline text input with auto-focus, Enter/blur to confirm
 * - Delete button
 */
export default function SessionItem({ session, isActive, onSelect, onDelete, onRename }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(session.name)
    const inputRef = useRef(null)

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [editing])

    // Update local value if session name changes externally
    useEffect(() => { setValue(session.name) }, [session.name])

    const startEditing = () => setEditing(true)
    const confirmEdit = () => {
        setEditing(false)
        const trimmed = value.trim()
        if (trimmed && trimmed !== session.name) {
            onRename(session.id, trimmed)
        } else {
            setValue(session.name) // restore if empty or unchanged
        }
    }

    const { onTouchStart, onDoubleClick } = useDoubleTap(startEditing, 300)

    return (
        <motion.div
            data-testid={`session-item-${session.id}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            onClick={() => !editing && onSelect(session.id)}
            onDoubleClick={onDoubleClick}
            onTouchStart={onTouchStart}
            title="Double-tap to rename"
            className={`group relative flex items-center h-12 px-3 rounded-xl border cursor-pointer select-none transition-colors ${isActive
                    ? 'border-[#7C3AED]/50 bg-[#7C3AED]/10 text-white'
                    : 'border-white/20 text-[#9CA3AF] hover:bg-white/5 hover:border-white/30'
                }`}
        >
            {editing ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={confirmEdit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') inputRef.current?.blur()
                            if (e.key === 'Escape') { setEditing(false); setValue(session.name) }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Rename study session"
                        className="flex-1 min-w-0 bg-transparent border border-[#7C3AED]/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                    <button
                        onMouseDown={(e) => { e.preventDefault(); inputRef.current?.blur() }}
                        aria-label="Confirm rename"
                        className="text-[#06B6D4] shrink-0"
                    >
                        <Check size={13} />
                    </button>
                </div>
            ) : (
                <>
                    <span className="flex-1 text-sm truncate min-w-0">{session.name}</span>

                    {/* Action buttons — visible on hover or when active */}
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); startEditing() }}
                            aria-label="Rename session"
                            className="p-1 text-[#9CA3AF] hover:text-[#7C3AED] rounded transition-colors"
                        >
                            <Pencil size={12} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
                            aria-label="Delete session"
                            className="p-1 text-[#9CA3AF] hover:text-red-400 rounded transition-colors"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    )
}
