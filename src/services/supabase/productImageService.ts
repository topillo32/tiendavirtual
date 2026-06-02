import { supabase } from './supabaseClient'
import type { ProductImage } from '../../types/product'
import { logger } from '../../utils/logger'

const bucketName = 'products'

function getPublicImageUrl(path: string) {
  return supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl
}

export async function uploadProductImages(productId: string, files: File[], isPrimary: boolean = false) {
  const uploads = files.map(async (file, index) => {
    try {
      const path = `${productId}/${crypto.randomUUID()}-${file.name}`
      
      // Subir archivo al storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        logger.error(`[uploadProductImages] Storage error para "${file.name}":`, uploadError)
        throw uploadError
      }

      // Obtener URL pública
      const image_url = getPublicImageUrl(path)

      // Debug RLS
      const { data: sessionData } = await supabase.auth.getSession()
      logger.log('[uploadProductImages] Sesión activa:', sessionData?.session?.user?.id ?? 'NO HAY SESIÓN')
      logger.log('[uploadProductImages] Insertando en product_images:', { product_id: productId, image_url, is_primary: isPrimary && index === 0 })

      // Crear registro en base de datos
      const { data: dbData, error: dbError } = await supabase
        .from('product_images')
        .insert([
          {
            product_id: productId,
            image_url,
            is_primary: isPrimary && index === 0,
          },
        ])
        .select()
        .single()

      if (dbError) {
        logger.error(`[uploadProductImages] DB error para "${file.name}":`, dbError)
        throw dbError
      }

      logger.log(`[uploadProductImages] "${file.name}" subida correctamente → ${image_url}`)
      return { success: true, data: dbData }
    } catch (error) {
      logger.error(`[uploadProductImages] Falló "${file.name}":`, error)
      return { success: false, error }
    }
  })

  return Promise.all(uploads)
}

export async function getImagesByProduct(productId: string) {
  return supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('is_primary', { ascending: false })
}

export async function setImageAsPrimary(imageId: string, productId: string) {
  // Desmarcar todas las imágenes como principales
  const { error: updateError } = await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId)

  if (updateError) throw updateError

  // Marcar la nueva imagen como principal
  return supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select()
    .single()
}

export async function deleteProductImage(imageId: string, imageUrl: string) {
  // Extraer el path del URL
  const path = imageUrl.split(`${bucketName}/`)[1]

  // Eliminar del storage
  if (path) {
    await supabase.storage.from(bucketName).remove([path])
  }

  // Eliminar del base de datos
  return supabase.from('product_images').delete().eq('id', imageId)
}
