import { useEffect, useCallback } from 'react'
import { supabase, IS_MOCK_AUTH } from '../api/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'

// =====================================================
// MOCK AUTH (dev mode when VITE_SUPABASE_URL=mock)
// Stores user and role in localStorage — NOT for production.
// =====================================================
const MOCK_PROFILES = {
    student: { id: 'mock-student-id', full_name: 'Demo Student', role: 'student', email: 'student@campus.dev' },
    faculty: { id: 'mock-faculty-id', full_name: 'Prof. Demo', role: 'faculty', email: 'faculty@campus.dev' },
}

function getMockAuth() {
    try {
        const raw = localStorage.getItem('campus-gpt-mock-auth')
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}
function setMockAuth(profile) {
    if (profile) localStorage.setItem('campus-gpt-mock-auth', JSON.stringify(profile))
    else localStorage.removeItem('campus-gpt-mock-auth')
}

// =====================================================
// useAuth — primary auth hook
// Handles both Supabase and mock-dev mode.
// Uses a global zustand store to keep state in sync across components.
// =====================================================
export default function useAuth() {
    const {
        user, setUser,
        profile, setProfile,
        loading, setLoading,
        authError, setAuthError,
        resetAuth
    } = useAuthStore()

    // ─── MOCK MODE ───────────────────────────────────
    useEffect(() => {
        if (!IS_MOCK_AUTH) return
        const saved = getMockAuth()
        if (saved) {
            setUser({ id: saved.id, email: saved.email })
            setProfile(saved)
        }
        setLoading(false)
    }, [setUser, setProfile, setLoading])

    // ─── REAL SUPABASE MODE ───────────────────────────
    useEffect(() => {
        if (IS_MOCK_AUTH) return

        let subscription

        const fetchProfile = async (userId) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', userId)
                .single()
            if (error) console.error('[useAuth] Profile fetch error:', error.message)
            return data
        }

        const initAuth = async () => {
            // Supabase v2 API
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                const p = await fetchProfile(session.user.id)
                setProfile(p)
            }
            setLoading(false)
        }

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)
                const p = await fetchProfile(session.user.id)
                setProfile(p)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        subscription = data?.subscription
        initAuth()
        return () => subscription?.unsubscribe()
    }, [setUser, setProfile, setLoading])

    // ─── AUTH ACTIONS ─────────────────────────────────

    /** Mock: sign in as student or faculty (dev only) */
    const mockSignIn = useCallback((role = 'student') => {
        console.log('[useAuth] mockSignIn called for role:', role)
        const p = MOCK_PROFILES[role] || MOCK_PROFILES.student
        setMockAuth(p)
        setUser({ id: p.id, email: p.email })
        setProfile(p)
        setLoading(false)
    }, [setUser, setProfile, setLoading])

    const mockSignOut = useCallback(() => {
        setMockAuth(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
    }, [setUser, setProfile, setLoading])

    /** Real Supabase: email sign in */
    const signInWithEmail = useCallback(async (email, password) => {
        if (IS_MOCK_AUTH) return console.warn('[useAuth] Mock mode — use mockSignIn()')
        setAuthError(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setAuthError(error.message)
        return { error }
    }, [setAuthError])

    /** Real Supabase: email sign up */
    const signUpWithEmail = useCallback(async (email, password, fullName, role = 'student') => {
        if (IS_MOCK_AUTH) return console.warn('[useAuth] Mock mode — use mockSignIn()')
        setAuthError(null)
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) { setAuthError(error.message); return { error } }

        // Insert profile row after signup
        if (data?.user) {
            await supabase.from('profiles').insert([
                { id: data.user.id, full_name: fullName, role }
            ])
        }
        return { data, error: null }
    }, [setAuthError])

    const signOut = useCallback(async () => {
        if (IS_MOCK_AUTH) { mockSignOut(); return }
        await supabase.auth.signOut()
        resetAuth()
    }, [mockSignOut, resetAuth])

    return {
        user,
        profile,
        loading,
        authError,
        isMockMode: IS_MOCK_AUTH,
        // Actions
        signInWithEmail,
        signUpWithEmail,
        signOut,
        // Dev-only mock
        mockSignIn,
        mockSignOut,
    }
}

