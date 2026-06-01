import { Navigate, useLocation } from 'react-router-dom'

type ProtectedRouteProps = {
  isAuthenticated: boolean
  children: JSX.Element
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
