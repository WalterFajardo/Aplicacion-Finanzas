export const calculateVAN = (flows, rate) => flows.reduce((acc, val, i) => acc + (val / Math.pow(1 + rate, i)), 0);
export const calculateTIR = (flows) => 0.15; // Placeholder
export const calculateTCEA = (tir) => tir;
export const generateCashFlows = (cap, sch) => [-cap, ...sch.map(p => p.totalPayment)];
export const calculateAllIndicators = (cap, sch, cok) => ({ van: 0, tir: 0, tcea: 0 });
export const formatIndicators = (ind) => ind;