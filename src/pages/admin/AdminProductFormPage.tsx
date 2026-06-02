import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getProductById,
  createProduct,
  updateProduct,
} from '../../services/supabase/productService'
import {
  uploadProductImages,
  getImagesByProduct,
  setImageAsPrimary,
  deleteProductImage,
} from '../../services/supabase/productImageService'
import type { Product, ProductImage } from '../../types/product'
import { logger } from '../../utils/logger'

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Omit<Product, 'id' | 'created_at' | 'updated_at'>>({
    identifier: '',
    barcode: '',
    name: '',
    description: '',
    price: 0,
    offer_percentage: 0,
    available: true,
    active: true,
  })

  const [images, setImages] = useState<ProductImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deletingImage, setDeletingImage] = useState<string | null>(null)
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing) {
      setLoading(false)
      return
    }

    const loadProduct = async () => {
      try {
        const { data, error: err } = await getProductById(id)
        if (err) throw err
        if (!data) {
          setError('Producto no encontrado')
          return
        }

        setForm(data)

        const { data: imagesData, error: imagesErr } = await getImagesByProduct(id)
        if (imagesErr) throw imagesErr
        setImages(imagesData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, isEditing])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? parseFloat(value) :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (!isEditing || !id) {
      alert('Por favor, guarda el producto primero antes de subir imágenes')
      return
    }

    setUploadingImages(true)
    try {
      const results = await uploadProductImages(id, Array.from(files), images.length === 0)

      const successful = results.filter((r) => r.success)
      if (successful.length > 0) {
        // Recargar imágenes
        const { data: imagesData } = await getImagesByProduct(id)
        setImages(imagesData || [])
        alert(`${successful.length} imagen(s) subida(s) exitosamente`)
      }

      const failed = results.filter((r) => !r.success)
      if (failed.length > 0) {
        const errorMessages = failed
          .map((r, i) => {
            const err = (r as { success: false; error: unknown }).error
            const msg = err instanceof Error ? err.message : (err as any)?.message ?? JSON.stringify(err)
            return `Imagen ${i + 1}: ${msg}`
          })
          .join('\n')
        logger.error('[handleImageUpload] Imágenes fallidas:', failed)
        alert(`${failed.length} imagen(s) falló al subir:\n\n${errorMessages}`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir imágenes')
    } finally {
      setUploadingImages(false)
      // Limpiar input
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return

    setDeletingImage(imageId)
    try {
      const { error } = await deleteProductImage(imageId, imageUrl)
      if (error) throw error
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      alert('Imagen eliminada')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar imagen')
    } finally {
      setDeletingImage(null)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    setSettingPrimary(imageId)
    try {
      const { error } = await setImageAsPrimary(imageId, id!)
      if (error) throw error
      
      // Actualizar estado local
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al establecer imagen principal')
    } finally {
      setSettingPrimary(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (!form.name || !form.identifier || form.price <= 0) {
        throw new Error('Por favor, completa todos los campos requeridos')
      }

      if (isEditing && id) {
        const { error: err } = await updateProduct(id, form)
        if (err) throw err
        alert('Producto actualizado exitosamente')
        navigate('/admin/productos')
      } else {
        const { data, error: err } = await createProduct(form)
        if (err) throw err
        if (data) {
          alert('Producto creado. Ahora puedes añadir imágenes.')
          navigate(`/admin/productos/${data.id}/editar`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing ? 'Modifica los datos del producto' : 'Crea un nuevo producto en el catálogo'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
          {/* Información básica */}
          <div className="border-b pb-6">
            <h3 className="mb-4 font-semibold text-slate-900">Información básica</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Identificador *
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none disabled:bg-slate-50"
                  placeholder="PROD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Código de barras
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={form.barcode || ''}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
                  placeholder="123456789"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
                placeholder="Nombre del producto"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
                placeholder="Descripción del producto"
              />
            </div>
          </div>

          {/* Precios y ofertas */}
          <div className="border-b pb-6">
            <h3 className="mb-4 font-semibold text-slate-900">Precios y ofertas</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  name="offer_percentage"
                  value={form.offer_percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="1"
                  className="mt-1 w-full rounded-md border border-slate-200 px-4 py-2 focus:border-slate-900 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
            {form.offer_percentage > 0 && (
              <div className="mt-4 rounded-md bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  Precio con descuento: ${Math.round(form.price * (1 - form.offer_percentage / 100)).toLocaleString('es-CL')}
                </p>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="pb-6">
            <h3 className="mb-4 font-semibold text-slate-900">Estado</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-200 text-slate-900"
                />
                <span className="text-sm text-slate-700">Disponible para compra</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-200 text-slate-900"
                />
                <span className="text-sm text-slate-700">Visible en el catálogo público</span>
              </label>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        {isEditing && (
          <div className="rounded-xl bg-white p-4 shadow-sm space-y-6 sm:p-6">
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Imágenes del producto</h3>
              <p className="text-sm text-slate-600 mb-4">
                {images.length} imagen(s) cargada(s)
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.image_url}
                      alt="Product"
                      className="aspect-square rounded-md object-cover border-2 border-slate-200"
                    />
                    {img.is_primary && (
                      <div className="absolute top-2 left-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white font-semibold">
                        Principal
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-md transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          disabled={settingPrimary === img.id}
                          className="bg-white text-slate-900 px-2 py-1 rounded text-xs font-semibold hover:bg-slate-100 disabled:opacity-50"
                        >
                          {settingPrimary === img.id ? '...' : 'Principal'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id, img.image_url)}
                        disabled={deletingImage === img.id}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingImage === img.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">
                  Añadir más imágenes
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="block w-full text-sm text-slate-700 file:rounded-md file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-sm file:font-medium file:cursor-pointer hover:file:bg-slate-300 disabled:opacity-50 disabled:file:cursor-not-allowed"
                />
              </label>
              {uploadingImages && <p className="mt-2 text-sm text-slate-600">Subiendo imágenes...</p>}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || uploadingImages}
            className="rounded-md bg-slate-900 px-6 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            disabled={saving}
            className="rounded-md border border-slate-200 px-6 py-2 text-slate-900 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}