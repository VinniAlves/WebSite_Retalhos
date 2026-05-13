export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return 'R$ 0,00'
  const numberValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numberValue)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue)
}

/**
 * Masks a string or number as BRL currency (e.g. "1234.56" -> "R$ 1.234,56")
 */
export const maskCurrency = (value: string | number): string => {
  const onlyDigits = String(value).replace(/\D/g, '')
  if (!onlyDigits) return 'R$ 0,00'
  
  const numberValue = Number(onlyDigits) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue)
}

/**
 * Unmasks a currency string back to a numeric string (e.g. "R$ 1.234,56" -> "1234.56")
 */
export const unmaskCurrency = (value: string): string => {
  const onlyDigits = value.replace(/\D/g, '')
  if (!onlyDigits) return '0.00'
  return (Number(onlyDigits) / 100).toFixed(2)
}
