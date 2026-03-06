import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, GraduationCap, BookOpen, LogIn } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import { IS_MOCK_AUTH } from '../api/supabaseClient'
import toast from 'react-hot-toast'
import Footer from '../components/layout/Footer'

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
    fullName: z.string().min(2, 'Name is required'),
    role: z.enum(['student', 'faculty']),
})

const mockSchema = z.object({
    role: z.enum(['student', 'faculty']).default('student'),
    email: z.string().optional(),
    password: z.string().optional(),
})

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { signInWithEmail, signUpWithEmail, mockSignIn, isMockMode } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const from = location.state?.from?.pathname || '/'

    // If in mock mode, use a schema that doesn't require email/password
    const schema = isMockMode ? mockSchema : (isSignUp ? signupSchema : loginSchema)

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { role: 'student' }
    })

    const onSubmit = async (data) => {
        console.log('[LoginPage] onSubmit hit with data:', data)
        if (isMockMode) {
            mockSignIn(data.role || 'student')
            toast.success(`Signed in as ${data.role || 'student'} (mock mode)`)
            navigate(from, { replace: true })
            return
        }

        if (isSignUp) {
            const { error } = await signUpWithEmail(data.email, data.password, data.fullName, data.role)
            if (error) { toast.error(error); return }
            toast.success('Account created! Please verify your email.')
        } else {
            const { error } = await signInWithEmail(data.email, data.password)
            if (error) { toast.error(error); return }
            navigate(from, { replace: true })
        }
    }

    const inputClass =
        'w-full h-12 bg-transparent border border-white/20 rounded-xl px-4 text-sm text-[#F5F5F5] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED]/60 transition-colors'

    return (
        <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full max-w-sm"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-white/20 bg-[#111] mb-3">
                            <GraduationCap size={22} className="text-[#7C3AED]" />
                        </div>
                        <h1 className="text-xl font-semibold text-white">Campus GPT</h1>
                        <p className="text-sm text-[#9CA3AF] mt-1">
                            {isSignUp ? 'Create your account' : 'Sign in to continue'}
                        </p>
                    </div>

                    {/* Mock dev mode banner */}
                    {isMockMode && (
                        <div className="mb-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-xs text-yellow-400 text-center">
                            🧪 <strong>Dev Mock Mode</strong> — choose your role to log in without Supabase
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        {/* Role Selector (signup / mock) */}
                        {(isSignUp || isMockMode) && (
                            <div className="flex gap-2">
                                {['student', 'faculty'].map((r) => (
                                    <label
                                        key={r}
                                        className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm cursor-pointer transition-colors ${watch('role') === r
                                            ? r === 'faculty'
                                                ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                                                : 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]'
                                            : 'border-white/20 text-[#9CA3AF]'
                                            }`}
                                    >
                                        <input type="radio" value={r} {...register('role')} className="sr-only" />
                                        {r === 'faculty' ? <GraduationCap size={14} /> : <BookOpen size={14} />}
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </label>
                                ))}
                            </div>
                        )}

                        {isSignUp && (
                            <div>
                                <input {...register('fullName')} placeholder="Full name" className={inputClass} />
                                {errors.fullName && <span className="text-xs text-red-400 mt-1 block">{errors.fullName.message}</span>}
                            </div>
                        )}

                        {!isMockMode && (
                            <>
                                <div>
                                    <input {...register('email')} type="email" placeholder="Email" className={inputClass} />
                                    {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email.message}</span>}
                                </div>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className={`${inputClass} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                    {errors.password && <span className="text-xs text-red-400 mt-1 block">{errors.password.message}</span>}
                                </div>
                            </>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 w-full rounded-xl bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            <LogIn size={15} />
                            {isMockMode ? 'Enter as Selected Role' : isSignUp ? 'Create Account' : 'Sign In'}
                        </motion.button>

                        {!isMockMode && (
                            <p className="text-center text-xs text-[#9CA3AF]">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp((v) => !v)}
                                    className="text-[#7C3AED] hover:underline"
                                >
                                    {isSignUp ? 'Sign in' : 'Sign up'}
                                </button>
                            </p>
                        )}
                    </form>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}
