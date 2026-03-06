import { Menu, GraduationCap, UserCircle } from 'lucide-react'
import useAuth from '../../auth/useAuth'

export default function TopBar({ onOpenSidebar }) {
    const { profile } = useAuth()

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#0B0B0B] border-b border-white/5 md:hidden sticky top-0 z-[50]">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-[#9CA3AF] hover:text-white transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                        <GraduationCap size={15} className="text-[#7C3AED]" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-white uppercase">Campus GPT</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="text-right mr-2 hidden sm:block">
                    <p className="text-[10px] text-[#9CA3AF] leading-none mb-0.5">Signed in as</p>
                    <p className="text-xs text-white font-medium leading-none">{profile?.full_name || 'Student'}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 bg-[#111] flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle size={20} className="text-[#9CA3AF]" />
                    )}
                </div>
            </div>
        </header>
    )
}
