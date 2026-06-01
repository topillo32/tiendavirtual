import { Outlet, Link } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="text-lg font-semibold">
            Casilla Store
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link to="/productos" className="hover:text-slate-900">
              Catálogo
            </Link>
            <a href="/admin/login" className="hover:text-slate-900">
              Administrador
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
