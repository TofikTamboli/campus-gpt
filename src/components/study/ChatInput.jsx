import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Paperclip, Mic, Send, ChevronDown } from 'lucide-react'

const STUDY_MODES = [
    'genral Study mode',
    'End Term Prep',
    'Test Creation',
    'Explanation Mode',
]

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState('')
    const [showModes, setShowModes] = useState(false)
    const [selectedMode, setSelectedMode] = useState('genral Study mode')
    const textareaRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowModes(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSend = () => {
        const trimmed = text.trim()
        if (!trimmed || disabled) return
        onSend?.(trimmed, selectedMode)
        setText('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = (e) => {
        setText(e.target.value)
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
        }
    }

    return (
        <div className="w-full px-4 pb-4">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="border border-white/20 rounded-2xl bg-[#0d0d0d] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-2xl shadow-black/40"
            >

                {/* Text input */}
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type Any Query"
                    rows={1}
                    aria-label="Chat message input"
                    className="flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none resize-none leading-6 max-h-[120px] overflow-y-auto"
                    style={{ minHeight: '24px' }}
                />

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Mode selector */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowModes((v) => !v)}
                            aria-label="Select study mode"
                            className="flex items-center gap-1 text-xs text-[#9CA3AF] border border-white/20 rounded-lg px-2 py-1 hover:bg-white/5 transition-colors whitespace-nowrap"
                        >
                            {selectedMode}
                            <ChevronDown size={12} className={`transition-transform duration-200 ${showModes ? 'rotate-180' : ''}`} />
                        </button>

                        {showModes && (
                            <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full mb-2 right-0 bg-[#111] border border-white/20 rounded-xl overflow-hidden shadow-xl min-w-[180px] z-50"
                            >
                                {STUDY_MODES.map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => { setSelectedMode(mode); setShowModes(false) }}
                                        className={`w-full text-left px-3 py-2 text-xs transition-colors ${mode === selectedMode ? 'bg-white/10 text-white' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* File upload */}
                    <label aria-label="Attach file" className="cursor-pointer text-[#9CA3AF] hover:text-white transition-colors">
                        <input type="file" className="sr-only" aria-hidden="true" />
                        <Paperclip size={16} />
                    </label>

                    {/* Voice */}
                    <button aria-label="Voice input" className="text-[#9CA3AF] hover:text-white transition-colors">
                        <Mic size={16} />
                    </button>

                    {/* Send */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={handleSend}
                        disabled={!text.trim() || disabled}
                        aria-label="Send message"
                        className="text-[#9CA3AF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={16} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
