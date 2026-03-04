// Servicio de autenticación que se conecta a json-server
const API_URL = 'http://localhost:3000'

export const authService = {
  // Login de usuario
  async login(username, password) {
    try {
      // Obtener todos los usuarios desde db.json
      const response = await fetch(`${API_URL}/users`)
      if (!response.ok) throw new Error('Error al conectar con servidor')

      const users = await response.json()

      // Buscar usuario con credenciales coincidentes
      const user = users.find(u => u.username === username && u.password_hash === password)

      if (user) {
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          rol: user.rol
        }))
        localStorage.setItem('isAuthenticated', 'true')
        return { success: true, user, message: 'Bienvenido al Sistema' }
      } else {
        return { success: false, message: 'Credenciales incorrectas. Intente de nuevo.' }
      }
    } catch (error) {
      return { success: false, message: 'Error en conexión: ' + error.message }
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isAuthenticated')
    return { success: true, message: 'Sesión cerrada' }
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true'
  },

  // Registrar nuevo usuario
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password_hash: password,
          rol: true,
          created_at: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Error al crear usuario')
      const newUser = await response.json()
      return { success: true, user: newUser, message: 'Usuario registrado exitosamente' }
    } catch (error) {
      return { success: false, message: 'Error: ' + error.message }
    }
  }
}
