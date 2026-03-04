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
      <header class="page-header-fluxus">
        <div class="header-titles">
          <h2>Gestión de Clientes</h2>
          <p class="subtitle">Administra la información socioeconómica de tus prospectos</p>
        </div>
        <div class="action-buttons">
          <router-link to="/dashboard" class="btn-secondary">
            ← Volver al Dashboard
          </router-link>
          <button @click="openAddModal" class="btn-primary">
            + Nuevo Cliente
          </button>
        </div>
      </header>

      <section class="main-card">
        <div v-if="clients.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No hay clientes registrados</h3>
          <p>Comienza añadiendo tu primer prospecto a la cartera.</p>
          <button @click="openAddModal" class="btn-primary mt-15">
            + Añadir el primero
          </button>
        </div>

        <div v-else class="clients-grid">
          <ClientCard
              v-for="client in clients"
              :key="client.id"
              :client="client"
              @edit="openEditModal"
              @delete="handleDelete"
          />
        </div>
      </section>
    </main>

    <ClientFormModal
        :show="showModal"
        :clientData="selectedClient"
        :loading="isSubmitting"
        @close="closeModal"
        @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {authService} from '@/services/authService';
import {useClients} from '@/composables/useClients';
import ClientCard from '@/components/ClientCard.vue';
import ClientFormModal from '@/components/ClientFormModal.vue';

const router = useRouter();
const {clients, loadClients, addClient, updateClient, deleteClient} = useClients();

const currentUser = ref(authService.getCurrentUser() || {username: 'Usuario'});
const showModal = ref(false);
const selectedClient = ref(null);
const isSubmitting = ref(false);

onMounted(() => {
  loadClients();
});

const openAddModal = () => {
  selectedClient.value = null;
  showModal.value = true;
};

const openEditModal = (client) => {
  selectedClient.value = {...client};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedClient.value = null;
};

const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    if (selectedClient.value?.id) {
      await updateClient(selectedClient.value.id, formData);
    } else {
      await addClient(formData);
    }
    closeModal();
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar a este cliente?')) {
    await deleteClient(id);
  }
};

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f4f7fa;
  color: #000;
}

.navbar {
  background: linear-gradient(135deg, #0b2a55 0%, #145ea8 100%);
  padding: 0.8rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  height: 42px;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  color: white;
  font-weight: 600;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  padding: 7px 22px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #fff;
  color: #0b2a55;
}

.dashboard-content {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header-fluxus {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.header-titles h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: #0b2a55;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: 5px;
}

.main-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary {
  background: #145ea8;
  color: #fff;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: #0c4a86;
}

.btn-secondary {
  background: #fff;
  color: #0b2a55;
  border: 1.5px solid #e2e8f0;
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.3;
}

.mt-15 {
  margin-top: 15px;
}

@media (max-width: 768px) {
  .page-header-fluxus {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>