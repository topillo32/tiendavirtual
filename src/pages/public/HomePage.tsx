import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getActiveProducts } from '../../services/supabase/productService'
import { ProductCard } from '../../components/ProductCard'
import type { Product, ProductImage } from '../../types/product'

type ProductWithImages = Product & { product_images?: Pick<ProductImage, 'image_url' | 'is_primary'>[] }

export function HomePage() {
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await getActiveProducts()
        setProducts((data || []).slice(0, 6))
      } catch (err) {
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <section className="space-y-20">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
        <img
          src="/banner.png"
          alt="Casilla Store banner"
          className="h-full w-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/40 to-transparent" />

        <div className="absolute inset-0 flex items-center px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎲</span>
              <span className="text-4xl">🖨️</span>
            </div>
            <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight text-white">
              Juegos de mesa<br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                &amp; Impresión 3D
              </span>
            </h1>
            <p className="mt-5 text-lg text-zinc-300">
              Piezas únicas, juegos clásicos y creaciones impresas en 3D. Todo hecho con pasión.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 font-bold text-zinc-900 shadow-lg transition hover:bg-amber-300 hover:shadow-amber-400/30"
              >
                Ver catálogo →
              </Link>
            </div>
          </div>
        </div>

        {/* Badge esquina */}
        <div className="absolute right-8 top-8 hidden rounded-2xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-center backdrop-blur-sm md:block">
          <p className="text-2xl font-black text-amber-400">100%</p>
          <p className="text-xs text-zinc-400">Hecho a mano</p>
        </div>
      </div>

      {/* Categorías */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-amber-400/50">
          <span className="text-5xl">🎲</span>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Juegos de mesa</h3>
            <p className="mt-1 text-sm text-zinc-500">Juegos clásicos, estrategia y diversión para toda la familia.</p>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-amber-400/50">
          <span className="text-5xl">🖨️</span>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Impresión 3D</h3>
            <p className="mt-1 text-sm text-zinc-500">Piezas personalizadas, figuras y accesorios impresos en 3D.</p>
          </div>
        </div>
      </div>

      {/* Productos destacados */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-100">Destacados</h2>
          <Link to="/productos" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-zinc-900">
                <div className="aspect-square rounded-t-2xl bg-zinc-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-zinc-800" />
                  <div className="h-3 w-1/2 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </section>
  )
}
