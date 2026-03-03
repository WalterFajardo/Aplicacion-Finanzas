import { reactive, readonly } from 'vue'

// Usuarios registrados en el sistema (simulación)
const REGISTERED_USERS = [
  { dni: '12345678', password: 'admin123', name: 'Juan Pérez García', income: 5000 },
  { dni: '87654321', password: 'user123', name: 'María López Torres', income: 7500 },
  { dni: '11111111', password: 'test123', name: 'Carlos Rodríguez', income: 4500 }
]

const state = reactive({
  user: null,
  isAuthenticated: false,
  error: null
})

const initializeAuth = () => {
  const savedAuth = localStorage.getItem('mivivienda_auth')
  if (savedAuth) {
    try {
      const userData = JSON.parse(savedAuth)
      state.user = userData
      state.isAuthenticated = true
    } catch (e) {
      localStorage.removeItem('mivivienda_auth')
    }
  }
}

const login = (dni, password) => {
  state.error = null

  const user = REGISTERED_USERS.find(u => u.dni === dni && u.password === password)

  if (user) {
    const userData = {
      dni: user.dni,
      name: user.name,
      income: user.income,
      loginTime: new Date().toISOString()
    }

    localStorage.setItem('mivivienda_auth', JSON.stringify(userData))
    state.user = userData
    state.isAuthenticated = true
    return true
  } else {
    state.error = 'DNI o contraseña incorrectos'
    return false
  }
}

const logout = () => {
  localStorage.removeItem('mivivienda_auth')
  state.user = null
  state.isAuthenticated = false
  state.error = null
}

const clearError = () => {
  state.error = null
}

initializeAuth()

export const authStore = {
  state: readonly(state),
  login,
  logout,
  clearError,
  initializeAuth
}
