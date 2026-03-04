<template>
  <div class="management-container">
    <header class="page-header">
      <div class="header-content">
        <div class="titles">
          <h2>Gestión de Clientes</h2>
          <p class="subtitle">Administra la información socioeconómica de tus prospectos</p>
        </div>
        <div class="header-actions">
          <router-link to="/dashboard" class="btn-secondary">
            ← Volver
          </router-link>
          <button @click="openAddModal" class="btn-primary">
            + Nuevo Cliente
          </button>
        </div>
      </div>
    </header>

    <main class="clients-content">
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
import { ref, onMounted } from 'vue';
import { useClients } from '@/composables/useClients';
import ClientCard from '@/components/ClientCard.vue';
import ClientFormModal from '@/components/ClientFormModal.vue';

// 1. Traemos todas las funciones de nuestra base de datos local
const { clients, loadClients, addClient, updateClient, deleteClient } = useClients();

// 2. Variables para controlar la ventanita modal
const showModal = ref(false);
const selectedClient = ref(null);
const isSubmitting = ref(false);

// Cargamos la lista de clientes apenas el usuario entra a la pantalla
onMounted(() => {
  loadClients();
});

// 3. Funciones para abrir y cerrar el modal
const openAddModal = () => {
  selectedClient.value = null; // Limpiamos para que se abra vacío
  showModal.value = true;
};

const openEditModal = (client) => {
  selectedClient.value = { ...client }; // Pasamos los datos del cliente a editar
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedClient.value = null;
};

// 4. Función que se ejecuta cuando el modal nos manda los datos validados
const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    if (selectedClient.value && selectedClient.value.id) {
      // Si el cliente ya tenía un ID, significa que estamos editando
      await updateClient(selectedClient.value.id, formData);
    } else {
      // Si no, estamos creando uno nuevo
      await addClient(formData);
    }
    closeModal(); // Cerramos la ventanita al terminar
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

// 5. Función para eliminar con una pequeña confirmación de seguridad
const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar a este cliente? Esta acción no se puede deshacer.')) {
    await deleteClient(id);
  }
};
</script>

<style scoped>
.management-container {
  min-height: 100vh;
  background: linear-gradient(140deg, #f5f7fb 0%, #eef2f7 45%, #e2e9f5 100%);
  padding: 40px 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  background: white;
  padding: 20px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titles h2 {
  color: #0b2a55;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-secondary {
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  padding: 10px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #0b2a55;
}

.btn-primary {
  background: #145ea8;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.btn-primary:hover {
  background: #0c4a86;
  transform: translateY(-1px);
}

.clients-content {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  background: white;
  padding: 60px 20px;
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #1e293b;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
}

.mt-15 {
  margin-top: 15px;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>