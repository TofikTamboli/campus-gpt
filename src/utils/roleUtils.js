export const isFaculty = (profile) => profile?.role === 'faculty'
export const isStudent = (profile) => profile?.role === 'student'
export const isAuthenticated = (profile) => !!profile
export const canCreateEvents = (profile) => isFaculty(profile)
export const canStarProjects = (profile) => isFaculty(profile)
export const canLikeProjects = (profile) => isAuthenticated(profile)

/**
 * Returns a toast-friendly reason string when permission is denied.
 * Usage: if (!canStarProjects(profile)) toast.error(permissionDeniedMsg('star projects'))
 */
export const permissionDeniedMsg = (action) =>
    `Only faculty members can ${action}. Please sign in as faculty.`
