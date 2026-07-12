/// <reference types="cypress" />

import LoginPage from '../../pageObjects/LoginPage';

let loginData;

describe('Feature: Login OrangeHRM', () => {
  
  beforeEach(() => {
    cy.fixture('login.Data').then((data) => {
      loginData = data;
    });

    LoginPage.visit();
    LoginPage.assertLoginPageLoaded();
  });

  it('TC-001: Berhasil login dengan username dan password valid', () => {
    const { validUser } = loginData;

    LoginPage.enterUsername(validUser.username);
    LoginPage.enterPassword(validUser.password);
    LoginPage.clickLogin();

    cy.url().should('not.include', '/auth/login');
  });

  it('TC-002: Gagal login dengan username yang tidak terdaftar', () => {
    const { invalidUser: invalidUsername } = loginData;

    LoginPage.login(invalidUsername.username, invalidUsername.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage('Invalid credentials');
  });

  it('TC-003: Gagal login dengan password yang salah', () => {
    const { wrongPassword: invalidPassword } = loginData;

    LoginPage.login(invalidPassword.username, invalidPassword.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage('Invalid credentials');
    LoginPage.assertUsernameValue('');
  });

  it('TC-004: Gagal login ketika username dan password dikosongkan', () => {
    const { emptyBoth } = loginData;

    LoginPage.login(emptyBoth.username, emptyBoth.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
  });

  it('TC-005: Gagal login ketika hanya mengisi password', () => {
    const { emptyUsername } = loginData;

    LoginPage.login(emptyUsername.username, emptyUsername.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
  });

  it('TC-006: Gagal login ketika hanya mengisi username', () => {
    const { emptyPassword } = loginData;

    LoginPage.login(emptyPassword.username, emptyPassword.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
    LoginPage.assertUsernameValue(emptyPassword.username);
  });

  it('TC-007: Memastikan placeholder pada field username dan password sesuai', () => {
    LoginPage.assertUsernamePlaceholder('Username');
    LoginPage.assertPasswordPlaceholder('Password');
  });

  it('TC-008: Memastikan informasi demo credentials ditampilkan dengan benar', () => {
    LoginPage.assertDemoCredentialsVisible();
  });

  it('TC-009: Memastikan link Forgot Password mengarah ke halaman reset password', () => {
    LoginPage.clickForgotPassword();

    cy.url().should('include', '/auth/requestPasswordResetCode');

    cy.go('back');
    LoginPage.assertLoginPageLoaded();
  });

  it('TC-010: Memastikan login tidak case sensitive pada username', () => {
    const { caseSensitive: caseSensitiveUsername } = loginData;

    LoginPage.login(caseSensitiveUsername.username, caseSensitiveUsername.password);

    cy.url().should('not.include', '/auth/login');
  });

  it('TC-011: Memastikan sistem menangani input SQL injection dengan aman', () => {
    const { sqlInjection } = loginData;

    LoginPage.login(sqlInjection.username, sqlInjection.password);

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage('Invalid credentials');
  });

  it('TC-012: Memastikan semua elemen UI halaman login tampil dengan benar', () => {
    LoginPage.assertLoginTitleVisible();
    LoginPage.assertLoginButtonVisible();
    LoginPage.assertForgotPasswordLinkVisible();
    LoginPage.brandingLogo.should('be.visible');
    LoginPage.orangeHRMLogo.should('be.visible');
    LoginPage.usernameLabel.should('be.visible');
    LoginPage.passwordLabel.should('be.visible');
  });

});