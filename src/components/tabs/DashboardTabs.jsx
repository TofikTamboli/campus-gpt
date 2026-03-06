import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

const TABS = [
    { id: 'study', label: 'Study Buddy' },
    { id: 'projects', label: 'Project Community' },
    { id: 'events', label: 'Event Alert' },
]


export default function DashboardTabs({ active, onChange }) {
    return (
        <div className="flex items-center justify-center w-full py-3 sm:py-4" role="tablist">
            <div className="inline-flex bg-transparent border border-white/20 rounded-xl p-1 gap-1 max-w-full overflow-x-auto scrollbar-hide">

                {TABS.map((tab) => {
                    const isActive = active === tab.id
                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${tab.id}`}
                            id={`tab-${tab.id}`}
                            onClick={() => onChange(tab.id)}
                            className={cn(
                                'relative h-10 px-6 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer whitespace-nowrap',
                                isActive
                                    ? 'text-black'
                                    : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-white rounded-lg"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
