import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SAMPLE_EVENTS = [
    {
        id: 'evt-1',
        title: 'Hackathon 2026',
        description: 'Annual campus hackathon — build something amazing in 24 hours.',
        venue: 'Engineering Block A',
        deadline: '2026-03-20',
        duration: '24 hours',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'evt-2',
        title: 'AI Workshop',
        description: 'Hands-on workshop on large language models and prompt engineering.',
        venue: 'Seminar Hall 2',
        deadline: '2026-03-15',
        duration: '3 hours',
        createdAt: new Date().toISOString(),
    },
]

export const useEventStore = create(
    persist(
        (set) => ({
            events: SAMPLE_EVENTS,
            checkedEvents: [],

            addEvent: (event) => {
                const newEvent = {
                    ...event,
                    id: `evt-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                }
                set((state) => ({ events: [newEvent, ...state.events] }))
            },

            toggleCheck: (id) => {
                set((state) => ({
                    checkedEvents: state.checkedEvents.includes(id)
                        ? state.checkedEvents.filter((e) => e !== id)
                        : [...state.checkedEvents, id],
                }))
            },

            deleteEvent: (id) => {
                set((state) => ({
                    events: state.events.filter((e) => e.id !== id),
                }))
            },
        }),
        { name: 'campus-gpt-event-store' }
    )
)
