import { motion } from 'framer-motion'
import { Star, ThumbsUp, ExternalLink, Github } from 'lucide-react'
import { useProjectStore } from '../../store/useProjectStore'
import { canStarProjects, permissionDeniedMsg } from '../../utils/roleUtils'
import toast from 'react-hot-toast'

export default function ProjectCard({ project, profile, pixelTestId }) {
    const { toggleStar, toggleLike } = useProjectStore()
    const faculty = canStarProjects(profile)

    const handleStar = (e) => {
        e.stopPropagation()
        if (!faculty) {
            toast.error(permissionDeniedMsg('star projects'))
            return
        }
        toggleStar(project.id)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        if (!profile) {
            toast.error('Please sign in to like projects')
            return
        }
        toggleLike(project.id)
    }

    return (
        <motion.article
            data-pixel-id={pixelTestId}
            data-testid={`project-card-${project.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col border border-white/20 rounded-xl overflow-hidden bg-[#111] cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="aspect-video w-full bg-[#0d0d0d] border-b border-white/20 flex items-center justify-center overflow-hidden">
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm text-[#9CA3AF] font-mono tracking-wide">{project.title}</span>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#9CA3AF]">
                            <span className="font-medium">Title: </span>
                            <span className="text-[#F5F5F5]">{project.title}</span>
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                            <span className="font-medium">Description: </span>

                            <span className="line-clamp-2">{project.description}</span>
                        </p>
                    </div>

                    {/* Action icons */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {/* Thumbs up — all authenticated users */}
                        <button
                            onClick={handleLike}
                            aria-label={`Like ${project.title}`}
                            data-testid={`like-btn-${project.id}`}
                            className={`p-1 rounded transition-colors ${project.liked ? 'text-[#06B6D4]' : 'text-[#9CA3AF] hover:text-[#06B6D4]'
                                }`}
                        >
                            <ThumbsUp size={14} fill={project.liked ? 'currentColor' : 'none'} />
                        </button>

                        {/* Star — faculty only. Hidden for students. */}
                        {faculty && (
                            <button
                                onClick={handleStar}
                                aria-label={`Star ${project.title}`}
                                data-testid={`star-btn-${project.id}`}
                                data-role-only="faculty"
                                className={`p-1 rounded transition-colors ${project.starred ? 'text-[#7C3AED]' : 'text-[#9CA3AF] hover:text-[#7C3AED]'
                                    }`}
                            >
                                <Star size={14} fill={project.starred ? 'currentColor' : 'none'} />
                            </button>
                        )}

                        {/* Links */}
                        {project.repoLink && (
                            <a
                                href={project.repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="View repository"
                                className="p-1 text-[#9CA3AF] hover:text-white transition-colors"
                            >
                                <Github size={13} />
                            </a>
                        )}
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="View live demo"
                                className="p-1 text-[#9CA3AF] hover:text-white transition-colors"
                            >
                                <ExternalLink size={13} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    )
}
