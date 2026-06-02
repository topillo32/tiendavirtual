import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../services/supabase/productService'
import { getImagesByProduct } from '../../services/supabase/productImageService'
import { formatPrice } from '../../utils/price'
import type { Product, ProductImage } from '../../types/product'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [primaryImage, setPrimaryImage] = useState<ProductImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Producto no encontrado')
        setLoading(false)
        return
      }

      try {
        const { data, error: productError } = await getProductById(id)
        if (productError) throw productError
        if (!data) {
          setError('Producto no encontrado')
          return
        }

        setProduct(data)

        const { data: imagesData, error: imagesError } = await getImagesByProduct(id)
        if (imagesError) throw imagesError

        if (imagesData && imagesData.length > 0) {
          setImages(imagesData)
          const primary = imagesData.find((img) => img.is_primary)
          setPrimaryImage(primary || imagesData[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-5 w-32 rounded bg-zinc-800" />
        <div className="grid gap-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-zinc-800" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <span className="text-5xl">🎲</span>
        <h1 className="mt-4 text-xl font-bold text-zinc-100">Producto no encontrado</h1>
        <p className="mt-2 text-zinc-500">{error}</p>
        <button
          onClick={() => navigate('/productos')}
          className="mt-6 rounded-xl bg-amber-400 px-6 py-2.5 font-bold text-zinc-900 hover:bg-amber-300"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  const discountedPrice = product.price * (1 - product.offer_percentage / 100)

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/productos')}
        className="flex items-center gap-1 text-sm font-medium text-zinc-500 transition hover:text-amber-400"
      >
        ← Volver al catálogo
      </button>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Imágenes */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-xl bg-zinc-800">
              {primaryImage ? (
                <img
                  src={primaryImage.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-7xl opacity-20">🎲</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setPrimaryImage(img)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                      primaryImage?.id === img.id
                        ? 'border-amber-400'
                        : 'border-transparent hover:border-zinc-600'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-100">{product.name}</h1>
              <p className="mt-3 leading-relaxed text-zinc-400">{product.description}</p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
              {product.offer_percentage > 0 ? (
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-lg text-zinc-500 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-zinc-900">
                    -{product.offer_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl sm:text-4xl font-black text-amber-400">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                  product.available
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${
                  product.available ? 'bg-emerald-400' : 'bg-zinc-600'
                }`} />
                {product.available ? 'Disponible' : 'Agotado'}
              </span>
            </div>

            <button
              disabled={!product.available}
              className="mt-auto w-full rounded-xl bg-amber-400 py-3.5 font-black text-zinc-900 shadow-lg transition hover:bg-amber-300 hover:shadow-amber-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.available ? 'Agregar al carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
