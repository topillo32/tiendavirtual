import { Outlet, Link, useLocation } from 'react-router-dom'

export function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <span className="text-xl font-black tracking-tight">
              Casilla<span className="text-amber-400">Store</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              to="/productos"
              className={`rounded-lg px-4 py-2 transition ${
                pathname === '/productos'
                  ? 'bg-amber-400/10 text-amber-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              Catálogo
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-zinc-800 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-3">
            {/* Marca */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎲</span>
                <span className="text-lg font-black">Casilla<span className="text-amber-400">Store</span></span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Tu tienda de juegos de mesa y piezas impresas en 3D. Cada producto hecho con pasión y detalle.
              </p>
            </div>

            {/* Navegación */}
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-400">Tienda</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="/" className="transition hover:text-amber-400">Inicio</Link></li>
                <li><Link to="/productos" className="transition hover:text-amber-400">Catálogo completo</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-400">Información</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>🎲 Juegos de mesa para toda la familia</li>
                <li>🖨️ Impresiones 3D personalizadas</li>
                <li>✨ Productos únicos y artesanales</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} CasillaStore · Todos los derechos reservados.</p>
            <Link to="/admin/login" className="text-zinc-600 transition hover:text-zinc-400">
              Acceso administrador
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
