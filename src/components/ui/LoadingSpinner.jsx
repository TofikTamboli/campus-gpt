export default function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                <p className="text-[#9CA3AF] text-sm">Loading Campus GPT...</p>
            </div>
        </div>
    )
}
