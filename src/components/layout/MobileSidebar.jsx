import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Home, FolderKanban, CalendarRange, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthButtons from '../../auth/AuthButtons'

export default function MobileSidebar({ isOpen, onClose, activeTab, onTabChange }) {
    const navigate = useNavigate()

    const menuItems = [
        { id: 'study', label: 'Study Buddy', icon: Home },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'events', label: 'Campus Events', icon: CalendarRange },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    />

                    {/* Sidebar Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0F0F10] border-r border-white/10 z-[70] md:hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                                    <GraduationCap size={18} className="text-[#7C3AED]" />
                                </div>
                                <span className="text-sm font-semibold tracking-tight text-white">Campus GPT</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-[#9CA3AF] hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 py-6 px-3 flex flex-col gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onTabChange(item.id)
                                        onClose()
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-white text-black font-medium shadow-lg shadow-white/5'
                                        : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Footer / Account */}
                        <div className="p-6 border-t border-white/5 bg-[#0B0B0B]/50">
                            <AuthButtons />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
