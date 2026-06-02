import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { signOut } from '../services/supabase/authService'

export function AdminLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      navigate('/admin/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/admin/productos" className="text-lg font-semibold text-slate-900">
              Casilla Store Admin
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700 sm:gap-4">
            <Link to="/" target="_blank" className="flex items-center gap-1 rounded-md bg-amber-100 px-3 py-2 font-medium text-amber-900 hover:bg-amber-200 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:bg-transparent sm:hover:text-amber-600">
              Ver tienda <span className="text-xs">↗</span>
            </Link>
            <Link to="productos" className="rounded-md bg-slate-100 px-3 py-2 font-medium hover:bg-slate-200 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:bg-transparent sm:hover:text-slate-900">
              Catálogo
            </Link>
            <Link to="productos/nuevo" className="rounded-md bg-slate-100 px-3 py-2 font-medium hover:bg-slate-200 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:bg-transparent sm:hover:text-slate-900">
              Nuevo
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="ml-auto rounded-md bg-slate-900 px-3 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50 sm:px-4"
            >
              {loading ? 'Saliendo...' : 'Salir'}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
