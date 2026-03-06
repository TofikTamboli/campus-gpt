import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStudyStore = create(
    persist(
        (set, get) => ({
            sessions: [
                { id: 'default-1', name: 'CReated Session', subject: 'General Study', createdAt: new Date().toISOString() }
            ],
            activeSessionId: 'default-1',
            messages: {},

            createSession: (name = 'New Session', subject = 'General Study') => {
                const id = `session-${Date.now()}`
                set((state) => ({
                    sessions: [...state.sessions, { id, name, subject, createdAt: new Date().toISOString() }],
                    activeSessionId: id,
                    messages: { ...state.messages, [id]: [] },
                }))
                return id
            },

            deleteSession: (id) => {
                set((state) => {
                    const remaining = state.sessions.filter((s) => s.id !== id)
                    const newMessages = { ...state.messages }
                    delete newMessages[id]
                    return {
                        sessions: remaining,
                        activeSessionId: remaining.length > 0 ? remaining[remaining.length - 1].id : null,
                        messages: newMessages,
                    }
                })
            },

            setActiveSession: (id) => set({ activeSessionId: id }),

            // Rename a session — double-tap rename UX persists here
            renameSession: (id, newName) => {
                set((state) => ({
                    sessions: state.sessions.map((s) =>
                        s.id === id ? { ...s, name: newName } : s
                    ),
                }))
            },

            addMessage: (sessionId, message) => {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [sessionId]: [...(state.messages[sessionId] || []), message],
                    },
                }))
            },

            getSessionMessages: (sessionId) => {
                return get().messages[sessionId] || []
            },
        }),
        { name: 'campus-gpt-study-store' }
    )
)
