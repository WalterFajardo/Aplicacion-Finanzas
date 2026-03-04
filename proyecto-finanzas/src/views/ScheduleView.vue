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
      <section v-if="creditData" class="summary-card">
        <div class="summary-header">
          <div class="header-titles">
            <h2>Resumen de Simulación</h2>
            <p class="subtitle">Entidad: {{ creditData.bankEntity || 'No especificada' }}</p>
          </div>
          <div class="action-buttons">
            <router-link to="/credit" class="btn-secondary">← Volver</router-link>
            <router-link to="/reportes" class="btn-primary"> Ver Reportes</router-link>
            <button class="btn-primary" @click="exportToCSV">Descargar CSV</button>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Monto del Préstamo</span>
            <span class="value">{{ formatCurrency(netCapital) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Cuota Mensual Aprox.</span>
            <span class="value cuota-highlight">{{ formatCurrency(monthlyPayment) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Plazo</span>
            <span class="value">{{ creditData.termMonths }} meses</span>
          </div>
          <div class="summary-item">
            <span class="label">TEA</span>
            <span class="value">{{ creditData.annualRate }}%</span>
          </div>
          <div class="summary-item">
            <span class="label">Intereses Totales</span>
            <span class="value">{{ formatCurrency(totalInterest) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Monto Total a Pagar</span>
            <span class="value">{{ formatCurrency(totalToPay) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">VAN</span>
            <span class="value">{{ indicators ? formatCurrency(indicators.van) : formatCurrency(0) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">TIR Mensual</span>
            <span class="value">{{ indicators ? (indicators.tirMensual * 100).toFixed(2) : '0.00' }}%</span>
          </div>
          <div class="summary-item">
            <span class="label">TCEA</span>
            <span class="value">{{ indicators ? indicators.tcea.toFixed(2) : '0.00' }}%</span>
          </div>
        </div>
      </section>

      <section class="schedule-card" v-if="hasSchedule">
        <div class="section-header-table">
          <h2>Cronograma Detallado (30/360)</h2>
          <div class="filter-box">
            <select v-model="currentFilter" class="filter-select">
              <option value="all">Todos los periodos</option>
              <option value="grace">Solo periodos de gracia</option>
              <option value="amortization">Solo amortización</option>
              <option value="first12">Primeros 12 meses (Año 1)</option>
              <option value="last12">Últimos 12 meses</option>
            </select>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="schedule-table">
            <thead>
            <tr>
              <th>N°</th>
              <th>Saldo Inicial</th>
              <th>Interés</th>
              <th>Seguros</th>
              <th>Amortización</th>
              <th class="total-col">Cuota Total</th>
              <th>Saldo Final</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="p in filteredSchedule" :key="p.period" :class="{ 'grace-row': p.isGracePeriod }">
              <td>{{ p.period }}</td>
              <td>{{ formatCurrency(p.openingBalance) }}</td>
              <td>{{ formatCurrency(p.interest) }}</td>
              <td>{{ formatCurrency(p.desgravamen + p.propertyInsurance) }}</td>
              <td>{{ formatCurrency(p.amortization) }}</td>
              <td class="total-val">{{ formatCurrency(p.totalPayment) }}</td>
              <td>{{ formatCurrency(p.closingBalance) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {authService} from '@/services/authService'
import {useCredit} from '@/composables/useCredit'

const router = useRouter()
// Extraemos creditData directamente del composable
const {creditData, schedule, indicators, generateSchedule} = useCredit()
const currentUser = ref(authService.getCurrentUser() || {username: 'Usuario'})
const currentFilter = ref('all')

const hasSchedule = computed(() => (schedule.value?.length || 0) > 0)

// ÚNICA DEFINICIÓN: Corregida para usar creditData directamente
const formatCurrency = (val) => {
  // Verificamos la moneda seleccionada en el formulario
  const currencyCode = creditData.value?.currency === 'USD' ? 'USD' : 'PEN';

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currencyCode,
  }).format(val || 0);
};

// LÓGICA DE FILTRADO
const filteredSchedule = computed(() => {
  if (!schedule.value) return []
  const data = schedule.value

  switch (currentFilter.value) {
    case 'grace':
      return data.filter(p => p.isGracePeriod)
    case 'amortization':
      return data.filter(p => !p.isGracePeriod)
    case 'first12':
      return data.slice(0, 12)
    case 'last12':
      return data.slice(-12)
    default:
      return data
  }
})

// CÁLCULOS DEL RESUMEN
const netCapital = computed(() => (parseFloat(creditData.value?.propertyPrice) || 0) - (parseFloat(creditData.value?.downPayment) || 0) - (parseFloat(creditData.value?.bonus) || 0))
const totalInterest = computed(() => schedule.value?.reduce((acc, p) => acc + (p.interest || 0), 0) || 0)
const totalToPay = computed(() => schedule.value?.reduce((acc, p) => acc + (p.totalPayment || 0), 0) || 0)
const monthlyPayment = computed(() => hasSchedule.value ? schedule.value[0].totalPayment : 0)

/*const vanValue = computed(() => {
  if (!hasSchedule.value) return 0
  const rate = (parseFloat(creditData.value.annualRate) / 100) / 12
  let van = -netCapital.value
  schedule.value.forEach((p, i) => {
    van += p.totalPayment / Math.pow(1 + rate, i + 1)
  })
  return van
})

const tirValue = computed(() => parseFloat(creditData.value?.annualRate || 0) * 1.05)*/

//Para exportar en CSV
const exportToCSV = () => {
  // 1. Validar que existan datos
  if (!schedule.value || schedule.value.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // 2. Definir las cabeceras de las columnas
  const headers = [
    "Mes",
    "Tipo",
    "Saldo Inicial",
    "Amortizacion",
    "Interes",
    "Seguro Desgravamen",
    "Seguro Inmueble",
    "Cuota Total",
    "Saldo Final"
  ];

  // 3. Usamos punto y coma
  const csvRows = [headers.join(";")];

  // 4. Recorrer el cronograma y extraer los valores
  schedule.value.forEach((row) => {
    let tipoPeriodo = 'Normal';
    if (row.isGracePeriod) {
      tipoPeriodo = row.graceType === 'TOTAL' ? 'Gracia Total' : 'Gracia Parcial';
    }

    const rowData = [
      row.period,
      tipoPeriodo,
      row.openingBalance.toFixed(2),
      row.amortization.toFixed(2),
      row.interest.toFixed(2),
      row.desgravamen.toFixed(2),
      row.propertyInsurance.toFixed(2),
      row.totalPayment.toFixed(2),
      row.closingBalance.toFixed(2)
    ];

    csvRows.push(rowData.join(";"));
  });

  // 5. Unirtodo con saltos de linea
  const csvString = csvRows.join("\n");

  // 6. Crear el archivo (Blob).
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // 7. Crear un enlace invisible, forzar el clic y limpiar
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Cronograma_MiVivienda_${creditData.value.currency}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const logout = () => {
  authService.logout();
  router.push('/login');
}

onMounted(() => {
  if (!creditData.value?.propertyPrice) router.push('/credit')
  else if (!hasSchedule.value) generateSchedule()
})
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

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  padding: 7px 22px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
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

.summary-card, .schedule-card {
  background: #fff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
  margin-bottom: 2.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.summary-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2.5rem;
}

.label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 800;
  display: block;
  margin-bottom: 12px;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
}

.cuota-highlight {
  color: #145ea8;
  font-size: 2rem;
}

.section-header-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-select {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-weight: 700;
  cursor: pointer;
  background: #fff;
  color: #000;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th {
  background: #f8fafc;
  padding: 1.2rem;
  text-align: left;
  font-weight: 800;
  border-bottom: 2px solid #e2e8f0;
}

.schedule-table td {
  padding: 1.2rem;
  border-bottom: 1px solid #f1f5f9;
}

.total-val {
  font-weight: 800;
  color: #145ea8;
}

.grace-row {
  background-color: #fffbeb;
}

.btn-primary {
  background: #145ea8;
  color: #fff;
  border: none;
  padding: 1rem 1.8rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-secondary {
  background: #fff;
  color: #000;
  border: 1.5px solid #e2e8f0;
  padding: 1rem 1.8rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
}
</style>