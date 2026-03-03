<template>
  <div class="dashboard-container">
    <!-- Header -->
    <nav class="navbar">
      <div class="navbar-content">
        <img class="navbar-logo" src="/fluxus-logo.png" alt="Fluxus" />
      </div>
      <div class="navbar-user">
        <span class="user-info">{{ currentUser.username }}</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="dashboard-content">
      <div class="welcome-section">
        <h2>Bienvenido al Sistema</h2>
        <p>{{ currentUser.email }}</p>
      </div>

      <!-- Menu Grid -->
      <div class="menu-grid">
        <router-link to="/simulador" class="menu-card">
          <div class="card-icon">📊</div>
          <h3>Simulador de Créditos</h3>
          <p>Realiza simulaciones de créditos hipotecarios MiVivienda</p>
        </router-link>

        <router-link to="/gestionar-clientes" class="menu-card">
          <div class="card-icon">👥</div>
          <h3>Gestionar Clientes</h3>
          <p>Administra la información de tus clientes</p>
        </router-link>

        <router-link to="/cronogramas" class="menu-card">
          <div class="card-icon">📋</div>
          <h3>Cronogramas</h3>
          <p>Visualiza cronogramas de pagos generados</p>
        </router-link>

        <router-link to="/reportes" class="menu-card">
          <div class="card-icon">📈</div>
          <h3>Reportes Financieros</h3>
          <p>Indicadores VAN y TIR de los créditos</p>
        </router-link>
      </div>

      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <h4>Estado del Sistema</h4>
          <p class="stat-value">✓ Operativo</p>
        </div>
        <div class="stat-card">
          <h4>Rol de Usuario</h4>
          <p class="stat-value">Agente de Ventas</p>
        </div>
        <div class="stat-card">
          <h4>Última conexión</h4>
          <p class="stat-value">{{ lastLogin }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'

export default {
  name: 'Dashboard',
  data() {
    return {
      currentUser: {},
      lastLogin: new Date().toLocaleString()
    }
  },
  mounted() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      this.$router.push('/login')
      return
    }
    this.currentUser = authService.getCurrentUser()
  },
  methods: {
    logout() {
      authService.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(900px 600px at 12% 10%, rgba(122, 195, 255, 0.35), transparent 60%),
    radial-gradient(800px 500px at 90% 20%, rgba(21, 101, 192, 0.25), transparent 55%),
    linear-gradient(140deg, #f5f7fb 0%, #eef2f7 45%, #e2e9f5 100%);
  position: relative;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  background: linear-gradient(135deg, rgba(11, 42, 85, 0.94) 0%, rgba(20, 94, 168, 0.94) 100%);
  color: white;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12px 30px rgba(11, 42, 85, 0.2);
  position: sticky;
  top: 0;
  z-index: 5;
  backdrop-filter: blur(10px);
}

.navbar-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.navbar-logo {
  height: 96px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
}

.navbar-subtitle {
  margin: 0.2rem 0 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
}

.user-info {
  font-size: 1rem;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  font-weight: 600;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(11, 42, 85, 0.2);
}

/* Dashboard Content */
.dashboard-content {
  flex: 1;
  padding: clamp(1.5rem, 2vw, 2.5rem);
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.welcome-section {
  background: rgba(255, 255, 255, 0.92);
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 16px 32px rgba(11, 42, 85, 0.1);
  border: 1px solid rgba(11, 42, 85, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  animation: rise 600ms ease both;
}

.welcome-section h2 {
  color: #0b2a55;
  margin: 0;
  font-size: 1.9rem;
}

.welcome-section p {
  color: rgba(11, 42, 85, 0.75);
  margin: 0;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f7fb;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  width: fit-content;
}

/* Menu Grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 24px rgba(11, 42, 85, 0.08);
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  border: 1px solid rgba(11, 42, 85, 0.08);
  border-left: 4px solid #145ea8;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-height: 170px;
  animation: rise 600ms ease both;
}

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px rgba(20, 94, 168, 0.16);
  border-color: rgba(20, 94, 168, 0.35);
}

.card-icon {
  font-size: 2rem;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(20, 94, 168, 0.12);
  color: #145ea8;
}

.menu-card h3 {
  color: #0b2a55;
  margin: 0.3rem 0 0 0;
  font-size: 1.2rem;
}

.menu-card p {
  color: rgba(11, 42, 85, 0.7);
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.92);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(11, 42, 85, 0.08);
  text-align: left;
  border: 1px solid rgba(11, 42, 85, 0.08);
  animation: rise 600ms ease both;
}

.stat-card h4 {
  color: rgba(11, 42, 85, 0.6);
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: #145ea8;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.menu-card:nth-child(1) {
  animation-delay: 80ms;
}

.menu-card:nth-child(2) {
  animation-delay: 140ms;
}

.menu-card:nth-child(3) {
  animation-delay: 200ms;
}

.menu-card:nth-child(4) {
  animation-delay: 260ms;
}

.stat-card:nth-child(1) {
  animation-delay: 320ms;
}

.stat-card:nth-child(2) {
  animation-delay: 380ms;
}

.stat-card:nth-child(3) {
  animation-delay: 440ms;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .navbar-logo {
    height: 72px;
  }

  .navbar-user {
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
  }

  .dashboard-content {
    padding: 1.2rem;
  }

  .welcome-section {
    padding: 1.4rem;
  }
}
</style>
