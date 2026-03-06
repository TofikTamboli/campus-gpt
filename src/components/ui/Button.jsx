import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Button = forwardRef(({
    children,
    variant = 'default',
    size = 'md',
    className,
    disabled,
    ...props
}, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const variants = {
        default: 'bg-transparent border border-white/20 text-[#F5F5F5] hover:bg-white/5 hover:border-white/30',
        solid: 'bg-white text-black hover:bg-gray-100',
        ghost: 'bg-transparent text-[#9CA3AF] hover:text-white hover:bg-white/5',
        danger: 'bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10',
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4 text-sm rounded-xl',
        lg: 'h-12 px-6 text-sm rounded-xl',
        icon: 'h-8 w-8 rounded-lg',
    }

    return (
        <button
            ref={ref}
            disabled={disabled}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = 'Button'
export default Button
