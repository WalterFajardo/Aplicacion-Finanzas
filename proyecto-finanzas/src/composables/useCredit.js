import { ref } from 'vue';
import { calculateSchedule } from '@/services/finance';
import { calculateAllIndicators } from '@/services/finance/indicators'; // Importa la nueva función

const creditData = ref({
  customerName: '',
  propertyPrice: 200000,
  downPayment: 20000,
  bonus: 0,
  annualRate: 10.5,
  termMonths: 120,
  rateType: 'TEA',
  currency: 'PEN',
  graceType: 'NONE',
  graceMonths: 0,
  cok: 12
});

const schedule = ref([]);
const indicators = ref(null); // <-- ¡NUEVO! Para guardar el VAN y TCEA

export function useCredit() {
  const updateCreditData = (data) => {
    creditData.value = { ...creditData.value, ...data };
  };

  const generateSchedule = () => {
    try {
      // Inyectamos el capital calculado antes de procesar
      creditData.value.capital = creditData.value.propertyPrice - creditData.value.downPayment - creditData.value.bonus;

      const result = calculateSchedule(creditData.value);
      schedule.value = result;

      // (nuevo)Calcular Indicadores usando el cronograma y el capital
      indicators.value = calculateAllIndicators(
          creditData.value.capital,
          schedule.value,
          creditData.value.cok
      );
      return true;

    } catch (error) {
      console.error("Error crítico en el cálculo:", error);
      return false;
    }
  };

  return { creditData, schedule, indicators, updateCreditData, generateSchedule };
}