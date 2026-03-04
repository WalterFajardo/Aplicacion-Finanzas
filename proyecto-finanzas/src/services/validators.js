import { CONFIG } from '@/store/credit'

export const validateDNI = (dni) => {
  const errors = []

  if (!dni || typeof dni !== 'string') {
    errors.push('El DNI es requerido')
    return { isValid: false, errors, warnings: [] }
  }

  const cleanDNI = dni.trim()

  if (cleanDNI.length !== 8) {
    errors.push('El DNI debe tener exactamente 8 dígitos')
  }

  if (!/^\d+$/.test(cleanDNI)) {
    errors.push('El DNI debe contener solo números')
  }

  if (cleanDNI === '00000000') {
    errors.push('El DNI no puede ser 00000000')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  }
}

export const validateIncome = (income) => {
  const errors = []
  const warnings = []

  if (income === undefined || income === null || income === '') {
    errors.push('El ingreso mensual es requerido')
    return { isValid: false, errors, warnings }
  }

  const numIncome = Number(income)

  if (isNaN(numIncome)) {
    errors.push('El ingreso mensual debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (numIncome <= 0) {
    errors.push('El ingreso mensual debe ser mayor a cero')
  }

  // Advertencia si es menor al salario mínimo (S/ 1025 aprox)
  if (numIncome > 0 && numIncome < 1025) {
    warnings.push('El ingreso es menor al salario mínimo vigente')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validatePropertyPrice = (price) => {
  const errors = []
  const warnings = []

  if (price === undefined || price === null || price === '') {
    errors.push('El precio del inmueble es requerido')
    return { isValid: false, errors, warnings }
  }

  const numPrice = Number(price)

  if (isNaN(numPrice)) {
    errors.push('El precio del inmueble debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (numPrice <= 0) {
    errors.push('El precio del inmueble debe ser mayor a cero')
  }

  if (numPrice < 65200) {
    warnings.push('El precio es menor al mínimo típico del programa MiVivienda')
  }

  if (numPrice > 464200) {
    warnings.push('El precio excede el límite típico del programa MiVivienda')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateDownPayment = (downPayment, propertyPrice) => {
  const errors = []
  const warnings = []

  const numDownPayment = Number(downPayment) || 0
  const numPropertyPrice = Number(propertyPrice) || 0

  if (numDownPayment < 0) {
    errors.push('La cuota inicial no puede ser negativa')
  }

  if (numDownPayment > numPropertyPrice) {
    errors.push('La cuota inicial no puede exceder el precio del inmueble')
  }

  // Típicamente MiVivienda requiere 10% mínimo
  const minDownPayment = numPropertyPrice * 0.10
  if (numDownPayment < minDownPayment && numPropertyPrice > 0) {
    warnings.push(`La cuota inicial típica es al menos 10% (S/ ${minDownPayment.toFixed(2)})`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateBonus = (bonus, propertyPrice, downPayment) => {
  const errors = []
  const warnings = []

  const numBonus = Number(bonus) || 0
  const numPropertyPrice = Number(propertyPrice) || 0
  const numDownPayment = Number(downPayment) || 0

  if (numBonus < 0) {
    errors.push('El bono no puede ser negativo')
  }

  if (numBonus > numPropertyPrice) {
    errors.push('El bono no puede exceder el precio del inmueble')
  }

  const capital = numPropertyPrice - numDownPayment - numBonus
  if (capital <= 0 && numPropertyPrice > 0) {
    errors.push('El capital a financiar debe ser mayor a cero')
  }

  // Bono típico máximo de MiVivienda
  if (numBonus > 25700) {
    warnings.push('El bono excede el máximo típico del Bono del Buen Pagador')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateCapital = (capital) => {
  const errors = []
  const warnings = []

  const numCapital = Number(capital)

  if (isNaN(numCapital)) {
    errors.push('El capital debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (numCapital <= 0) {
    errors.push('El capital a financiar debe ser mayor a cero')
  }

  if (numCapital < CONFIG.CAPITAL_MINIMO) {
    errors.push(`El capital mínimo es S/ ${CONFIG.CAPITAL_MINIMO.toLocaleString()}`)
  }

  if (numCapital > CONFIG.CAPITAL_MAXIMO) {
    errors.push(`El capital máximo es S/ ${CONFIG.CAPITAL_MAXIMO.toLocaleString()}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateRate = (rate, type = 'TEA') => {
  const errors = []
  const warnings = []

  const numRate = Number(rate)

  if (isNaN(numRate)) {
    errors.push('La tasa debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (numRate < 0) {
    errors.push('La tasa no puede ser negativa')
  }

  if (numRate === 0) {
    errors.push('La tasa debe ser mayor a cero')
  }

  if (numRate > 100) {
    errors.push('La tasa no puede exceder 100%')
  }

  const minTypical = type === 'TEA' ? 5 : 4
  const maxTypical = type === 'TEA' ? 20 : 18

  if (numRate > 0 && numRate < minTypical) {
    warnings.push(`La tasa es inusualmente baja para un crédito hipotecario`)
  }

  if (numRate > maxTypical) {
    warnings.push(`La tasa es inusualmente alta para un crédito hipotecario`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateTerm = (termMonths) => {
  const errors = []
  const warnings = []

  const numTerm = Number(termMonths)

  if (isNaN(numTerm)) {
    errors.push('El plazo debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (!Number.isInteger(numTerm)) {
    errors.push('El plazo debe ser un número entero de meses')
  }

  if (numTerm <= 0) {
    errors.push('El plazo debe ser mayor a cero')
  }

  if (numTerm < CONFIG.PLAZO_MINIMO_MESES) {
    errors.push(`El plazo mínimo es ${CONFIG.PLAZO_MINIMO_MESES} meses`)
  }

  if (numTerm > CONFIG.PLAZO_MAXIMO_MESES) {
    errors.push(`El plazo máximo es ${CONFIG.PLAZO_MAXIMO_MESES} meses (${CONFIG.PLAZO_MAXIMO_MESES / 12} años)`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateGraceMonths = (graceMonths, termMonths) => {
  const errors = []
  const warnings = []

  const numGrace = Number(graceMonths) || 0
  const numTerm = Number(termMonths) || 0

  if (numGrace < 0) {
    errors.push('Los meses de gracia no pueden ser negativos')
  }

  if (!Number.isInteger(numGrace)) {
    errors.push('Los meses de gracia deben ser un número entero')
  }

  if (numGrace > CONFIG.GRACIA_MAXIMA_MESES) {
    errors.push(`Los meses de gracia no pueden exceder ${CONFIG.GRACIA_MAXIMA_MESES}`)
  }

  if (numGrace >= numTerm && numTerm > 0) {
    errors.push('Los meses de gracia deben ser menores al plazo total')
  }

  if (numGrace > 12) {
    warnings.push('Más de 12 meses de gracia puede incrementar significativamente el costo total')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateCOK = (cok) => {
  const errors = []
  const warnings = []

  const numCOK = Number(cok)

  if (isNaN(numCOK)) {
    errors.push('El COK debe ser un número válido')
    return { isValid: false, errors, warnings }
  }

  if (numCOK < 0) {
    errors.push('El COK no puede ser negativo')
  }

  if (numCOK > 50) {
    errors.push('El COK no puede exceder 50%')
  }

  if (numCOK === 0) {
    warnings.push('Un COK de 0% puede generar resultados de VAN inusuales')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateAllCreditData = (creditData) => {
  const allErrors = []
  const allWarnings = []

  const {
    propertyPrice,
    downPayment,
    bonus,
    annualRate,
    rateType,
    termMonths,
    graceType,
    graceMonths,
    cok
  } = creditData

  const priceValidation = validatePropertyPrice(propertyPrice)
  allErrors.push(...priceValidation.errors)
  allWarnings.push(...priceValidation.warnings)

  const downPaymentValidation = validateDownPayment(downPayment, propertyPrice)
  allErrors.push(...downPaymentValidation.errors)
  allWarnings.push(...downPaymentValidation.warnings)

  const bonusValidation = validateBonus(bonus, propertyPrice, downPayment)
  allErrors.push(...bonusValidation.errors)
  allWarnings.push(...bonusValidation.warnings)

  const capital = Number(propertyPrice) - Number(downPayment || 0) - Number(bonus || 0)
  const capitalValidation = validateCapital(capital)
  allErrors.push(...capitalValidation.errors)
  allWarnings.push(...capitalValidation.warnings)

  // Validar tasa
  const rateValidation = validateRate(annualRate, rateType)
  allErrors.push(...rateValidation.errors)
  allWarnings.push(...rateValidation.warnings)

  // Validar plazo
  const termValidation = validateTerm(termMonths)
  allErrors.push(...termValidation.errors)
  allWarnings.push(...termValidation.warnings)

  // Validar gracia
  if (graceType !== 'NONE') {
    const graceValidation = validateGraceMonths(graceMonths, termMonths)
    allErrors.push(...graceValidation.errors)
    allWarnings.push(...graceValidation.warnings)
  }

  // Validar COK
  const cokValidation = validateCOK(cok)
  allErrors.push(...cokValidation.errors)
  allWarnings.push(...cokValidation.warnings)

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    capital
  }
}
