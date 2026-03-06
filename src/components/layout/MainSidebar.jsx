import { motion } from 'framer-motion'
import { GraduationCap, Home, FolderKanban, CalendarRange, UserCircle, LogOut, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth'

export default function MainSidebar({ activeTab, onTabChange }) {
    const navigate = useNavigate()
    const { profile, signOut } = useAuth()

    const menuItems = [
        { id: 'study', label: 'Study Buddy', icon: Home },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'events', label: 'Campus Events', icon: CalendarRange },
    ]

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-[#0F0F10] border-r border-white/10 z-[60] w-16 lg:w-64 transition-all duration-300 ease-in-out group">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 lg:px-6 border-b border-white/5 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                        <GraduationCap size={18} className="text-[#7C3AED]" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap hidden lg:block uppercase">Campus GPT</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-x-hidden">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group/item relative ${activeTab === item.id
                                ? 'bg-white text-black font-medium shadow-lg shadow-white/5'
                                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
                            }`}
                        title={item.label}
                    >
                        <item.icon size={20} className="shrink-0" />
                        <span className="text-sm whitespace-nowrap hidden lg:block">{item.label}</span>

                        {/* Tooltip for collapsed mode */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[#111] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover/item:opacity-100 lg:hidden pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {item.label}
                        </div>
                    </button>
                ))}
            </nav>

            {/* User Profile / Account */}
            <div className="p-3 border-t border-white/5 bg-[#0B0B0B]/50 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 lg:px-1">
                    <div className="w-9 h-9 shrink-0 rounded-full border border-white/10 bg-[#111] flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle size={22} className="text-[#9CA3AF]" />
                        )}
                    </div>
                    <div className="min-w-0 hidden lg:block">
                        <p className="text-xs text-white font-medium truncate">{profile?.full_name || 'Demo Student'}</p>
                        <p className="text-[10px] text-[#9CA3AF] truncate capitalize">{profile?.role || 'student'}</p>
                    </div>
                </div>

                <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2 text-[#9CA3AF] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                    title="Sign Out"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className="text-xs font-medium hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
