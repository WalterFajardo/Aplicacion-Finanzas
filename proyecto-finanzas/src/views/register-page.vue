<template>
  <div class="register-bg">
    <div class="register-card">
      <div class="logo-section">
        <img class="app-logo" src="/fluxus-logo.png" alt="Fluxus" />
        <p class="app-subtitle">Sistema de Crédito MiVivienda</p>
      </div>
      <h2>Registro</h2>
      <form @submit.prevent="registrar">
        <div class="form-group">
          <label>Usuario:</label>
          <input v-model="usuario" placeholder="Usuario" required class="input" />
        </div>
        <div class="form-group">
          <label>Contraseña:</label>
          <Password v-model="contrasena" placeholder="Contraseña" class="input" toggleMask />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="email" type="email" placeholder="Correo electrónico" required class="input" />
        </div>
        <div class="form-group">
          <label>Tipo de cuenta:</label>
          <select v-model="tipo" required class="input">
            <option disabled value="">Selecciona tipo de usuario</option>
            <option value="Emisor">Emisor</option>
            <option value="Inversor">Inversor</option>
          </select>
        </div>
        <button type="submit" class="register-btn">Registrar</button>
      </form>
      <router-link to="/login" class="login-link">¿Ya tienes cuenta? Inicia sesión</router-link>
    </div>
  </div>
</template>

<script>
import Password from 'primevue/password'
export default {
  components: { Password },

  data() {
    return {
      usuario: '',
      contrasena: '',
      tipo: '',
      email: ''
    }
  },
  methods: {
    async registrar() {
      if (!this.tipo) {
        alert('Por favor, selecciona un tipo de usuario.')
        return
      }
      if (!this.email) {
        alert('Por favor, ingresa un correo electrónico.')
        return
      }
      // Mapea el tipo a rol booleano
      const rol = this.tipo === 'Emisor'
      const nuevoUsuario = {
        username: this.usuario,
        password_hash: this.contrasena,
        email: this.email,
        rol,
        created_at: new Date().toISOString()
      }
      try {
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario)
        })
        alert('Registro exitoso')
        this.$router.push('/login')
      } catch (e) {
        alert('Error al registrar usuario')
      }
    }
  }
}
</script>

<style scoped>
.register-bg {
  position: fixed;
  inset: 0;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 2vw, 2.5rem);
  background:
    radial-gradient(900px 600px at 12% 10%, rgba(122, 195, 255, 0.45), transparent 60%),
    radial-gradient(800px 500px at 88% 15%, rgba(21, 101, 192, 0.45), transparent 55%),
    linear-gradient(140deg, #0b2a55 0%, #145ea8 45%, #1b88d9 100%);
  overflow: hidden;
}

.register-bg::before,
.register-bg::after {
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

.register-bg::before {
  top: -140px;
  right: -120px;
}

.register-bg::after {
  bottom: -180px;
  left: -160px;
}

.register-card {
  position: relative;
  z-index: 1;
  width: min(460px, 100%);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
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
  width: min(210px, 80vw);
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

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1rem;
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

.register-btn {
  width: 100%;
  background: linear-gradient(135deg, #145ea8 0%, #0b2a55 100%);
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.95rem 0;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 0.5rem;
  cursor: pointer;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(11, 42, 85, 0.25);
}

.login-link {
  margin-top: 1.8rem;
  color: #145ea8;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 1rem;
  font-weight: 600;
}

.login-link:hover {
  color: #0b2a55;
  text-decoration: underline;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #e1e7f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f5f7fb;
}

:deep(.p-password input:focus) {
  border-color: rgba(20, 94, 168, 0.6);
  box-shadow: 0 0 0 4px rgba(20, 94, 168, 0.12);
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
  .register-card {
    padding: 2rem 1.4rem;
  }
  h2 {
    font-size: 1.35rem;
  }
  .app-logo {
    width: min(170px, 80vw);
  }
}
</style>
