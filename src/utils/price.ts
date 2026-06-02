export function calculateFinalPrice(price: number, offerPercentage: number) {
  if (offerPercentage <= 0) {
    return price
  }

  const discount = (price * offerPercentage) / 100
  return Math.max(0, price - discount)
}

export function formatPrice(price: number) {
  return '$' + Math.round(price).toLocaleString('es-CL')
}
