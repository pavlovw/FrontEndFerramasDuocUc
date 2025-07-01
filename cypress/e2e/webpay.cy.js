describe('CA002 - Pago exitoso con WebPay (simulado)', () => {
  before(() => {
    cy.visit('http://localhost:5173/login');
    cy.get('#login-usuario').type('usuario');
    cy.get('#login-password').type('123456');
    cy.get('.btn-submit-login').click();
    cy.url().should('include', '/productos');
  });

  it('Agrega producto y simula pago exitoso', () => {
    // Agregar producto
    cy.contains('Agregar al carrito').first().click();
    cy.visit('http://localhost:5173/carrito');
    cy.get('.carrito-item').should('exist');

    // Interceptar transacción (mock)
    cy.intercept('POST', 'http://localhost:3000/api/webpay/iniciar', {
      statusCode: 200,
      body: {
        url: 'http://localhost:3000/api/webpay/respuesta',
        token: 'tokentest123'
      }
    }).as('iniciarPago');

    // Clic en pagar
    cy.get('.boton-verde').contains('Pagar con Tarjeta').click();
    cy.wait('@iniciarPago');

    // Simular confirmación
    cy.request('GET', 'http://localhost:3000/api/webpay/respuesta?token_ws=tokentest123');

    // Ver resultado
    cy.visit('http://localhost:5173/webpay-respuesta?estado=AUTHORIZED&orden=999');

    cy.contains('Pago exitoso').should('exist');
    cy.contains('Orden #999').should('exist');
  });
});
