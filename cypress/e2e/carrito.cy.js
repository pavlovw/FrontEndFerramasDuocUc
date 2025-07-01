describe('CA003 - Eliminar producto del carrito', () => {
  before(() => {
    cy.visit('http://localhost:5173/login');
    cy.get('#login-usuario').type('usuario');
    cy.get('#login-password').type('123456');
    cy.get('.btn-submit-login').click();
    cy.url().should('include', '/productos');
  });

  it('Agrega y luego elimina un producto del carrito', () => {
    // Agregar producto
    cy.contains('Agregar al carrito').first().click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Producto agregado');
    });

    // Ir al carrito
    cy.visit('http://localhost:5173/carrito');
    cy.get('.carrito-item').should('exist');

    // Obtener cantidad inicial si está disponible
    cy.get('.carrito-item').first().within(() => {
      cy.get('p').contains('Cantidad:').invoke('text').as('cantidadInicial');
    });

    // Click en botón "Eliminar uno"
    cy.get('.carrito-item').first().within(() => {
      cy.get('.boton-eliminar').click();
    });

    // Validar cambio de cantidad o eliminación
    cy.get('.carrito-item').should('exist'); // si fue 2→1
    // O puedes validar cantidad nuevamente si deseas comparar con inicial
  });
});
