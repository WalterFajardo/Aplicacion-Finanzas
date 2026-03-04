export const calculateVAN = (flows, rate) => flows.reduce((acc, val, i) => acc + (val / Math.pow(1 + rate, i)), 0);
export const calculateTIR = (flows) => {
    let limiteInferior = 0.0;
    let limiteSuperior = 1.0;
    let tirMensual = 0;
    let vanTir = 0;
    let iteraciones = 0;

    do {
        tirMensual = (limiteInferior + limiteSuperior) / 2;
        vanTir = calculateVAN(flows, tirMensual);

        if (vanTir > 0) {
            limiteInferior = tirMensual;
        } else {
            limiteSuperior = tirMensual;
        }
        iteraciones++;
    } while (Math.abs(vanTir) > 0.001 && iteraciones < 1000);

    return tirMensual;
};
//export const calculateTCEA = (tir) => tir;
export const calculateTCEA = (tirMensual) => (Math.pow(1 + tirMensual, 12) - 1) * 100;
export const generateCashFlows = (cap, sch) => [-cap, ...sch.map(p => p.totalPayment)];
export const calculateAllIndicators = (cap, sch, cokAnual) => {
    const flujos = generateCashFlows(cap, sch);

    // Convertir COK anual a mensual
    const cokMensual = Math.pow(1 + (cokAnual / 100), 1 / 12) - 1;

    const van = calculateVAN(flujos, cokMensual);
    const tirMensual = calculateTIR(flujos);
    const tcea = calculateTCEA(tirMensual);
    const esViable = van > 0;

    return {
        van,
        tirMensual,
        tcea,
        esViable,
        mensaje: esViable
            ? "El financiamiento es viable bajo las condiciones actuales."
            : "Se sugiere revisar las condiciones del financiamiento."
    };
};export const formatIndicators = (ind) => ind;