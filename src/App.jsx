import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ProtectedRoute from './auth/ProtectedRoute'

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddProjectPage = lazy(() => import('./pages/AddProjectPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const EventCreatePage = lazy(() => import('./pages/EventCreatePage'))

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#F5F5F5',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#06B6D4', secondary: '#111' } },
            error: { iconTheme: { primary: '#F87171', secondary: '#111' } },
          }}
        />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected: any authenticated user */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-project"
              element={
                <ProtectedRoute>
                  <AddProjectPage />
                </ProtectedRoute>
              }
            />

            {/* Protected: faculty only */}
            <Route
              path="/events/create"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <EventCreatePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
