const convertirCLPaUSD = require('../utils/moneda');

describe('Conversión de CLP a USD', () => {
  test('Convierte correctamente con tasa de cambio válida', () => {
    const resultado = convertirCLPaUSD(1000, 900);
    expect(resultado).toBeCloseTo(1.11, 2);
  });

  test('Lanza error si los valores no son numéricos', () => {
    expect(() => convertirCLPaUSD('1000', '800')).toThrow('Datos inválidos');
  });

  test('Convierte 0 correctamente', () => {
    const resultado = convertirCLPaUSD(0, 900);
    expect(resultado).toBe(0);
  });

  test('Convierte valores altos', () => {
    const resultado = convertirCLPaUSD(1000000, 1000);
    expect(resultado).toBe(1000);
  });
});
