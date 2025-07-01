describe('CA001 - Login con credenciales válidas', () => {
  it('Debería iniciar sesión y redirigir al catálogo de productos', () => {
    cy.visit('http://localhost:5173/login');

    // Llenar el input del usuario
    cy.get('#login-usuario').type('usuario');

    // Llenar el input de contraseña
    cy.get('#login-password').type('123456');

    // Click en botón Ingresar
    cy.get('.btn-submit-login').click();

    // Verificar redirección
    cy.url().should('include', '/productos');

    // Verificar mensaje de bienvenida (alert)
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Bienvenido');
    });

    // También puedes verificar localStorage si lo deseas
    cy.window().then((win) => {
      const usuarioGuardado = JSON.parse(win.localStorage.getItem('usuario'));
      expect(usuarioGuardado).to.have.property('nombre');
    });
  });
});
