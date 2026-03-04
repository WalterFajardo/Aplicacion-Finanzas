<template>
  <div class="client-card">
    <div class="card-header">
      <div class="header-info">
        <h3 class="client-name">{{ client.customerName || 'Sin Nombre' }}</h3>
        <span class="client-dni">DNI: {{ client.dni || '---' }}</span>
      </div>
      <div class="socio-badge" :class="badgeClass">
        {{ client.socioeconomicLevel || 'No definido' }}
      </div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="info-label">Ingresos Mensuales:</span>
        <span class="info-value highlight">S/ {{ formatNumber(client.monthlyIncome) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Entidad Financiera:</span>
        <span class="info-value">{{ client.bankEntity || '---' }}</span>
      </div>
      <div class="info-row date-row">
        <span class="info-label">Registrado el:</span>
        <span class="info-value">{{ client.createdAt }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button @click="$emit('edit', client)" class="btn-action btn-edit">
        ✏️ Editar
      </button>
      <button @click="$emit('delete', client.id)" class="btn-action btn-delete">
        🗑️ Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Definimos qué datos va a recibir esta tarjeta desde la vista principal
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
});

// Definimos los eventos que esta tarjeta puede disparar hacia arriba
defineEmits(['edit', 'delete']);

// Función simple para que el dinero se vea con comas (ej. 1,000)
const formatNumber = (num) => {
  if (!num) return '0.00';
  return Number(num).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Computado para darle un color distinto a la etiqueta según el nivel socioeconómico
const badgeClass = computed(() => {
  const level = props.client.socioeconomicLevel?.toUpperCase() || '';
  if (level === 'A' || level.includes('ALTO')) return 'badge-a';
  if (level === 'B' || level.includes('MEDIO ALTO')) return 'badge-b';
  if (level === 'C' || level.includes('MEDIO')) return 'badge-c';
  if (level === 'D' || level === 'E' || level.includes('BAJO')) return 'badge-d';
  return 'badge-default';
});
</script>

<style scoped>
.client-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.client-name {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #0b2a55; /* Azul oscuro de Fluxus */
  font-weight: 700;
  text-transform: capitalize;
}

.client-dni {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

/* Estilos para la etiqueta de Nivel Socioeconómico */
.socio-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.badge-a { background: #dcfce7; color: #166534; } /* Verde */
.badge-b { background: #dbeafe; color: #1e40af; } /* Azul */
.badge-c { background: #fef9c3; color: #854d0e; } /* Amarillo */
.badge-d { background: #fee2e2; color: #991b1b; } /* Rojo */
.badge-default { background: #f1f5f9; color: #475569; } /* Gris */

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  color: #1e293b;
  font-weight: 600;
  text-align: right;
}

.info-value.highlight {
  color: #145ea8;
  font-weight: 700;
}

.date-row {
  margin-top: 5px;
  font-size: 0.8rem;
}

.date-row .info-value {
  color: #94a3b8;
  font-weight: 500;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-action {
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.btn-edit {
  background: #f1f5f9;
  color: #0b2a55;
}

.btn-edit:hover { background: #e2e8f0; }

.btn-delete {
  background: #fff1f2;
  color: #e11d48;
}

.btn-delete:hover { background: #ffe4e6; }
</style>