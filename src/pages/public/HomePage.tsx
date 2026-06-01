import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Bienvenido a Casilla Store</h1>
        <p className="mt-3 text-slate-600">
          Catálogo público de productos para tu tienda. Navega con facilidad y encuentra lo que necesitas.
        </p>
        <Link to="/productos" className="mt-6 inline-flex rounded-md bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
          Ver catálogo
        </Link>
      </div>
    </section>
  )
}
