import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

export default function ChatMessage({ role, content, timestamp }) {
    const isUser = role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} px-4 py-2`}
        >
            {/* Avatar */}
            <div className={`shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center ${isUser ? 'bg-white/10' : 'bg-white/5'}`}>
                {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-[#9CA3AF]" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? 'bg-white/10 text-[#F5F5F5] rounded-tr-none' : 'bg-[#111] border border-white/10 text-[#F5F5F5] rounded-tl-none shadow-sm'}`}>

                {content}
                {timestamp && (
                    <p className="text-[10px] text-[#9CA3AF] mt-1 text-right">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </motion.div>
    )
}
