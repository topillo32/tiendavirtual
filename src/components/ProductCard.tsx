import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/price'
import type { Product, ProductImage } from '../types/product'

type ProductWithImages = Product & { product_images?: Pick<ProductImage, 'image_url' | 'is_primary'>[] }

export function ProductCard({ product }: { product: ProductWithImages }) {
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ??
    product.product_images?.[0]?.image_url

  const finalPrice = product.offer_percentage > 0
    ? product.price * (1 - product.offer_percentage / 100)
    : null

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/5"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl opacity-30">🎲</span>
          </div>
        )}
        {product.offer_percentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-zinc-900 shadow">
            -{product.offer_percentage}%
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-xl border border-zinc-600 bg-zinc-900/90 px-4 py-2 text-sm font-bold text-zinc-300">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-zinc-100 line-clamp-1">{product.name}</h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          {finalPrice ? (
            <>
              <span className="text-lg font-black text-amber-400">{formatPrice(finalPrice)}</span>
              <span className="text-sm text-zinc-600 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-lg font-black text-amber-400">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
      {/* Borde glow en hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-amber-400/50 transition group-hover:opacity-100" />
    </Link>
  )
}
