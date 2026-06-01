import { supabase } from './supabaseClient'
import type { ProductImage } from '../../types/product'

const bucketName = 'product-images'

export async function uploadProductImages(productId: string, files: File[]) {
  const uploads = files.map(async (file) => {
    const path = `${productId}/${crypto.randomUUID()}-${file.name}`
    const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    return { data, error, path }
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
