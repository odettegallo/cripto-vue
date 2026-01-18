describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
    it('should display the login form', () => {
    cy.get('form#loginForm').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error message on invalid login', () => {
    cy.get('input[name="username"]').type('invalidUser');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('be.visible').and('contain', 'Invalid username or password');
  });
    it('should login successfully with valid credentials', () => {      
    cy.get('input[name="username"]').type('validUser');
    cy.get('input[name="password"]').type('correctPassword');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('.welcome-message').should('be.visible').and('contain', 'Welcome, validUser');
  });
});