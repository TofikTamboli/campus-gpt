import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,
    authError: null,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setAuthError: (authError) => set({ authError }),

    // Reset auth state
    resetAuth: () => set({ user: null, profile: null, loading: false, authError: null }),
}))
