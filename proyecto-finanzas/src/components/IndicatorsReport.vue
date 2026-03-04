<template>
  <div class="indicators-container" v-if="indicators">
    <div class="report-header">
      <div class="header-icon">📈</div>
      <div class="header-text">
        <h3>Análisis de Rentabilidad</h3>
        <p>Indicadores financieros basados en el flujo de caja del cronograma</p>
      </div>
    </div>

    <div class="indicators-grid">
      <div class="indicator-card">
        <span class="ind-label">Valor Actual Neto (VAN)</span>
        <span class="ind-value" :class="{ 'text-success': indicators.van > 0, 'text-danger': indicators.van <= 0 }">
          {{ formatCurrency(indicators.van) }}
        </span>
        <span class="ind-hint">Descontado al COK ({{ creditData.cok }}% anual)</span>
      </div>

      <div class="indicator-card">
        <span class="ind-label">TIR Mensual</span>
        <span class="ind-value">{{ (indicators.tirMensual * 100).toFixed(4) }}%</span>
        <span class="ind-hint">Tasa Interna de Retorno del periodo</span>
      </div>

      <div class="indicator-card highlight">
        <span class="ind-label">TCEA</span>
        <span class="ind-value">{{ indicators.tcea.toFixed(2) }}%</span>
        <span class="ind-hint">Tasa de Costo Efectivo Anual real</span>
      </div>
    </div>

    <div class="viability-alert" :class="indicators.esViable ? 'alert-success' : 'alert-warning'">
      <div class="alert-icon">{{ indicators.esViable ? '✓' : '⚠️' }}</div>
      <div class="alert-content">
        <h4>{{ indicators.esViable ? 'Crédito Viable' : 'Revisión Sugerida' }}</h4>
        <p>{{ indicators.mensaje }}</p>
      </div>
    </div>
  </div>

  <div class="empty-state" v-else>
    <div class="icon">📊</div>
    <h3>No hay datos para analizar</h3>
    <p>Por favor, genera primero un cronograma de pagos para ver los indicadores.</p>
    <router-link to="/credit" class="btn-primary">Ir al Simulador</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCredit } from '@/composables/useCredit';

const { indicators, creditData } = useCredit();

const formatCurrency = (val) => {
  const currencyCode = creditData.value.currency === 'USD' ? 'USD' : 'PEN';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: currencyCode }).format(val || 0);
};
</script>

<style scoped>
.indicators-container {
  background: white;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(11, 42, 85, 0.08);
}

.report-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.5rem;
}

.header-icon {
  font-size: 2.5rem;
  background: #f0f9ff;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.header-text h3 {
  color: #0b2a55;
  font-size: 1.5rem;
  margin: 0 0 0.3rem 0;
}

.header-text p { color: #64748b; margin: 0; font-size: 0.95rem; }

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.indicator-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.indicator-card.highlight {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.ind-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ind-value { font-size: 2rem; font-weight: 800; color: #0b2a55; }
.text-success { color: #10b981; }
.text-danger { color: #ef4444; }
.ind-hint { font-size: 0.8rem; color: #94a3b8; }

.viability-alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
}

.alert-success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
.alert-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }

.alert-icon { font-size: 1.8rem; }
.alert-content h4 { margin: 0 0 0.2rem 0; font-size: 1.1rem; }
.alert-content p { margin: 0; font-size: 0.95rem; opacity: 0.9; }

.empty-state {
  text-align: center;
  background: white;
  padding: 4rem 2rem;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.empty-state .icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h3 { color: #0b2a55; margin-bottom: 0.5rem; }
.empty-state p { color: #64748b; margin-bottom: 2rem; }

.btn-primary {
  background: #145ea8;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  display: inline-block;
}
</style>