import { Github, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full py-6 px-4 mt-auto border-t border-white/5 bg-[#0B0B0B]/50 backdrop-blur-md">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[11px] sm:text-xs text-[#9CA3AF] flex items-center gap-1.5 text-center md:text-left">
                    Built with <Heart size={10} className="text-red-500 fill-red-500" /> by
                    <span className="text-[#F5F5F5] font-medium ml-1">Anam, Tofik, Sadiq, Atif, Saeed,</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="text-[#9CA3AF]">Campus GPT Project</span>
                </p>

                <a
                    href="https://github.com/TofikTamboli/campus-gpt.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] sm:text-xs text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all"
                >
                    <Github size={14} />
                    <span>View on GitHub</span>
                </a>
            </div>
        </footer>
    )
}
