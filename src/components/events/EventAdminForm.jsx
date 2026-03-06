import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Upload, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useEventStore } from '../../store/useEventStore'
import { eventSchema } from '../../utils/uiValidation'

export default function EventAdminForm() {
    const { addEvent } = useEventStore()
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(eventSchema) })

    const onSubmit = (data) => {
        addEvent(data)
        setSubmitted(true)
        reset()
        setTimeout(() => setSubmitted(false), 2000)
    }

    const inputClass = "w-full h-14 bg-transparent border-b border-white/20 px-4 text-sm text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-white/40 transition-colors"

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-white/20 rounded-xl overflow-hidden"
        >
            {/* Title Bar */}
            <div className="px-6 py-4 border-b border-white/20 text-center">
                <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-wide">Event Alert</h2>
            </div>

            {/* Form */}
            <div className="border border-white/20 rounded-xl m-4 overflow-hidden">
                {/* Title + Deadline row */}
                <div className="flex items-center border-b border-white/20">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">Title:</span>
                        <input
                            {...register('title')}
                            placeholder=""
                            aria-label="Event title"
                            className="w-full h-14 bg-transparent pl-14 pr-4 text-sm text-[#F5F5F5] focus:outline-none"
                        />
                    </div>
                    <div className="border-l border-white/20 flex items-center h-14 px-4 gap-2">
                        <span className="text-sm text-[#9CA3AF]">Dedline:</span>
                        <input
                            {...register('deadline')}
                            type="date"
                            aria-label="Event deadline"
                            className="bg-transparent text-sm text-[#F5F5F5] focus:outline-none [color-scheme:dark]"
                        />
                    </div>
                    {/* Check Submit button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting || submitted}
                        aria-label="Submit event"
                        className="shrink-0 w-12 h-12 flex items-center justify-center border-l border-white/20 text-[#9CA3AF] hover:text-white transition-colors disabled:opacity-60"
                    >
                        {submitted ? <CheckCircle size={18} className="text-green-400" /> : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="9" />
                                <polyline points="9 12 11 14 15 10" />
                            </svg>
                        )}
                    </motion.button>
                </div>

                {/* Description row */}
                <div className="relative border-b border-white/20">
                    <span className="absolute left-4 top-4 text-sm text-[#9CA3AF]">Descreption:</span>
                    <textarea
                        {...register('description')}
                        placeholder=""
                        rows={3}
                        aria-label="Event description"
                        className="w-full bg-transparent pl-32 pr-4 py-4 text-sm text-[#F5F5F5] focus:outline-none resize-none"
                    />
                </div>

                {/* Venue row */}
                <div className="relative border-b border-white/20">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">Venue:</span>
                    <input
                        {...register('venue')}
                        placeholder=""
                        aria-label="Event venue"
                        className="w-full h-14 bg-transparent pl-20 pr-4 text-sm text-[#F5F5F5] focus:outline-none"
                    />
                </div>

                {/* Duration row */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">Duration:</span>
                    <input
                        {...register('duration')}
                        placeholder=""
                        aria-label="Event duration"
                        className="w-full h-14 bg-transparent pl-24 pr-4 text-sm text-[#F5F5F5] focus:outline-none"
                    />
                </div>
            </div>

            {/* Errors */}
            {Object.keys(errors).length > 0 && (
                <div className="px-4 pb-3 flex flex-col gap-1">
                    {Object.values(errors).map((err, i) => (
                        <span key={i} className="text-xs text-red-400">{err.message}</span>
                    ))}
                </div>
            )}
        </motion.div>
    )
}
