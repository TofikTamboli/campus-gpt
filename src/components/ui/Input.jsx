import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(({
    label,
    error,
    className,
    multiline,
    rows = 3,
    ...props
}, ref) => {
    const baseClass = cn(
        'w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#9CA3AF]',
        'focus:outline-none focus:border-white/40 transition-colors duration-200',
        error && 'border-red-500/50',
        className
    )

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs text-[#9CA3AF] font-medium">{label}</label>
            )}
            {multiline ? (
                <textarea
                    ref={ref}
                    rows={rows}
                    className={cn(baseClass, 'resize-none')}
                    {...props}
                />
            ) : (
                <input ref={ref} className={baseClass} {...props} />
            )}
            {error && (
                <span className="text-xs text-red-400">{error}</span>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
