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
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link to="/admin/productos" className="text-lg font-semibold">
              Casilla Store Admin
            </Link>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link to="productos" className="hover:text-slate-900">
              Productos
            </Link>
            <Link to="productos/nuevo" className="hover:text-slate-900">
              Nuevo producto
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
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
