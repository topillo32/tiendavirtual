export function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="mt-1 text-sm text-slate-600">Lista de productos para administrar el catálogo.</p>
        </div>
        <a href="/admin/productos/nuevo" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Nuevo producto
        </a>
      </header>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Aquí se mostrará el listado de productos con acciones de editar, activar/desactivar y eliminar.</p>
      </div>
    </div>
  )
}
