import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus } from 'lucide-react'
import DashboardTabs from '../components/tabs/DashboardTabs'
import StudySessionPanel from '../components/study/StudySessionPanel'
import ProjectGrid from '../components/projects/ProjectGrid'
import EventAdminForm from '../components/events/EventAdminForm'
import EventList from '../components/events/EventList'
import useAuth from '../auth/useAuth'
import { canCreateEvents } from '../utils/roleUtils'
import MainLayout from '../components/layout/MainLayout'

const panelVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98 },
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('study')
    const { profile } = useAuth()
    const navigate = useNavigate()
    const facultyCanCreate = canCreateEvents(profile)

    // Using useMemo to ensure content is stable and doesn't flicker unnecessarily
    const renderContent = () => {
        switch (activeTab) {
            case 'study':
                return (
                    <motion.div
                        key="study"
                        variants={panelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="w-full h-full p-3 sm:p-4 md:p-6"
                    >
                        <StudySessionPanel pixelTestId="study-panel" />
                    </motion.div>
                )
            case 'projects':
                return (
                    <motion.div
                        key="projects"
                        variants={panelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="w-full h-full p-3 sm:p-4 md:p-6 overflow-y-auto"
                    >
                        <div className="max-w-[1200px] mx-auto">
                            <ProjectGrid profile={profile} pixelTestId="project-grid" />
                        </div>
                    </motion.div>
                )
            case 'events':
                return (
                    <motion.div
                        key="events"
                        variants={panelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="w-full h-full p-3 sm:p-4 md:p-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
                            {facultyCanCreate && (
                                <div className="flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/events/create')}
                                        className="flex items-center gap-2 text-xs border border-[#7C3AED]/40 text-[#7C3AED] rounded-xl px-4 py-2 hover:bg-[#7C3AED]/10 transition-colors"
                                    >
                                        <CalendarPlus size={13} /> Create Event
                                    </motion.button>
                                </div>
                            )}
                            {facultyCanCreate && <EventAdminForm />}
                            <EventList pixelTestId="event-list" />
                        </div>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Tab bar container */}
                <div className="shrink-0 pt-2 pb-1 bg-[#0B0B0B] border-b border-white/5">
                    <DashboardTabs active={activeTab} onChange={setActiveTab} />
                </div>

                {/* Tab content container */}
                <div className="flex-1 overflow-hidden relative bg-[#0B0B0B]">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    )
}
