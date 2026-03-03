<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-content">
        <img class="navbar-logo" src="/fluxus-logo.png" alt="Fluxus" />
      </div>
      <div class="navbar-user">
        <span class="user-info">{{ userName }}</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="dashboard-content">

      <div class="form-layout">
        <section class="form-card">
          <div class="card-header">
            <div class="header-actions">
              <h2>Configuración del Crédito</h2>
              <router-link to="/dashboard" class="btn-secondary">
                ← Volver
              </router-link>
            </div>
            <p class="subtitle">Ingrese los parámetros para generar su cronograma</p>
          </div>

          <CreditForm
              @form-submitted="handleFormSubmit"
              @validation-error="handleValidationError"
          />
        </section>

        <aside class="quick-reference-card">
          <h3>Referencia Rápida</h3>
          <div class="reference-list">
            <div class="reference-item">
              <span class="ref-label">Capital Máximo</span>
              <span class="ref-value">S/ 500,000</span>
            </div>
            <div class="reference-item">
              <span class="ref-label">Plazo sugerido</span>
              <span class="ref-value">12 - 360 meses</span>
            </div>
            <div class="reference-item">
              <span class="ref-label">Gracia Máxima</span>
              <span class="ref-value">24 meses</span>
            </div>
            <div class="reference-item">
              <span class="ref-label">Seguros combinados</span>
              <span class="ref-value">0.058% aprox.</span>
            </div>
            <div class="reference-item">
              <span class="ref-label">Cálculo</span>
              <span class="ref-value">Francés (30/360)</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import CreditForm from '../components/CreditForm.vue';
import { useAuth } from '../composables/useAuth.js';
import { useCredit } from '../composables/useCredit.js';

const router = useRouter();
const { user, logout: performLogout } = useAuth();
const { updateCreditData } = useCredit();

const userName = computed(() => user.value?.name || 'Usuario');

const handleFormSubmit = (formData) => {
  updateCreditData(formData);
  router.push('/schedule');
};

const handleValidationError = (errors) => {
  console.error('Errores:', errors);
};

const logout = () => {
  performLogout();
  router.push('/login');
};
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
}

.navbar {
  background: linear-gradient(135deg, rgba(11, 42, 85, 0.94) 0%, rgba(20, 94, 168, 0.94) 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.navbar-logo { height: 50px; }

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.process-steps {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 1rem;
  border-radius: 12px;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.4;
}

.step.active, .step.completed { opacity: 1; }

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0b2a55;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step.completed .step-number { background: #4ade80; }
.step-label { font-weight: 500; color: #1e293b; }

.form-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .form-layout { grid-template-columns: 1fr; }
}

.form-card {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.card-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: #1e293b;
  font-size: 0.85rem;
  font-weight: 600;
}

.card-header h2 { color: #0b2a55; font-size: 1.4rem; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; margin-top: 5px; }

.quick-reference-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid white;
}

.quick-reference-card h3 {
  font-size: 1rem;
  color: #0b2a55;
  margin-bottom: 1.2rem;
}

.reference-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.reference-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ref-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
}

.ref-value {
  font-size: 1rem;
  color: #145ea8;
  font-weight: 600;
}
</style>