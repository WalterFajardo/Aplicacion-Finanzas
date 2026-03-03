import { ref, computed } from 'vue'
import * as validators from '@/services/validators'

export const useValidation = () => {
  const errors = ref({})
  const warnings = ref({})
  const touched = ref({})

  const validateField = (field, value, context = {}) => {
    let result = { isValid: true, errors: [], warnings: [] }
    
    switch (field) {
      case 'dni':
        result = validators.validateDNI(value)
        break
      
      case 'income':
        result = validators.validateIncome(value)
        break
      
      case 'propertyPrice':
        result = validators.validatePropertyPrice(value)
        break
      
      case 'downPayment':
        result = validators.validateDownPayment(value, context.propertyPrice)
        break
      
      case 'bonus':
        result = validators.validateBonus(value, context.propertyPrice, context.downPayment)
        break
      
      case 'capital':
        result = validators.validateCapital(value)
        break
      
      case 'annualRate':
        result = validators.validateRate(value, context.rateType)
        break
      
      case 'termMonths':
        result = validators.validateTerm(value)
        break
      
      case 'graceMonths':
        result = validators.validateGraceMonths(value, context.termMonths)
        break
      
      case 'cok':
        result = validators.validateCOK(value)
        break
      
      case 'password':
        if (!value || value.length < 4) {
          result = { isValid: false, errors: ['La contraseña debe tener al menos 4 caracteres'], warnings: [] }
        }
        break
      
      default:
        result = { isValid: true, errors: [], warnings: [] }
    }

    errors.value[field] = result.errors
    warnings.value[field] = result.warnings
    touched.value[field] = true
    
    return result.isValid
  }

  const validateFields = (fields, context = {}) => {
    let allValid = true
    
    for (const [field, value] of Object.entries(fields)) {
      const isValid = validateField(field, value, { ...fields, ...context })
      if (!isValid) allValid = false
    }
    
    return allValid
  }

  const getErrors = (field) => {
    return errors.value[field] || []
  }

  const getWarnings = (field) => {
    return warnings.value[field] || []
  }

  const hasError = (field) => {
    return (errors.value[field] || []).length > 0
  }

  const isTouched = (field) => {
    return touched.value[field] || false
  }

  const touchField = (field) => {
    touched.value[field] = true
  }

  const hasAnyError = computed(() => {
    return Object.values(errors.value).some(fieldErrors => 
      fieldErrors && fieldErrors.length > 0
    )
  })

  const getAllErrors = computed(() => {
    return Object.values(errors.value).flat().filter(Boolean)
  })

  const clearField = (field) => {
    errors.value[field] = []
    warnings.value[field] = []
    touched.value[field] = false
  }

  const clearAll = () => {
    errors.value = {}
    warnings.value = {}
    touched.value = {}
  }
  
  return {
    // Estado
    errors,
    warnings,
    touched,
    hasAnyError,
    getAllErrors,

    // Métodos
    validateField,
    validateFields,
    getErrors,
    getWarnings,
    hasError,
    isTouched,
    touchField,
    clearField,
    clearAll
  }
}
