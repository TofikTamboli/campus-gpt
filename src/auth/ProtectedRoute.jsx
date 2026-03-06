import { Navigate, useLocation } from 'react-router-dom'
import useAuth from './useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ProtectedRoute — guards a route based on auth and role.
 *
 * @param {string[]} allowedRoles - e.g. ['faculty']. Empty = any authenticated user.
 * @param {string} redirectTo - where to send unauthenticated users
 */
export default function ProtectedRoute({
    children,
    allowedRoles = [],
    redirectTo = '/login',
}) {
    const { profile, loading } = useAuth()
    const location = useLocation()

    if (loading) return <LoadingSpinner />

    if (!profile) {
        // Not logged in → redirect to login, remembering where they wanted to go
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
        // Logged in but wrong role
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] p-6">
                <div className="glass-card p-8 max-w-sm text-center border border-white/20 rounded-xl">
                    <div className="text-3xl mb-3">🔒</div>
                    <h2 className="text-lg font-semibold text-white mb-2">Access Restricted</h2>
                    <p className="text-[#9CA3AF] text-sm mb-4">
                        This page is available to{' '}
                        <span className="text-[#7C3AED] font-medium">
                            {allowedRoles.join(', ')}
                        </span>{' '}
                        members only.
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                        Signed in as: <span className="text-white">{profile.role}</span>
                    </p>
                    <Navigate replace to="/" />
                </div>
            </div>
        )
    }

    return children
}
