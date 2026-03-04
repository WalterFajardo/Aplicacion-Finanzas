import { CONFIG } from '@/store/credit'

export const calculateFrenchPayment = (principal, monthlyRate, periods) => {
  if (typeof principal !== 'number' || isNaN(principal)) {
    throw new Error('El principal debe ser un número válido')
  }

  if (typeof monthlyRate !== 'number' || isNaN(monthlyRate)) {
    throw new Error('La tasa mensual debe ser un número válido')
  }

  if (typeof periods !== 'number' || isNaN(periods) || !Number.isInteger(periods)) {
    throw new Error('El número de periodos debe ser un entero válido')
  }

  if (principal < 0) {
    throw new Error('El principal no puede ser negativo')
  }

  if (monthlyRate < 0) {
    throw new Error('La tasa mensual no puede ser negativa')
  }

  if (periods <= 0) {
    throw new Error('El número de periodos debe ser mayor a cero')
  }

  // Caso especial: préstamo sin intereses
  if (monthlyRate === 0) {
    return principal / periods
  }

  // Caso especial: capital cero
  if (principal === 0) {
    return 0
  }

  const onePlusRate = 1 + monthlyRate
  const powerTerm = Math.pow(onePlusRate, periods)

  if (!isFinite(powerTerm)) {
    throw new Error('Desborde numérico: la combinación de tasa y plazo excede los límites de cálculo')
  }

  const numerator = principal * monthlyRate * powerTerm
  const denominator = powerTerm - 1

  if (Math.abs(denominator) < Number.EPSILON) {
    // Cuando (1+i)^n ≈ 1, usar aproximación lineal
    return principal / periods
  }

  const payment = numerator / denominator

  return payment
}

export const calculateInterest = (balance, monthlyRate) => {
  if (balance < 0) {
    throw new Error('El saldo no puede ser negativo')
  }

  if (monthlyRate < 0) {
    throw new Error('La tasa no puede ser negativa')
  }

  return balance * monthlyRate
}

export const calculateAmortization = (payment, interest) => {
  const amortization = payment - interest

  // La amortización no debería ser negativa en un préstamo estándar
  // Esto podría indicar un error en los cálculos previos
  if (amortization < -Number.EPSILON) {
    console.warn('Advertencia: Amortización negativa detectada. Verificar parámetros del préstamo.')
  }

  return amortization
}

export const calculateNewBalance = (previousBalance, amortization) => {
  const newBalance = previousBalance - amortization

  return Math.max(0, newBalance)
}

export const validateLoanParameters = (principal, monthlyRate, periods) => {
  const errors = []

  if (principal <= 0) {
    errors.push('El capital debe ser mayor a cero')
  }

  if (principal > CONFIG.CAPITAL_MAXIMO) {
    errors.push(`El capital excede el máximo permitido (S/ ${CONFIG.CAPITAL_MAXIMO.toLocaleString()})`)
  }

  if (monthlyRate < 0) {
    errors.push('La tasa mensual no puede ser negativa')
  }

  if (periods <= 0) {
    errors.push('El plazo debe ser mayor a cero')
  }

  if (periods > CONFIG.PLAZO_MAXIMO_MESES) {
    errors.push(`El plazo excede el máximo permitido (${CONFIG.PLAZO_MAXIMO_MESES} meses)`)
  }

  if (errors.length === 0) {
    try {
      const testPayment = calculateFrenchPayment(principal, monthlyRate, periods)
      if (!isFinite(testPayment)) {
        errors.push('Los parámetros generan un cálculo inválido')
      }
    } catch (e) {
      errors.push(e.message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
