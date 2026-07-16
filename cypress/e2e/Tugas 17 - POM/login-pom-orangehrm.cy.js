/// <reference types="cypress" />

import LoginPage from '../../pageObjects/LoginPage';

let loginData;

describe('Tugas 17 - Login OrangeHRM dengan POM', () => {
  beforeEach(() => {
    cy.fixture('login.Data').then((data) => {
      loginData = data;
    });

    LoginPage.visit();
    LoginPage.assertLoginPageLoaded();
  });

  it('TC-001: Berhasil login dengan username dan password valid', () => {
    const { validUser } = loginData;

    LoginPage.login(validUser.username, validUser.password);
    LoginPage.assertDashboardLoaded();
  });

  it('TC-002: Gagal login dengan username tidak terdaftar', () => {
    const { invalidUser } = loginData;

    LoginPage.login(invalidUser.username, invalidUser.password);
    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage('Invalid credentials');
  });

  it('TC-003: Gagal login dengan password salah', () => {
    const { wrongPassword } = loginData;

    LoginPage.login(wrongPassword.username, wrongPassword.password);
    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage('Invalid credentials');
  });

  it('TC-004: Gagal login saat username dan password kosong', () => {
    const { emptyBoth } = loginData;

    LoginPage.login(emptyBoth.username, emptyBoth.password);
    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
  });

  it('TC-005: Gagal login saat username kosong', () => {
    const { emptyUsername } = loginData;

    LoginPage.login(emptyUsername.username, emptyUsername.password);
    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
  });

  it('TC-006: Gagal login saat password kosong', () => {
    const { emptyPassword } = loginData;

    LoginPage.login(emptyPassword.username, emptyPassword.password);
    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertRequiredError();
  });

  it('TC-007: Memastikan placeholder username dan password sesuai', () => {
    LoginPage.assertUsernamePlaceholder('Username');
    LoginPage.assertPasswordPlaceholder('Password');
  });

  it('TC-008: Memastikan demo credentials tampil', () => {
    LoginPage.assertDemoCredentialsVisible();
  });
});
