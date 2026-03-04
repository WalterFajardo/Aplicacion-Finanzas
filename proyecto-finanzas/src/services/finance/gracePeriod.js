import { calculateInterest } from './frenchMethod'

export const GRACE_TYPES = {
  NONE: 'NONE',       // Sin gracia
  PARTIAL: 'PARTIAL', // Gracia parcial (pago de intereses)
  TOTAL: 'TOTAL'      // Gracia total (capitalización)
}

export const processPartialGrace = (balance, monthlyRate) => {
  const interest = calculateInterest(balance, monthlyRate)

  return {
    graceType: GRACE_TYPES.PARTIAL,
    payment: interest,           // Solo se paga el interés
    interest: interest,
    amortization: 0,             // No hay amortización
    capitalizedInterest: 0,      // No hay capitalización
    newBalance: balance,         // El saldo no cambia
    description: 'Período de gracia parcial: pago de intereses únicamente'
  }
}

export const processTotalGrace = (balance, monthlyRate) => {
  const interest = calculateInterest(balance, monthlyRate)
  const newBalance = balance + interest  // Capitalización del interés

  return {
    graceType: GRACE_TYPES.TOTAL,
    payment: 0,                  // No se paga cuota (solo seguros aparte)
    interest: 0,                 // El interés no se "paga", se capitaliza
    amortization: 0,             // No hay amortización
    capitalizedInterest: interest, // Interés que se suma al saldo
    newBalance: newBalance,      // El saldo aumenta
    description: 'Período de gracia total: intereses capitalizados al saldo'
  }
}

export const processNoGrace = () => {
  return {
    graceType: GRACE_TYPES.NONE,
    isNormalPeriod: true,
    description: 'Período de amortización normal (Método Francés)'
  }
}

export const processGracePeriod = (graceType, balance, monthlyRate, currentPeriod, graceMonths) => {
  // Validar que estamos dentro del período de gracia
  const isInGracePeriod = currentPeriod <= graceMonths

  if (!isInGracePeriod || graceType === GRACE_TYPES.NONE) {
    return processNoGrace()
  }

  switch (graceType) {
    case GRACE_TYPES.PARTIAL:
      return processPartialGrace(balance, monthlyRate)

    case GRACE_TYPES.TOTAL:
      return processTotalGrace(balance, monthlyRate)

    default:
      throw new Error(`Tipo de gracia no reconocido: ${graceType}`)
  }
}

export const calculateBalanceAfterTotalGrace = (initialBalance, monthlyRate, graceMonths) => {
  if (graceMonths <= 0) {
    return initialBalance
  }

  // Saldo = Principal × (1 + i)^n
  const capitalizationFactor = Math.pow(1 + monthlyRate, graceMonths)
  const finalBalance = initialBalance * capitalizationFactor

  return finalBalance
}

export const calculateCapitalizedInterest = (initialBalance, monthlyRate, graceMonths) => {
  const finalBalance = calculateBalanceAfterTotalGrace(initialBalance, monthlyRate, graceMonths)
  return finalBalance - initialBalance
}

export const calculatePartialGraceInterest = (balance, monthlyRate, graceMonths) => {
  const monthlyInterest = balance * monthlyRate
  return monthlyInterest * graceMonths
}
