import { CONFIG } from '@/store/credit'

export const calculateDesgravamen = (balance, rate = CONFIG.TASA_SEGURO_DESGRAVAMEN) => {
  if (balance < 0) {
    throw new Error('El saldo no puede ser negativo para calcular desgravamen')
  }

  if (rate < 0) {
    throw new Error('La tasa del seguro no puede ser negativa')
  }

  return balance * rate
}

export const calculatePropertyInsurance = (balance, rate = CONFIG.TASA_SEGURO_INMUEBLE) => {
  if (balance < 0) {
    throw new Error('El saldo no puede ser negativo para calcular seguro de inmueble')
  }

  if (rate < 0) {
    throw new Error('La tasa del seguro no puede ser negativa')
  }

  return balance * rate
}

export const calculateAllInsurance = (balance, rates = {}) => {
  const desgravamenRate = rates.desgravamen ?? CONFIG.TASA_SEGURO_DESGRAVAMEN
  const propertyRate = rates.property ?? CONFIG.TASA_SEGURO_INMUEBLE

  const desgravamen = calculateDesgravamen(balance, desgravamenRate)
  const property = calculatePropertyInsurance(balance, propertyRate)
  const total = desgravamen + property

  return {
    desgravamen,
    property,
    total,
    rates: {
      desgravamen: desgravamenRate,
      property: propertyRate
    }
  }
}

export const calculateTotalInsurance = (schedule) => {
  let totalDesgravamen = 0
  let totalProperty = 0

  for (const period of schedule) {
    totalDesgravamen += period.desgravamen || 0
    totalProperty += period.propertyInsurance || 0
  }

  return {
    totalDesgravamen,
    totalProperty,
    grandTotal: totalDesgravamen + totalProperty
  }
}

export const validateInsuranceRates = (desgravamenRate, propertyRate) => {
  const warnings = []

  const DESGRAVAMEN_MIN = 0.0001  // 0.01%
  const DESGRAVAMEN_MAX = 0.001   // 0.1%
  const PROPERTY_MIN = 0.0001     // 0.01%
  const PROPERTY_MAX = 0.001      // 0.1%

  if (desgravamenRate < DESGRAVAMEN_MIN) {
    warnings.push('La tasa de desgravamen es inusualmente baja')
  }

  if (desgravamenRate > DESGRAVAMEN_MAX) {
    warnings.push('La tasa de desgravamen es inusualmente alta')
  }

  if (propertyRate < PROPERTY_MIN) {
    warnings.push('La tasa de seguro de inmueble es inusualmente baja')
  }

  if (propertyRate > PROPERTY_MAX) {
    warnings.push('La tasa de seguro de inmueble es inusualmente alta')
  }

  return {
    isValid: warnings.length === 0,
    warnings
  }
}
