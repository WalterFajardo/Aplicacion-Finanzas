<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-content">
        <img class="navbar-logo" src="/fluxus-logo.png" alt="Fluxus" />
      </div>
      <div class="navbar-user">
        <span class="user-info">{{ currentUser.username }}</span>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="dashboard-content">
      <div class="page-header">
        <div class="header-actions">
          <h2>Reporte Financiero</h2>
          <router-link to="/dashboard" class="btn-secondary">
            ← Volver al Menú
          </router-link>
        </div>
      </div>

      <IndicatorsReport />

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import IndicatorsReport from '@/components/IndicatorsReport.vue'; // Ajusta la ruta si es necesario

const router = useRouter();
const currentUser = ref(authService.getCurrentUser() || { username: 'Usuario' });

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background:
      radial-gradient(900px 600px at 12% 10%, rgba(122, 195, 255, 0.35), transparent 60%),
      radial-gradient(800px 500px at 90% 20%, rgba(21, 101, 192, 0.25), transparent 55%),
      linear-gradient(140deg, #f5f7fb 0%, #eef2f7 45%, #e2e9f5 100%);
}

.navbar {
  background: linear-gradient(135deg, #0b2a55 0%, #145ea8 100%);
  padding: 0.8rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.navbar-logo { height: 42px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.user-info { font-weight: 600; }

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 6px 18px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover { background: #fff; color: #0b2a55; }

.dashboard-content {
  padding: 3rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header { margin-bottom: 2rem; }

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions h2 {
  font-size: 2rem;
  color: #0b2a55;
  margin: 0;
}

.btn-secondary {
  background: white;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-secondary:hover { background: #f8fafc; }
</style>