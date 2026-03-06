import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, UserCheck, ChevronDown, GraduationCap, BookOpen } from 'lucide-react'
import useAuth from './useAuth'
import { IS_MOCK_AUTH } from '../api/supabaseClient'
import toast from 'react-hot-toast'

export default function AuthButtons() {
    const { profile, loading, signOut, mockSignIn, isMockMode } = useAuth()
    const [showMenu, setShowMenu] = useState(false)

    if (loading) return <div className="w-20 h-8 rounded-lg bg-white/5 animate-pulse" />

    if (profile) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowMenu((v) => !v)}
                    className="flex items-center gap-2 text-xs border border-white/20 rounded-xl px-3 py-1.5 text-[#F5F5F5] hover:bg-white/5 transition-colors"
                    aria-label="Account menu"
                >
                    <span className={`w-2 h-2 rounded-full ${profile.role === 'faculty' ? 'bg-[#7C3AED]' : 'bg-[#06B6D4]'}`} />
                    <span className="max-w-[100px] truncate">{profile.full_name || profile.email}</span>
                    <span className="text-[#9CA3AF] text-[10px] border border-white/15 rounded px-1">
                        {profile.role}
                    </span>
                    <ChevronDown size={11} className={`text-[#9CA3AF] transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-1 bg-[#111] border border-white/20 rounded-xl py-1 min-w-[160px] z-50 shadow-xl"
                        >
                            {isMockMode && (
                                <>
                                    <p className="px-3 py-1.5 text-[10px] text-[#9CA3AF] border-b border-white/10">
                                        🧪 Dev Mock Mode
                                    </p>
                                    <button
                                        onClick={() => { mockSignIn('student'); setShowMenu(false); toast.success('Signed in as Student') }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#06B6D4] hover:bg-white/5"
                                    >
                                        <BookOpen size={12} /> Switch to Student
                                    </button>
                                    <button
                                        onClick={() => { mockSignIn('faculty'); setShowMenu(false); toast.success('Signed in as Faculty') }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#7C3AED] hover:bg-white/5"
                                    >
                                        <GraduationCap size={12} /> Switch to Faculty
                                    </button>
                                    <div className="border-t border-white/10 my-1" />
                                </>
                            )}
                            <button
                                onClick={() => { signOut(); setShowMenu(false); toast.success('Signed out') }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5"
                            >
                                <LogOut size={12} /> Sign out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Not logged in
    if (isMockMode) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => { mockSignIn('student'); toast.success('Signed in as Student 🎓') }}
                    className="flex items-center gap-1.5 text-xs border border-[#06B6D4]/40 text-[#06B6D4] rounded-xl px-3 py-1.5 hover:bg-[#06B6D4]/10 transition-colors"
                >
                    <BookOpen size={12} /> Student
                </button>
                <button
                    onClick={() => { mockSignIn('faculty'); toast.success('Signed in as Faculty 🏫') }}
                    className="flex items-center gap-1.5 text-xs border border-[#7C3AED]/40 text-[#7C3AED] rounded-xl px-3 py-1.5 hover:bg-[#7C3AED]/10 transition-colors"
                >
                    <GraduationCap size={12} /> Faculty
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-1.5 text-xs border border-white/20 text-[#F5F5F5] rounded-xl px-3 py-1.5 hover:bg-white/5 transition-colors"
        >
            <LogIn size={12} /> Sign In
        </button>
    )
}
