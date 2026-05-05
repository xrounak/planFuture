import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { AuthPage } from './AuthPage'

import { PlanPage } from './PlanPage'
import { ReviewPage } from './ReviewPage'
import { GlobalFeedPage } from './GlobalFeedPage'
import { LeaderboardPage } from './LeaderboardPage'
import { ProfilePage } from './ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/plan" replace />
      },
      {
        path: 'plan',
        element: <ProtectedRoute><PlanPage /></ProtectedRoute>
      },
      {
        path: 'review',
        element: <ProtectedRoute><ReviewPage /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: 'profile/:username',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: 'feed',
        element: <GlobalFeedPage />
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />
      }
    ]
  }
])
