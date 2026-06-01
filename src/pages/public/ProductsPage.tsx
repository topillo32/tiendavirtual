export function ProductsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Catálogo de productos</h1>
        <p className="mt-1 text-sm text-slate-600">Productos activos disponibles para consulta pública.</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">Listado de productos aquí</div>
      </div>
    </div>
  )
}
