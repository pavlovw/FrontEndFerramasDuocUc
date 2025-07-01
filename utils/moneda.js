function convertirCLPaUSD(montoCLP, tasaCambio) {
  if (typeof montoCLP !== 'number' || typeof tasaCambio !== 'number') {
    throw new Error('Datos inválidos');
  }
  return +(montoCLP / tasaCambio).toFixed(2);
}

module.exports = convertirCLPaUSD;
