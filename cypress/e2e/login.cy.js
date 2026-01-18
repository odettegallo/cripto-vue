describe('Login Page', () => {
  beforeEach(() => {
    // Usamos la configuración de baseUrl definida en cypress.config.js
    cy.visit('/');
  });

  it('should display the login form', () => {
    // En Vuetify, el formulario no tiene id="loginForm"
    // Buscamos la etiqueta <form> directamente
    cy.get('form').should('be.visible');
    cy.get('input[type="email"]').should('exist'); // 'exist' en lugar de 'be.visible' por el tema de opacity
    cy.get('input[type="password"]').should('exist');
  });

  it('should show error message on invalid login', () => {
    // Usamos { force: true } para bypass el opacity: 0 de Vuetify
    cy.get('input[type="email"]').type('invalid@user.com', { force: true });
    cy.get('input[type="password"]').type('wrongPassword', { force: true });
    cy.get('button[type="submit"]').click();

    // En tu LoginView.vue usas v-alert para errores
    // Vuetify renderiza esto con la clase .v-alert
    cy.get('.v-alert')
      .should('be.visible')
      .and('contain', 'Error al iniciar sesión');
  });

  it('should login successfully with valid credentials', () => {
    // Obtenemos los datos desde las variables de entorno
    const email = Cypress.env('valid_username'); 
    const password = Cypress.env('valid_password');

    cy.get('input[type="email"]').type(email, { force: true });
    cy.get('input[type="password"]').type(password, { force: true });
    
    // Hacemos click y esperamos la navegación
    cy.get('button[type="submit"]').click();

    // Según tu router (index.js), la ruta de éxito es /home
    // El authStore redirige a /home tras detectar el cambio de estado en Firebase
    cy.url().should('include', '/home');
    
    // Verificamos el mensaje que inyecta subscribeToAuthState
    cy.contains('¡Bienvenido al Crypto Portal!').should('be.visible');
  });
});