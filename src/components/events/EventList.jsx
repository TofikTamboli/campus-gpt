import { motion, AnimatePresence } from 'framer-motion'
import { useEventStore } from '../../store/useEventStore'
import EventCard from './EventCard'

export default function EventList({ pixelTestId }) {
    const { events } = useEventStore()

    return (
        <div data-pixel-id={pixelTestId} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

            <AnimatePresence>
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                        <EventCard event={event} pixelTestId={`event-card-${event.id}`} />
                    </motion.div>
                ))}
            </AnimatePresence>
            {events.length === 0 && (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm">
                    No events yet. Check back soon!
                </div>
            )}
        </div>
    )
}
