import { computed } from 'vue'
import { authStore } from '@/store/auth'
import { validateDNI } from '@/services/validators'

export const useAuth = () => {
  const user = computed(() => authStore.state.user)
  const isAuthenticated = computed(() => authStore.state.isAuthenticated)
  const error = computed(() => authStore.state.error)

  const login = (dni, password) => {
    const dniValidation = validateDNI(dni)
    if (!dniValidation.isValid) {
      return {
        success: false,
        errors: dniValidation.errors
      }
    }

    if (!password || password.length < 4) {
      return {
        success: false,
        errors: ['La contraseña debe tener al menos 4 caracteres']
      }
    }

    const success = authStore.login(dni, password)
    
    return {
      success,
      errors: success ? [] : [authStore.state.error]
    }
  }

  const logout = () => {
    authStore.logout()
  }

  const clearError = () => {
    authStore.clearError()
  }
  
  return {
    user,
    isAuthenticated,
    error,

    login,
    logout,
    clearError
  }
}
