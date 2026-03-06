import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/useProjectStore'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ profile, pixelTestId }) {
    const navigate = useNavigate()
    const { getFilteredProjects, setSearchQuery, searchQuery } = useProjectStore()
    const projects = getFilteredProjects()

    return (
        <div data-pixel-id={pixelTestId} data-grid className="flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-wide">Project Community</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects…"
                            aria-label="Search projects"
                            className="bg-transparent border border-white/20 rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-white/40 w-[160px] sm:w-[200px]"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => navigate('/add-project')}
                        className="flex items-center gap-1.5 text-xs text-[#F5F5F5] border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                        Add Project <Plus size={13} />
                    </motion.button>
                </div>
            </div>

            {/* Responsive grid: 1 col → 2 col → 3 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <AnimatePresence>
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ delay: i * 0.05, duration: 0.28 }}
                        >
                            <ProjectCard
                                project={project}
                                profile={profile}
                                pixelTestId={`project-card-${project.id}`}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {projects.length === 0 && (
                <div className="flex items-center justify-center py-20 text-[#9CA3AF] text-sm">
                    No projects found. Be the first to add one!
                </div>
            )}
        </div>
    )
}
