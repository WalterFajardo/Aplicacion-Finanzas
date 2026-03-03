<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="logo-section">
        <img class="app-logo" src="/fluxus-logo.png" alt="Fluxus" />
        <p class="app-subtitle">Sistema de Crédito MiVivienda</p>
      </div>

      <h2>Iniciar sesión</h2>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input
            id="usuario"
            v-model="usuario"
            type="text"
            class="input"
            placeholder="Ingrese su usuario"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input
            id="contrasena"
            v-model="contrasena"
            type="password"
            class="input"
            placeholder="Ingrese su contraseña"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <hr class="divider" />

      <p class="register-text">¿No tienes cuenta?</p>
      <router-link to="/register" class="register-link">Regístrate aquí</router-link>

      <!-- Credenciales de prueba -->
      <div class="test-credentials">
        <p class="test-title">Credenciales de prueba:</p>
        <p><strong>Usuario:</strong> usuario1</p>
        <p><strong>Contraseña:</strong> hash123</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'

export default {
  data() {
    return {
      usuario: '',
      contrasena: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false
    }
  },
  methods: {
    async login() {
      // Validaciones
      if (!this.usuario.trim()) {
        this.errorMessage = 'Por favor ingrese el usuario'
        return
      }
      if (!this.contrasena.trim()) {
        this.errorMessage = 'Por favor ingrese la contraseña'
        return
      }

      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const result = await authService.login(this.usuario, this.contrasena)

        if (result.success) {
          this.successMessage = result.message
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1500)
        } else {
          this.errorMessage = result.message
        }
      } catch (error) {
        this.errorMessage = 'Error en la conexión: ' + error.message
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    // Si ya está autenticado, redirigir al dashboard
    if (authService.isAuthenticated()) {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.login-bg {
  position: fixed;
  inset: 0;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 2vw, 2.5rem);
  background:
    radial-gradient(900px 600px at 10% 10%, rgba(122, 195, 255, 0.45), transparent 60%),
    radial-gradient(800px 500px at 90% 20%, rgba(21, 101, 192, 0.45), transparent 55%),
    linear-gradient(140deg, #0b2a55 0%, #145ea8 45%, #1b88d9 100%);
  overflow: hidden;
}

.login-bg::before,
.login-bg::after {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 60%);
  filter: blur(2px);
  opacity: 0.5;
  z-index: 0;
}

.login-bg::before {
  top: -140px;
  right: -120px;
}

.login-bg::after {
  bottom: -180px;
  left: -160px;
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(440px, 100%);
  background: #eef5ff;
  border-radius: 24px;
  border: 1px solid rgba(20, 94, 168, 0.12);
  box-shadow:
    0 24px 60px rgba(9, 30, 66, 0.18),
    0 4px 12px rgba(9, 30, 66, 0.12);
  padding: 2.6rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  animation: cardIn 700ms ease both;
}

.logo-section {
  text-align: center;
  margin-bottom: 0.5rem;
}

.app-logo {
  width: min(220px, 80vw);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(11, 42, 85, 0.18));
  display: block;
  margin: 0 auto;
}

.app-subtitle {
  color: rgba(11, 42, 85, 0.7);
  font-size: 0.95rem;
  margin: 0.35rem 0 0 0;
}

h2 {
  color: #145ea8;
  margin: 0.6rem 0 0.5rem 0;
  font-size: 1.6rem;
}

form {
  width: 100%;
  display: grid;
  gap: 0.9rem;
}

.error-message,
.success-message {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  border: 1px solid transparent;
}

.error-message {
  background-color: #ffe9ea;
  color: #9f1c1c;
  border-color: rgba(159, 28, 28, 0.2);
}

.success-message {
  background-color: #e6f7ee;
  color: #1b6b3e;
  border-color: rgba(27, 107, 62, 0.2);
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

label {
  color: #0b2a55;
  font-weight: 600;
  font-size: 0.95rem;
}

.input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #e1e7f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f5f7fb;
  box-sizing: border-box;
  outline: none;
  transition: border 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.input:focus {
  border-color: rgba(20, 94, 168, 0.6);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(20, 94, 168, 0.12);
}

.input:disabled {
  background-color: #edf1f7;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #145ea8 0%, #0b2a55 100%);
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.95rem 0;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  margin-top: 0.4rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(11, 42, 85, 0.25);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  width: 100%;
  margin: 1.8rem 0 1.2rem 0;
  border: none;
  border-top: 1px solid rgba(11, 42, 85, 0.12);
}

.register-text {
  color: rgba(11, 42, 85, 0.7);
  margin: 0;
  font-size: 0.95rem;
}

.register-link {
  color: #145ea8;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 1rem;
  font-weight: 600;
}

.register-link:hover {
  color: #0b2a55;
  text-decoration: underline;
}

.test-credentials {
  background: #f5f7fb;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1.4rem;
  width: 100%;
  border: 1px dashed rgba(11, 42, 85, 0.25);
  font-size: 0.9rem;
}

.test-title {
  color: #0b2a55;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.test-credentials p {
  margin: 0.3rem 0;
  color: rgba(11, 42, 85, 0.75);
}

.test-credentials strong {
  color: #145ea8;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 500px) {
  .login-card {
    padding: 2rem 1.4rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .app-logo {
    width: min(180px, 80vw);
  }
}
</style>
