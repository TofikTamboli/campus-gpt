import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Upload, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/useProjectStore'
import { projectSchema } from '../../utils/uiValidation'
import Input from '../ui/Input'

export default function AddProjectForm() {
    const navigate = useNavigate()
    const { addProject } = useProjectStore()
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(projectSchema) })

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setThumbnail(file)
        const reader = new FileReader()
        reader.onload = (ev) => setThumbnailPreview(ev.target.result)
        reader.readAsDataURL(file)
    }

    const onSubmit = (data) => {
        addProject({ ...data, thumbnail: thumbnailPreview })
        setSubmitted(true)
        setTimeout(() => navigate('/'), 1500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[800px] mx-auto w-full"
        >
            {/* Back */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={14} /> Back
            </button>

            <div className="border border-white/20 rounded-xl overflow-hidden">
                {/* Page title */}
                <div className="px-6 py-4 border-b border-white/20 text-center">
                    <h1 className="text-sm font-semibold text-[#F5F5F5] tracking-wide">Add Project Page</h1>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {/* Thumbnail Upload */}
                    <div className="flex justify-center">
                        <label
                            aria-label="Upload project thumbnail"
                            className="relative w-[520px] max-w-full h-[220px] border border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/3 transition-colors overflow-hidden"
                        >
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload size={22} className="text-[#9CA3AF]" />
                                    <span className="text-sm text-[#9CA3AF]">Upload Project Thumbnail</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="sr-only" onChange={handleThumbnailChange} />
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="border border-white/20 rounded-xl p-4 flex flex-col gap-3">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">Title:</span>
                            <input
                                {...register('title')}
                                placeholder=""
                                aria-label="Project title"
                                className="w-full h-14 bg-transparent border border-white/20 rounded-xl pl-14 pr-4 text-sm text-[#F5F5F5] focus:outline-none focus:border-white/40 transition-colors"
                            />
                            {errors.title && <span className="text-xs text-red-400 mt-1 block">{errors.title.message}</span>}
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">Description:</span>
                            <input
                                {...register('description')}
                                placeholder=""
                                aria-label="Project description"
                                className="w-full h-14 bg-transparent border border-white/20 rounded-xl pl-24 pr-4 text-sm text-[#F5F5F5] focus:outline-none focus:border-white/40 transition-colors"
                            />
                            {errors.description && <span className="text-xs text-red-400 mt-1 block">{errors.description.message}</span>}
                        </div>

                        <div className="relative border border-white/20 rounded-xl overflow-hidden">
                            <div className="flex items-center h-14 px-4 border-b border-white/20">
                                <span className="text-sm text-[#9CA3AF] w-24 shrink-0">Repo Link:</span>
                                <input
                                    {...register('repoLink')}
                                    placeholder="https://github.com/..."
                                    aria-label="Repository link"
                                    className="flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center h-14 px-4">
                                <span className="text-sm text-[#9CA3AF] w-24 shrink-0">Live Link:</span>
                                <input
                                    {...register('liveLink')}
                                    placeholder="https://..."
                                    aria-label="Live demo link"
                                    className="flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:outline-none"
                                />
                            </div>
                            {(errors.repoLink || errors.liveLink) && (
                                <span className="text-xs text-red-400 px-4 pb-2 block">
                                    {errors.repoLink?.message || errors.liveLink?.message}
                                </span>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-center mt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || submitted}
                                className="flex items-center gap-2 h-12 px-6 border border-white/20 rounded-xl text-sm text-[#F5F5F5] hover:bg-white/5 transition-all disabled:opacity-60"
                            >
                                {submitted ? '✅ Uploaded!' : <>Upload To Project Community <Upload size={15} /></>}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
