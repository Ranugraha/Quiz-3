describe('Login Test OrangeHRM', () => {
  it('Berhasil login dengan kredensial valid', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com');
    
    cy.url().should('include', '/auth/login');
    cy.get('.orangehrm-login-title').should('have.text', 'Login');
    
    cy.get('input[name="username"]').type('Admin');
    
    cy.get('input[name="username"]').should('have.value', 'Admin');
    
    cy.get('input[type="password"]').type('admin123');
    
    cy.get('input[type="password"]').should('have.value', 'admin123');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-title').should('have.text', 'Dashboard');
    
    cy.get('.oxd-sidepanel').should('exist');
    cy.get('.oxd-main-menu-item').should('have.length', 12);
  });
});