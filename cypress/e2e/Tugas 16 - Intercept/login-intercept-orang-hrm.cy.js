/// <reference types="cypress" />

import LoginPage from "../../pageObjects/LoginPage";

let loginData;

describe("Tugas 16 - Feature: Login OrangeHRM dengan Intercept", () => {
  beforeEach(() => {
    cy.fixture("login.Data").then((data) => {
      loginData = data;
    });

    LoginPage.visit();
    LoginPage.assertLoginPageLoaded();
  });

  // ==========================================================
  // TC-001 Login Berhasil
  // ==========================================================
  it("TC-001: Berhasil login dengan username dan password valid", () => {
    const { validUser } = loginData;

    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginSuccess");

    LoginPage.login(validUser.username, validUser.password);

    cy.wait("@loginSuccess").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      expect(request.body).to.include(validUser.username);
      expect(response.statusCode).to.eq(302);
    });

    cy.url().should("include", "/dashboard");
  });

  // ==========================================================
  // TC-002 Username Tidak Terdaftar
  // ==========================================================
  it("TC-002: Gagal login dengan username yang tidak terdaftar", () => {
    const { invalidUser } = loginData;

    cy.intercept("POST", "**/web/index.php/auth/validate").as("loginInvalid");

    LoginPage.login(invalidUser.username, invalidUser.password);

    cy.wait("@loginInvalid").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      expect(request.body).to.include(invalidUser.username);
      expect(response.statusCode).to.eq(302);
    });

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage("Invalid credentials");
  });

  // ==========================================================
  // TC-003 Password Salah
  // ==========================================================
  it("TC-003: Gagal login dengan password yang salah", () => {
    const { wrongPassword } = loginData;

    cy.intercept("POST", "**/web/index.php/auth/validate").as("wrongPassword");

    LoginPage.login(wrongPassword.username, wrongPassword.password);

    cy.wait("@wrongPassword").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      expect(request.body).to.include(wrongPassword.username);
      expect(response.statusCode).to.eq(302);
    });

    LoginPage.assertUrlIsLoginPage();
    LoginPage.assertErrorMessage("Invalid credentials");
    LoginPage.assertUsernameValue("");
    LoginPage.assertPasswordValue("");
  });

  // ==========================================================
  // TC-004 Username & Password Kosong
  // ==========================================================
  it("TC-004: Username dan Password kosong", () => {
    const { emptyBoth } = loginData;

    LoginPage.login(emptyBoth.username, emptyBoth.password);

    LoginPage.assertRequiredError();
  });

  // ==========================================================
  // TC-005 Username Kosong
  // ==========================================================
  it("TC-005: Username kosong", () => {
    const { emptyUsername } = loginData;

    LoginPage.login(emptyUsername.username, emptyUsername.password);

    LoginPage.assertRequiredError();
  });

  // ==========================================================
  // TC-006 Password Kosong
  // ==========================================================
  it("TC-006: Password kosong", () => {
    const { emptyPassword } = loginData;

    LoginPage.login(emptyPassword.username, emptyPassword.password);

    LoginPage.assertRequiredError();
    LoginPage.assertUsernameValue(emptyPassword.username);
  });

  // ==========================================================
  // TC-007 Placeholder
  // ==========================================================
  it("TC-007: Placeholder Username & Password", () => {
    LoginPage.assertUsernamePlaceholder("Username");
    LoginPage.assertPasswordPlaceholder("Password");
  });

  // ==========================================================
  // TC-008 Demo Credentials
  // ==========================================================
  it("TC-008: Demo Credentials tampil", () => {
    LoginPage.assertDemoCredentialsVisible();
  });

  // ==========================================================
  // TC-009 Forgot Password
  // ==========================================================
  it("TC-009: Forgot Password", () => {
    cy.intercept("GET", "**/auth/requestPasswordResetCode").as("forgot");

    LoginPage.clickForgotPassword();

    cy.wait("@forgot").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });

    cy.url().should("include", "/auth/requestPasswordResetCode");

    cy.go("back");

    LoginPage.assertLoginPageLoaded();
  });

  // ==========================================================
  // TC-010 Username Case Sensitive
  // ==========================================================
  it("TC-010: Username huruf besar/kecil", () => {
    const { caseSensitive } = loginData;

    cy.intercept("POST", "**/web/index.php/auth/validate").as("caseLogin");

    LoginPage.login(caseSensitive.username, caseSensitive.password);

    cy.wait("@caseLogin").then(({ response }) => {
      expect(response.statusCode).to.eq(302);
    });
  });

  // ==========================================================
  // TC-011 SQL Injection
  // ==========================================================
  it("TC-011: SQL Injection", () => {
    const { sqlInjection } = loginData;

    cy.intercept("POST", "**/web/index.php/auth/validate").as("sql");

    LoginPage.login(sqlInjection.username, sqlInjection.password);

    cy.wait("@sql").then(({ response }) => {
      expect(response.statusCode).to.eq(302);
    });

    LoginPage.assertErrorMessage("Invalid credentials");
  });

  // ==========================================================
  // TC-012 Validasi UI Login
  // ==========================================================
  it("TC-012: Validasi seluruh komponen Login", () => {
    LoginPage.assertLoginTitleVisible();
    LoginPage.assertLoginButtonVisible();
    LoginPage.assertForgotPasswordLinkVisible();
    LoginPage.assertDemoCredentialsVisible();
    LoginPage.assertUsernamePlaceholder("Username");
    LoginPage.assertPasswordPlaceholder("Password");

    LoginPage.brandingLogo.should("be.visible");
    LoginPage.orangeHRMLogo.should("be.visible");
    LoginPage.usernameLabel.should("be.visible");
    LoginPage.passwordLabel.should("be.visible");
  });
});
