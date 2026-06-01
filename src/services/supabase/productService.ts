import { supabase } from './supabaseClient'
import type { Product } from '../../types/product'

export async function getActiveProducts() {
  return supabase
    .from('products')
    .select('*')
    .eq('active', true)
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
