import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SAMPLE_PROJECTS = [
    {
        id: 'proj-1',
        title: 'Project Tubmail',
        description: 'A campus email management system for students.',
        thumbnail: null,
        repoLink: 'https://github.com',
        liveLink: 'https://example.com',
        stars: 12,
        likes: 24,
        author: 'Student A',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'proj-2',
        title: 'Project Tubmail',
        description: 'Real-time collaborative notes for study groups.',
        thumbnail: null,
        repoLink: 'https://github.com',
        liveLink: 'https://example.com',
        stars: 8,
        likes: 19,
        author: 'Student B',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'proj-3',
        title: 'Project Tubmail',
        description: 'AI-powered quiz generator from lecture slides.',
        thumbnail: null,
        repoLink: 'https://github.com',
        liveLink: 'https://example.com',
        stars: 15,
        likes: 32,
        author: 'Student C',
        createdAt: new Date().toISOString(),
    },
]

export const useProjectStore = create(
    persist(
        (set, get) => ({
            projects: SAMPLE_PROJECTS,
            searchQuery: '',

            addProject: (project) => {
                const newProject = {
                    ...project,
                    id: `proj-${Date.now()}`,
                    stars: 0,
                    likes: 0,
                    createdAt: new Date().toISOString(),
                }
                set((state) => ({ projects: [newProject, ...state.projects] }))
            },

            toggleStar: (id) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, stars: p.starred ? p.stars - 1 : p.stars + 1, starred: !p.starred } : p
                    ),
                }))
            },

            toggleLike: (id) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p
                    ),
                }))
            },

            setSearchQuery: (q) => set({ searchQuery: q }),

            getFilteredProjects: () => {
                const { projects, searchQuery } = get()
                if (!searchQuery) return projects
                const q = searchQuery.toLowerCase()
                return projects.filter(
                    (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
                )
            },
        }),
        { name: 'campus-gpt-project-store' }
    )
)
