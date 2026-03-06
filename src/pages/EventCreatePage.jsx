import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CalendarPlus, ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEventStore } from '../store/useEventStore'
import { supabase, IS_MOCK_AUTH } from '../api/supabaseClient'
import useAuth from '../auth/useAuth'
import toast from 'react-hot-toast'
import Footer from '../components/layout/Footer'

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    venue: z.string().min(2, 'Venue is required'),
    deadline: z.string().refine((d) => {
        const date = new Date(d)
        return !isNaN(date.getTime()) && date > new Date()
    }, 'Deadline must be a future date'),
    duration: z.string().min(1, 'Duration is required'),
})

export default function EventCreatePage() {
    const navigate = useNavigate()
    const { addEvent } = useEventStore()
    const { user } = useAuth()
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(eventSchema) })

    const onSubmit = async (data) => {
        try {
            if (!IS_MOCK_AUTH && supabase) {
                const { error } = await supabase.from('events').insert([
                    { ...data, created_by: user?.id }
                ])
                if (error) {
                    toast.error(error.message)
                    return
                }
            }

            addEvent(data)
            setSubmitted(true)
            toast.success('Event created successfully!')
            reset()
            setTimeout(() => navigate('/'), 1200)
        } catch (err) {
            toast.error(err.message || 'Failed to create event')
        }
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
            <div className="flex-1 p-4 sm:p-6">
                <div className="max-w-[720px] mx-auto">
                    {/* Back */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={13} /> Back to Dashboard
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-white/20 rounded-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/20 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                                <CalendarPlus size={15} className="text-[#7C3AED]" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold text-[#F5F5F5]">Create Event</h1>
                                <p className="text-xs text-[#9CA3AF]">Faculty Access — publish to all students</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="border border-white/20 rounded-xl m-4 overflow-hidden">
                            {/* Title + Deadline row */}
                            <div className="flex items-center border-b border-white/20">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] pointer-events-none">Title:</span>
                                    <input
                                        {...register('title')}
                                        placeholder=""
                                        aria-label="Event title"
                                        className="w-full h-14 bg-transparent pl-14 pr-4 text-sm text-[#F5F5F5] focus:outline-none border-r border-white/20"
                                    />
                                </div>
                                <div className="flex items-center h-14 px-4 gap-2 shrink-0">
                                    <span className="text-sm text-[#9CA3AF]">Deadline:</span>
                                    <input
                                        {...register('deadline')}
                                        type="date"
                                        aria-label="Event deadline"
                                        min={new Date().toISOString().split('T')[0]}
                                        className="bg-transparent text-sm text-[#F5F5F5] focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                                {/* Submit checkmark */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.18 }}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting || submitted}
                                    aria-label="Submit event"
                                    className="shrink-0 w-12 h-12 flex items-center justify-center border-l border-white/20 hover:bg-[#7C3AED]/10 text-[#9CA3AF] hover:text-[#7C3AED] transition-colors"
                                >
                                    {submitted ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="9" className="text-green-400" />
                                            <polyline points="9 12 11 14 15 10" className="text-green-400" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="9" />
                                            <polyline points="9 12 11 14 15 10" />
                                        </svg>
                                    )}
                                </motion.button>
                            </div>

                            {/* Description */}
                            <div className="relative border-b border-white/20">
                                <span className="absolute left-4 top-4 text-sm text-[#9CA3AF] pointer-events-none">Description:</span>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    aria-label="Event description"
                                    className="w-full bg-transparent pl-32 pr-4 py-4 text-sm text-[#F5F5F5] focus:outline-none resize-none"
                                />
                            </div>

                            {/* Venue */}
                            <div className="relative border-b border-white/20">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] pointer-events-none">Venue:</span>
                                <input
                                    {...register('venue')}
                                    aria-label="Event venue"
                                    className="w-full h-14 bg-transparent pl-20 pr-4 text-sm text-[#F5F5F5] focus:outline-none"
                                />
                            </div>

                            {/* Duration */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] pointer-events-none">Duration:</span>
                                <input
                                    {...register('duration')}
                                    placeholder="e.g. 2 hours"
                                    aria-label="Event duration"
                                    className="w-full h-14 bg-transparent pl-24 pr-4 text-sm text-[#F5F5F5] placeholder-[#9CA3AF]/40 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Validation errors */}
                        {Object.keys(errors).length > 0 && (
                            <div className="px-4 pb-4 flex flex-col gap-1">
                                {Object.values(errors).map((err, i) => (
                                    <span key={i} className="text-xs text-red-400">⚠ {err.message}</span>
                                ))}
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="px-4 pb-5 flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || submitted}
                                className="flex items-center gap-2 h-11 px-8 bg-[#7C3AED] text-white text-sm font-medium rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-60"
                            >
                                {submitted ? '✅ Event Listed!' : <><Send size={14} /> List Event</>}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
