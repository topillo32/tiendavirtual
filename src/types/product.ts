export type Product = {
  id: string
  identifier: string
  barcode: string
  name: string
  description: string
  price: number
  offer_percentage: number
  available: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  created_at: string
}
