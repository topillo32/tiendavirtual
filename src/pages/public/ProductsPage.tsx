import { useEffect, useState } from 'react'
import { getActiveProducts } from '../../services/supabase/productService'
import { ProductCard } from '../../components/ProductCard'
import type { Product, ProductImage } from '../../types/product'

type ProductWithImages = Product & { product_images?: Pick<ProductImage, 'image_url' | 'is_primary'>[] }

export function ProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await getActiveProducts()
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-100">
          Catálogo <span className="text-amber-400">🎲🖨️</span>
        </h1>
        <p className="mt-1 text-zinc-500">Juegos de mesa e impresiones 3D disponibles.</p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Skeleton */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900">
              <div className="aspect-square rounded-t-2xl bg-zinc-800" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        filtered.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-5xl">🎲</span>
            <p className="mt-4 text-lg font-bold text-zinc-400">No se encontraron productos</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-sm text-amber-400 hover:underline">
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-600">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  )
}
