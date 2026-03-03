export * from './rateConverter';
export * from './indicators';
import { convertToMonthlyRate } from './rateConverter';

export const calculateSchedule = (data) => {
  const schedule = [];

  const propertyPrice = parseFloat(data.propertyPrice) || 0;
  const downPayment = parseFloat(data.downPayment) || 0;
  const bonus = parseFloat(data.bonus) || 0;

  let balance = propertyPrice - downPayment - bonus;
  const totalMonths = parseInt(data.termMonths) || 0;
  const graceMonths = parseInt(data.graceMonths) || 0;
  const graceType = (data.graceType || 'NONE').toUpperCase();

  const monthlyRate = convertToMonthlyRate(data.annualRate, data.rateType);
  const insuranceRates = {
    desgravamen: 0.0005, // 0.05% sobre saldo
    property: 0.0002     // 0.02% sobre valor de vivienda
  };

  // Generación de Cuotas (Método Francés 30/360)
  for (let month = 1; month <= totalMonths; month++) {
    const isGracePeriod = month <= graceMonths;
    const interest = balance * monthlyRate;

    // Cálculo de Seguros
    const segDesgravamen = balance * insuranceRates.desgravamen;
    const segInmueble = propertyPrice * insuranceRates.property;

    let payment = 0;
    let amortization = 0;
    let capitalizedInterest = 0;

    if (isGracePeriod) {
      if (graceType === 'TOTAL') {
        // Interés se suma al capital (Capitalización)
        payment = 0;
        amortization = 0;
        capitalizedInterest = interest;
        balance += interest;
      } else if (graceType === 'PARTIAL') {
        // Solo se pagan intereses y seguros
        payment = interest;
        amortization = 0;
      }
    } else {
      // Cálculo de Cuota Constante (Método Francés)
      const remainingMonths = totalMonths - Math.max(month - 1, graceMonths);
      payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);

      amortization = payment - interest;
    }

    const totalPayment = payment + segDesgravamen + segInmueble;
    const openingBalance = (graceType === 'TOTAL' && isGracePeriod) ? balance - interest : balance;
    const closingBalance = (graceType === 'TOTAL' && isGracePeriod) ? balance : balance - amortization;

    schedule.push({
      period: month,
      openingBalance: openingBalance,
      interest: interest,
      payment: payment,
      desgravamen: segDesgravamen,
      propertyInsurance: segInmueble,
      amortization: amortization,
      capitalizedInterest: capitalizedInterest,
      totalPayment: totalPayment,
      closingBalance: Math.max(0, closingBalance),
      isGracePeriod: isGracePeriod,
      graceType: graceType
    });

    // Actualizar saldo para el siguiente mes
    if (!(graceType === 'TOTAL' && isGracePeriod)) {
      balance = closingBalance;
    }
  }

  return schedule;
};

export {
  convertTNAToMonthlyRate,
  convertTEAToMonthlyRate,
  convertToMonthlyRate,
  convertMonthlyToTEA,
  formatRateForDisplay
} from './rateConverter';

export {
  calculateVAN,
  calculateTIR,
  calculateTCEA,
  generateCashFlows,
  calculateAllIndicators,
  formatIndicators
} from './indicators';