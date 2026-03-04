<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-container">
      <header class="modal-header">
        <h2>{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
        <button @click="$emit('close')" class="close-x">&times;</button>
      </header>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Nombre Completo</label>
            <input type="text" v-model="form.customerName" placeholder="Ej: Juan Pérez" required />
          </div>

          <div class="form-group">
            <label>DNI / CE</label>
            <input type="text" v-model="form.dni" placeholder="8 dígitos" required />
          </div>

          <div class="form-group">
            <label>Nivel Socioeconómico</label>
            <select v-model="form.socioeconomicLevel" required>
              <option value="" disabled>Seleccione nivel</option>
              <option value="A">Nivel A (Alto)</option>
              <option value="B">Nivel B (Medio Alto)</option>
              <option value="C">Nivel C (Medio)</option>
              <option value="D">Nivel D (Medio Bajo)</option>
              <option value="E">Nivel E (Bajo)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ingresos Mensuales (S/)</label>
            <input type="number" v-model.number="form.monthlyIncome" required />
          </div>

          <div class="form-group">
            <label>Entidad Financiera</label>
            <select v-model="form.bankEntity" required>
              <option value="" disabled>Seleccione banco</option>
              <option v-for="bank in authorizedBanks" :key="bank" :value="bank">{{ bank }}</option>
            </select>
          </div>
        </div>

        <footer class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar Cliente' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  clientData: Object, // Si viene este objeto, estamos editando
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const authorizedBanks = [
  "Banco BBVA Perú", "Banco de Crédito del Perú (BCP)", "Interbank", "Scotiabank Perú",
  "Banco Pichincha", "BanBif", "Banco GNB", "Banco Comercio", "Alfin Banco",
  "Caja Municipal Arequipa", "Caja Municipal Huancayo", "Caja Municipal Ica",
  "Caja Municipal Piura", "Caja Municipal Sullana", "Caja Municipal Trujillo",
  "Caja Municipal Cusco", "Caja Municipal Maynas", "Caja Metropolitana de Lima"
];

// Estado inicial del formulario
const initialState = {
  customerName: '',
  dni: '',
  monthlyIncome: 0,
  bankEntity: '',
  socioeconomicLevel: ''
};

const form = reactive({ ...initialState });

const isEditing = computed(() => !!props.clientData);

// Si props.clientData cambia (porque le dimos a editar), llenamos el formulario
watch(() => props.clientData, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal);
  } else {
    Object.assign(form, initialState);
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { ...form });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 42, 85, 0.7); /* Azul Fluxus con transparencia */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h2 {
  color: #0b2a55;
  margin: 0;
  font-size: 1.5rem;
}

.close-x {
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #145ea8;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-cancel {
  padding: 12px 24px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  padding: 12px 24px;
  background: #145ea8;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:disabled {
  background: #94a3b8;
}

@media (max-width: 500px) {
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
}
</style>