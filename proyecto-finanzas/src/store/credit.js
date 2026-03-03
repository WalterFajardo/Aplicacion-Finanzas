import { reactive } from 'vue'

export const CONFIG = {
  BASE_DIAS_AÑO: 360,
  BASE_DIAS_MES: 30,
  TASA_DESGRAVAMEN: 0.05, // % Mensual
  TASA_INMUEBLE: 0.02,    // % Mensual
}

export const creditStore = {
  state: reactive({
    creditData: {
      customerName: '',
      dni: '',
      monthlyIncome: 0,
      bankEntity: '',
      currency: 'PEN',
      propertyPrice: 200000,
      downPayment: 20000,
      bonus: 0,
      rateType: 'TEA',
      capitalization: 'diaria',
      annualRate: 10.5,
      termMonths: 120,
      graceType: 'none',
      graceMonths: 0,
      cok: 12
    },
    schedule: [],
    indicators: {},
    isCalculated: false
  }),

  updateCreditData(data) {
    Object.assign(this.state.creditData, data)
  },

  setSchedule(newSchedule) {
    this.state.schedule = newSchedule
    this.state.isCalculated = true
  },

  setIndicators(newIndicators) {
    this.state.indicators = newIndicators
  }
}