<template>
  <div class="credit-form-container">
    <header class="form-header">
      <h2>Configuración del Crédito</h2>
      <p class="subtitle">Ingrese los parámetros para generar su cronograma MiVivienda</p>
    </header>

    <form @submit.prevent="handleSubmit" class="credit-form">
      <fieldset class="form-section">
        <legend>Información del Cliente</legend>
        <div class="form-row">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" v-model="form.customerName" placeholder="Ej: Juan Pérez" required />
          </div>
          <div class="form-group">
            <label>DNI / CE</label>
            <input type="text" v-model="form.dni" placeholder="8 dígitos" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Ingresos Mensuales Netos</label>
            <input type="number" v-model.number="form.monthlyIncome" required />
          </div>
          <div class="form-group">
            <label>Entidad Financiera Autorizada</label>
            <select v-model="form.bankEntity" required>
              <option value="" disabled>Seleccione un banco/caja</option>
              <option v-for="bank in authorizedBanks" :key="bank" :value="bank">{{ bank }}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="form-section">
        <legend>Datos del Inmueble</legend>
        <div class="form-row">
          <div class="form-group">
            <label>Moneda</label>
            <select v-model="form.currency">
              <option value="PEN">Soles (S/)</option>
              <option value="USD">Dólares ($)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Precio de Venta</label>
            <input type="number" v-model.number="form.propertyPrice" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Cuota Inicial</label>
            <input type="number" v-model.number="form.downPayment" required />
          </div>
          <div class="form-group highlight-bonus">
            <label>Bono (BBP / BFH)</label>
            <input type="number" :value="form.bonus" readonly />
            <span class="hint">Calculado según escala MiVivienda</span>
          </div>
        </div>
      </fieldset>

      <fieldset class="form-section">
        <legend>Condiciones Financieras</legend>
        <div class="form-row">
          <div class="form-group">
            <label>Tipo de Tasa</label>
            <select v-model="form.rateType">
              <option value="TEA">TEA (Efectiva)</option>
              <option value="TNA">TNA (Nominal)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tasa Anual (%)</label>
            <input type="number" v-model.number="form.annualRate" step="0.01" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Plazo (Meses)</label>
            <input type="number" v-model.number="form.termMonths" required />
          </div>
          <div class="form-group">
            <label>Gracia</label>
            <select v-model="form.graceType">
              <option value="none">Sin Gracia</option>
              <option value="partial">Parcial</option>
              <option value="total">Total</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Procesando...' : 'Generar Cronograma' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCredit } from '@/composables/useCredit'

const router = useRouter()
const { creditData, updateCreditData, generateSchedule } = useCredit()
const isSubmitting = ref(false)

const authorizedBanks = [
  "Banco BBVA Perú", "Banco de Crédito del Perú (BCP)", "Interbank", "Scotiabank Perú",
  "Banco Pichincha", "BanBif", "Banco GNB", "Banco Comercio", "Alfin Banco",
  "Caja Municipal Arequipa", "Caja Municipal Huancayo", "Caja Municipal Ica",
  "Caja Municipal Piura", "Caja Municipal Sullana", "Caja Municipal Trujillo",
  "Caja Municipal Cusco", "Caja Municipal Maynas", "Caja Metropolitana de Lima"
]

const form = reactive({ ...creditData.value })

const updateBonus = () => {
  if (form.currency !== 'PEN') { form.bonus = 0; return; }
  const p = form.propertyPrice || 0
  if (p >= 67200 && p <= 93100) form.bonus = 28500
  else if (p > 93100 && p <= 139400) form.bonus = 22600
  else if (p > 139400 && p <= 232200) form.bonus = 19600
  else if (p > 232200 && p <= 343100) form.bonus = 7300
  else form.bonus = 0
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    updateCreditData(form)
    const success = await generateSchedule()
    if (success) {
      router.push('/schedule')
    } else {
      alert("Error al procesar los cálculos financieros.")
    }
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

watch(() => form.propertyPrice, updateBonus, { immediate: true })
watch(() => form.currency, updateBonus)
</script>

<style scoped>
.credit-form-container {
  max-width: 850px;
  margin: 40px auto;
  background: #ffffff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: #000000;
}

.form-header { text-align: center; margin-bottom: 30px; }
.form-header h2 { color: #000000; font-size: 2rem; font-weight: 800; margin-bottom: 10px; }
.subtitle { color: #000000; font-weight: 500; font-size: 1.1rem; }

.form-section {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  background: #f8fafc;
}

legend {
  font-weight: 800;
  color: #000000;
  padding: 0 15px;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 700;
  color: #000000;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

input, select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #000000;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #145ea8;
  box-shadow: 0 0 0 3px rgba(20, 94, 168, 0.1);
}

.highlight-bonus input {
  background: #f0f9ff;
  border-color: #145ea8;
  font-weight: 800;
  color: #145ea8;
}

.hint {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #000000;
  font-weight: 600;
}

.btn-primary {
  width: 100%;
  padding: 18px;
  background: #145ea8;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.btn-primary:hover { background: #0c4a86; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>