<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <h2>Cronograma de Pagos</h2>
      <p class="subtitle">Metodo Frances Vencido Ordinario - Base 30/360</p>
    </div>

    <div class="credit-summary" v-if="creditData">
      <div class="summary-card">
        <h3>Resumen del Credito</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Capital a Financiar:</span>
            <span class="value">{{ formatCurrency(creditData.capital) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Tasa {{ creditData.rateType }}:</span>
            <span class="value">{{ creditData.annualRate }}%</span>
          </div>
          <div class="summary-item">
            <span class="label">Tasa Mensual Efectiva:</span>
            <span class="value">{{ formatPercentage(creditData.monthlyRate) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Plazo Total:</span>
            <span class="value">{{ creditData.termMonths }} meses ({{ (creditData.termMonths / 12).toFixed(1) }} años)</span>
          </div>
          <div class="summary-item" v-if="creditData.graceType !== 'NONE'">
            <span class="label">Periodo de Gracia:</span>
            <span class="value">{{ creditData.graceMonths }} meses ({{ getGraceTypeLabel(creditData.graceType) }})</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-controls">
      <div class="filter-group">
        <label for="filter">Filtrar:</label>
        <select id="filter" v-model="filter">
          <option value="all">Todos los periodos</option>
          <option value="grace">Solo periodos de gracia</option>
          <option value="amortization">Solo amortizacion</option>
          <option value="first12">Primeros 12 meses</option>
          <option value="last12">Ultimos 12 meses</option>
        </select>
      </div>
      <div class="pagination-info">
        Mostrando {{ filteredSchedule.length }} de {{ schedule.length }} periodos
      </div>
    </div>

    <div class="table-wrapper">
      <table class="schedule-table">
        <thead>
        <tr>
          <th>Mes</th>
          <th>Tipo</th>
          <th class="currency">Saldo Inicial</th>
          <th class="currency">Cuota Base</th>
          <th class="currency">Interes</th>
          <th class="currency">Amortizacion</th>
          <th class="currency">Seg. Desgravamen</th>
          <th class="currency">Seg. Inmueble</th>
          <th class="currency">Cuota Total</th>
          <th class="currency">Saldo Final</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="period in filteredSchedule"
            :key="period.period"
            :class="{ 'grace-row': period.isGracePeriod, 'grace-total': period.graceType === 'TOTAL' }"
        >
          <td class="center">{{ period.period }}</td>
          <td class="center">
              <span class="badge" :class="getBadgeClass(period)">
                {{ getPeriodTypeLabel(period) }}
              </span>
          </td>
          <td class="currency">{{ formatCurrency(period.openingBalance) }}</td>
          <td class="currency">{{ formatCurrency(period.payment) }}</td>
          <td class="currency">{{ formatCurrency(period.interest) }}</td>
          <td class="currency">{{ formatCurrency(period.amortization) }}</td>
          <td class="currency">{{ formatCurrency(period.desgravamen) }}</td>
          <td class="currency">{{ formatCurrency(period.propertyInsurance) }}</td>
          <td class="currency total">{{ formatCurrency(period.totalPayment) }}</td>
          <td class="currency">{{ formatCurrency(period.closingBalance) }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr class="totals-row">
          <td colspan="3"><strong>TOTALES</strong></td>
          <td class="currency">{{ formatCurrency(totals.payments) }}</td>
          <td class="currency">{{ formatCurrency(totals.interest) }}</td>
          <td class="currency">{{ formatCurrency(totals.amortization) }}</td>
          <td class="currency">{{ formatCurrency(totals.desgravamen) }}</td>
          <td class="currency">{{ formatCurrency(totals.propertyInsurance) }}</td>
          <td class="currency total">{{ formatCurrency(totals.totalPayments) }}</td>
          <td class="currency">-</td>
        </tr>
        </tfoot>
      </table>
    </div>

    <div class="info-box" v-if="hasCapitalizedInterest">
      <strong>Nota sobre Gracia Total:</strong> Los intereses capitalizados durante el periodo
      de gracia total fueron: {{ formatCurrency(totalCapitalizedInterest) }}. Este monto se
      sumo al saldo y no aparece como interes pagado.
    </div>

    <div class="navigation-buttons">
      <router-link to="/credit" class="btn btn-secondary">
        Modificar Datos
      </router-link>
      <router-link to="/dashboard" class="btn btn-primary">
        Ver Indicadores Financieros
      </router-link>
    </div>
  </div>
</template>

<script setup>


import { ref, computed } from 'vue'
import { useCredit } from '@/composables/useCredit'

const credit = useCredit()

const filter = ref('all')

const schedule = computed(() => credit.schedule.value)
const creditData = computed(() => credit.creditData.value)

const filteredSchedule = computed(() => {
  const data = schedule.value

  switch (filter.value) {
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

const totals = computed(() => {
  const data = schedule.value
  return {
    payments: data.reduce((sum, p) => sum + (p.payment || 0), 0),
    interest: data.reduce((sum, p) => sum + (p.interest || 0), 0),
    amortization: data.reduce((sum, p) => sum + (p.amortization || 0), 0),
    desgravamen: data.reduce((sum, p) => sum + (p.desgravamen || 0), 0),
    propertyInsurance: data.reduce((sum, p) => sum + (p.propertyInsurance || 0), 0),
    totalPayments: data.reduce((sum, p) => sum + (p.totalPayment || 0), 0)
  }
})

const totalCapitalizedInterest = computed(() => {
  return schedule.value.reduce((sum, p) => sum + (p.capitalizedInterest || 0), 0)
})

const hasCapitalizedInterest = computed(() => {
  return totalCapitalizedInterest.value > 0
})


const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'S/ 0.00'
  return `S/ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0.0000%'
  return `${(value * 100).toFixed(4)}%`
}

const getGraceTypeLabel = (type) => {
  const labels = {
    'NONE': 'Sin gracia',
    'PARTIAL': 'Gracia Parcial',
    'TOTAL': 'Gracia Total'
  }
  return labels[type] || type
}

const getPeriodTypeLabel = (period) => {
  if (!period.isGracePeriod) return 'Normal'
  return period.graceType === 'TOTAL' ? 'G. Total' : 'G. Parcial'
}

const getBadgeClass = (period) => {
  if (!period.isGracePeriod) return 'badge-normal'
  return period.graceType === 'TOTAL' ? 'badge-total' : 'badge-partial'
}
</script>
