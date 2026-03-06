import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, User, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useStudyStore } from '../../store/useStudyStore'
import { callLLM, extractLLMText } from '../../api/llmClient'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SessionItem from './SessionItem'

export default function StudySessionPanel({ pixelTestId }) {
    const {
        sessions,
        activeSessionId,
        messages,
        createSession,
        deleteSession,
        setActiveSession,
        renameSession,
        addMessage,
    } = useStudyStore()

    const [showSessionsMobile, setShowSessionsMobile] = useState(false)
    const chatEndRef = useRef(null)
    const activeMessages = messages[activeSessionId] || []

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeMessages])

    const handleSend = async (text, mode) => {
        if (!activeSessionId) return

        const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
        addMessage(activeSessionId, userMsg)

        try {
            const history = (messages[activeSessionId] || []).slice(-10).map((m) => ({
                role: m.role,
                content: m.content,
            }))

            const systemPrompt = `You are a campus AI study assistant. Current mode: ${mode}. Be concise, educational, and helpful.`
            const response = await callLLM([...history, { role: 'user', content: text }], systemPrompt)
            const content = extractLLMText(response)

            addMessage(activeSessionId, {
                role: 'assistant',
                content: content || 'No response received.',
                timestamp: new Date().toISOString(),
            })
        } catch (err) {
            addMessage(activeSessionId, {
                role: 'assistant',
                content: `⚠ Error: ${err.message}`,
                timestamp: new Date().toISOString(),
            })
        }
    }

    const currentSession = sessions.find(s => s.id === activeSessionId)

    return (
        <div
            data-pixel-id={pixelTestId}
            className="flex h-full w-full border border-white/20 rounded-xl overflow-hidden bg-black/20"
        >
            {/* ─── Sidebar (Desktop/Tablet) ─── */}
            <div className="hidden md:flex w-[240px] shrink-0 border-r border-white/20 flex-col p-3 gap-2 bg-[#0F0F10]/40">
                <p className="text-[10px] text-[#9CA3AF]/50 text-center px-2">
                    Double-tap to rename
                </p>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => createSession(`Session ${sessions.length + 1}`)}
                    className="w-full h-11 flex items-center justify-center gap-2 border border-white/20 rounded-xl text-xs font-medium text-[#F5F5F5] hover:bg-white/5 hover:border-[#7C3AED]/40 transition-colors"
                >
                    <Plus size={14} />
                    New Session
                </motion.button>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                    <AnimatePresence>
                        {sessions.map((session) => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                isActive={activeSessionId === session.id}
                                onSelect={setActiveSession}
                                onDelete={deleteSession}
                                onRename={renameSession}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* ─── Mobile Sessions Overlay ─── */}
            <AnimatePresence>
                {showSessionsMobile && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSessionsMobile(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0F0F10] border-l border-white/20 z-[90] md:hidden flex flex-col p-4 gap-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">Study Sessions</h3>
                                <button onClick={() => setShowSessionsMobile(false)} className="p-1 text-[#9CA3AF]"><X size={18} /></button>
                            </div>
                            <button
                                onClick={() => { createSession(`Session ${sessions.length + 1}`); setShowSessionsMobile(false) }}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-[#7C3AED] rounded-xl text-sm font-medium text-white shadow-lg shadow-[#7C3AED]/20"
                            >
                                <Plus size={16} /> New Session
                            </button>
                            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                                {sessions.map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        isActive={activeSessionId === session.id}
                                        onSelect={(id) => { setActiveSession(id); setShowSessionsMobile(false) }}
                                        onDelete={deleteSession}
                                        onRename={renameSession}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Chat Area ─── */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between px-4 h-12 border-b border-white/10 bg-[#0F0F10]/20">
                    <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare size={14} className="text-[#9CA3AF] shrink-0" />
                        <span className="text-xs font-medium text-white truncate">{currentSession?.name || 'Study Buddy'}</span>
                    </div>
                    <button
                        onClick={() => setShowSessionsMobile(true)}
                        className="text-[10px] font-semibold text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-1 rounded-lg border border-[#7C3AED]/20"
                    >
                        SESSIONS
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <AnimatePresence>
                        {activeMessages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full gap-3 text-center px-8"
                            >
                                <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                    <span className="text-xl">🎓</span>
                                </div>
                                <p className="text-sm text-[#9CA3AF] font-medium tracking-tight">Ask anything about your studies</p>
                            </motion.div>
                        ) : (
                            activeMessages.map((msg, i) => <ChatMessage key={i} {...msg} />)
                        )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="shrink-0 bg-gradient-to-t from-[#0B0B0B] to-transparent pt-4">
                    <ChatInput onSend={handleSend} />
                </div>
            </div>
        </div>
    )
}
