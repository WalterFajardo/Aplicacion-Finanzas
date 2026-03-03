export const convertTNAToMonthlyRate = (tna) => (tna / 100) / 12;
export const convertTEAToMonthlyRate = (tea) => Math.pow(1 + (tea / 100), 1 / 12) - 1;
export const convertToMonthlyRate = (rate, type) =>
    type === 'TNA' ? convertTNAToMonthlyRate(rate) : convertTEAToMonthlyRate(rate);
export const convertMonthlyToTEA = (monthlyRate) => (Math.pow(1 + monthlyRate, 12) - 1) * 100;
export const formatRateForDisplay = (rate) => `${(rate * 100).toFixed(2)}%`;