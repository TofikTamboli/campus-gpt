import { motion } from 'framer-motion'
import { CheckCircle, Circle, Trash2, Calendar } from 'lucide-react'
import { useEventStore } from '../../store/useEventStore'

export default function EventCard({ event, pixelTestId }) {
    const { toggleCheck, deleteEvent, checkedEvents } = useEventStore()
    const isChecked = checkedEvents.includes(event.id)

    const formatDeadline = (d) => {
        try {
            return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } catch {
            return d
        }
    }

    const getDaysLeft = (deadline) => {
        const diff = new Date(deadline) - new Date()
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
        if (days < 0) return 'Expired'
        if (days === 0) return 'Today'
        return `${days}d left`
    }

    return (
        <motion.div
            data-pixel-id={pixelTestId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className={`border rounded-xl p-4 flex items-start gap-4 transition-colors ${isChecked ? 'border-white/10 bg-white/3 opacity-70' : 'border-white/20 bg-[#0d0d0d]'
                }`}
        >
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-2">
                        <span className="text-xs text-[#9CA3AF]">Title:</span>
                        <span className={`text-xs text-[#F5F5F5] font-medium ${isChecked ? 'line-through' : ''}`}>
                            {event.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                        <Calendar size={11} />
                        <span>Deadline:</span>
                        <span className="text-[#F5F5F5]">{formatDeadline(event.deadline)}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${getDaysLeft(event.deadline) === 'Expired' ? 'bg-red-500/20 text-red-400' :
                            getDaysLeft(event.deadline) === 'Today' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-white/10 text-[#9CA3AF]'
                            }`}>{getDaysLeft(event.deadline)}</span>
                    </div>
                </div>

                {event.description && (
                    <p className="text-xs text-[#9CA3AF] mt-1">
                        <span className="text-[#9CA3AF]">Description: </span>
                        {event.description}
                    </p>
                )}

                {event.venue && (
                    <p className="text-xs text-[#9CA3AF] mt-0.5">📍 {event.venue}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => toggleCheck(event.id)}
                    aria-label={isChecked ? 'Uncheck event' : 'Check event'}
                    className={`transition-colors ${isChecked ? 'text-green-400' : 'text-[#9CA3AF] hover:text-green-400'}`}
                >
                    {isChecked ? <CheckCircle size={18} /> : <Circle size={18} />}
                </button>
                <button
                    onClick={() => deleteEvent(event.id)}
                    aria-label="Delete event"
                    className="text-[#9CA3AF] hover:text-red-400 transition-colors"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </motion.div>
    )
}
