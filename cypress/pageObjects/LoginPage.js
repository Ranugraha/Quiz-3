class LoginPage {
  // ==========================================
  // SELECTORS (Element Locators)
  // ==========================================
  
  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[type="password"]');
  }

  get loginButton() {
    return cy.get('button[type="submit"]');
  }

  get loginTitle() {
    return cy.get('.orangehrm-login-title');
  }

  get errorMessage() {
    return cy.get('.oxd-alert-content-text');
  }

  get requiredError() {
    return cy.get('.oxd-input-field-error-message');
  }

  get brandingLogo() {
    return cy.get('img[alt="company-branding"]');
  }

  get orangeHRMLogo() {
    return cy.get('img[alt="orangehrm-logo"]');
  }

  get demoCredentials() {
    return cy.get('.orangehrm-demo-credentials');
  }

  get forgotPasswordLink() {
    return cy.get('.orangehrm-login-forgot-header');
  }

  get loginForm() {
    return cy.get('form[action*="validate"]');
  }

  get usernameLabel() {
    return cy.get('label').contains('Username');
  }

  get passwordLabel() {
    return cy.get('label').contains('Password');
  }

  // ==========================================
  // ACTIONS
  // ==========================================
  
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com');
  }

  enterUsername(username) {
    if (username) {
      this.usernameInput.clear().type(username);
    } else {
      this.usernameInput.clear();
    }
  }

  enterPassword(password) {
    if (password) {
      this.passwordInput.clear().type(password);
    } else {
      this.passwordInput.clear();
    }
  }

  clickLogin() {
    this.loginButton.click();
  }

  clickForgotPassword() {
    this.forgotPasswordLink.click();
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  // ==========================================
  // ASSERTIONS (Hanya di halaman login)
  // ==========================================
  
  assertLoginPageLoaded() {
    this.loginTitle.should('have.text', 'Login');
    this.brandingLogo.should('be.visible');
    this.orangeHRMLogo.should('be.visible');
    this.loginForm.should('exist');
  }

  assertErrorMessage(expectedText) {
    this.errorMessage.should('be.visible').and('contain', expectedText);
  }

  assertRequiredError() {
    this.requiredError.should('be.visible');
  }

  assertUrlIsLoginPage() {
    cy.url().should('include', '/auth/login');
  }

  assertDashboardLoaded() {
    cy.location('pathname').should('include', '/dashboard');
  }

  assertUsernameValue(expectedValue) {
    this.usernameInput.should('have.value', expectedValue);
  }

  assertPasswordValue(expectedValue) {
    this.passwordInput.should('have.value', expectedValue);
  }

  assertDemoCredentialsVisible() {
    this.demoCredentials.should('be.visible');
    this.demoCredentials.should('contain', 'Username : Admin');
    this.demoCredentials.should('contain', 'Password : admin123');
  }

  assertLoginButtonVisible() {
    this.loginButton.should('be.visible');
  }

  assertUsernamePlaceholder(expected) {
    this.usernameInput.should('have.attr', 'placeholder', expected);
  }

  assertPasswordPlaceholder(expected) {
    this.passwordInput.should('have.attr', 'placeholder', expected);
  }

  assertForgotPasswordLinkVisible() {
    this.forgotPasswordLink.should('be.visible');
  }

  assertLoginTitleVisible() {
    this.loginTitle.should('be.visible').and('have.text', 'Login');
  }
}

export default new LoginPage();