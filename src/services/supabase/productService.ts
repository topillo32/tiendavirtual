import { supabase } from './supabaseClient'
import type { Product } from '../../types/product'

export async function getActiveProducts() {
  return supabase
    .from('products')
    .select('*, product_images(image_url, is_primary)')
    .eq('active', true)
    .order('name', { ascending: true })
}

export async function getAllProducts() {
  return supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })
}

export async function getProductById(id: string) {
  return supabase.from('products').select('*').eq('id', id).single()
}

export async function searchProducts(query: string) {
  return supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .eq('active', true)
    .order('name', { ascending: true })
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('products').insert([product]).select().single()
}

export async function updateProduct(id: string, product: Partial<Product>) {
  return supabase
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteProduct(id: string) {
  return supabase.from('products').delete().eq('id', id)
}

export async function toggleProductActive(id: string, active: boolean) {
  return updateProduct(id, { active })
}

export async function toggleProductAvailable(id: string, available: boolean) {
  return updateProduct(id, { available })
}
