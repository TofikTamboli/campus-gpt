import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Home, FolderKanban, CalendarRange, UserCircle, LogOut, ChevronRight, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from './MainSidebar'
import MobileSidebar from './MobileSidebar'
import TopBar from './TopBar'
import Footer from './Footer'
import useAuth from '../../auth/useAuth'

export default function MainLayout({ children, activeTab, onTabChange }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const { profile, signOut } = useAuth()

    return (
        <div className="min-h-screen bg-[#0B0B0B] font-inter text-[#F5F5F5] flex flex-col md:flex-row">
            {/* Mobile Navigation */}
            <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
            <MobileSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />

            {/* Desktop / Tablet Sidebar (Fixed) */}
            <MainSidebar activeTab={activeTab} onTabChange={onTabChange} />

            {/* Content Area */}
            <main className="flex-1 flex flex-col min-w-0 md:ml-16 lg:ml-64 transition-[margin] duration-300 ease-in-out">
                <div className="flex-1 flex flex-col min-h-0">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    )
}
