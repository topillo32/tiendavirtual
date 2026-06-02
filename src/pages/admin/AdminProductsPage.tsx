import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllProducts,
  deleteProduct,
  toggleProductActive,
  toggleProductAvailable,
} from '../../services/supabase/productService'
import type { Product } from '../../types/product'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setError(null)
      const { data, error: err } = await getAllProducts()
      if (err) throw err
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    setDeleting(id)
    try {
      const { error } = await deleteProduct(id)
      if (error) throw error
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await toggleProductActive(id, !active)
      if (error) throw error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !active } : p))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  const handleToggleAvailable = async (id: string, available: boolean) => {
    try {
      const { error } = await toggleProductAvailable(id, !available)
      if (error) throw error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, available: !available } : p))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.identifier.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="mt-1 text-slate-600">Cargando...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Productos</h1>
          <p className="mt-1 text-sm text-slate-600">
            {filteredProducts.length} producto(s) en total
          </p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Nuevo producto
        </Link>
      </header>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o identificador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-slate-600 py-8">No hay productos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="pb-3 font-semibold">Nombre</th>
                  <th className="pb-3 font-semibold">Identificador</th>
                  <th className="pb-3 font-semibold">Precio</th>
                  <th className="pb-3 font-semibold">Descuento</th>
                  <th className="pb-3 font-semibold">Disponible</th>
                  <th className="pb-3 font-semibold">Activo</th>
                  <th className="pb-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-slate-50">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3 text-slate-600">{product.identifier}</td>
                    <td className="py-3">${Math.round(product.price).toLocaleString('es-CL')}</td>
                    <td className="py-3">
                      {product.offer_percentage > 0 ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                          {product.offer_percentage}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          handleToggleAvailable(product.id, product.available)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {product.available ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleActive(product.id, product.active)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.active
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {product.active ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="py-3 space-x-2">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="inline-flex rounded-md bg-slate-200 px-3 py-1 text-xs text-slate-900 hover:bg-slate-300"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="inline-flex rounded-md bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        {deleting === product.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
