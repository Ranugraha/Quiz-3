/// <reference types="cypress" />

describe('Tugas 18 - API Testing dengan Cypress', () => {
  const baseUrl = 'https://reqres.in/api';
  const apiKey = 'free_user_3GaTxz245doCXOjyJQ9xAf1BiGK';

  const requestWithAuth = (method, url, body) => {
    const headers = {};

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const options = {
      method,
      url,
      headers,
      failOnStatusCode: false
    };

    if (body !== undefined) {
      options.body = body;
    }

    return cy.request(options);
  };

  it('TC-001: GET single user', () => {
    requestWithAuth('GET', `${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.id).to.eq(2);
      expect(response.body.data.email).to.eq('janet.weaver@reqres.in');
    });
  });

  it('TC-002: GET single user not found', () => {
    requestWithAuth('GET', `${baseUrl}/users/23`).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.deep.eq({});
    });
  });

  it('TC-003: GET list users', () => {
    requestWithAuth('GET', `${baseUrl}/users?page=2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.page).to.eq(2);
      expect(response.body.data).to.have.length(6);
    });
  });

  it('TC-004: GET unknown resource', () => {
    requestWithAuth('GET', `${baseUrl}/unknown`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.page).to.eq(1);
      expect(response.body.data[0].name).to.eq('cerulean');
    });
  });

  it('TC-005: GET unknown resource not found', () => {
    requestWithAuth('GET', `${baseUrl}/unknown/23`).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.deep.eq({});
    });
  });

  it('TC-006: POST create user', () => {
    requestWithAuth('POST', `${baseUrl}/users`, {
      name: 'morpheus',
      job: 'leader'
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq('morpheus');
      expect(response.body.job).to.eq('leader');
    });
  });

  it('TC-007: PUT update user', () => {
    requestWithAuth('PUT', `${baseUrl}/users/2`, {
      name: 'morpheus',
      job: 'zion resident'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq('morpheus');
      expect(response.body.job).to.eq('zion resident');
    });
  });

  it('TC-008: PATCH update user', () => {
    requestWithAuth('PATCH', `${baseUrl}/users/2`, {
      job: 'QA Engineer'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.job).to.eq('QA Engineer');
    });
  });

  it('TC-009: DELETE user', () => {
    requestWithAuth('DELETE', `${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.eq(204);
      expect(response.body).to.be.empty;
    });
  });

  it('TC-010: POST register success', () => {
    requestWithAuth('POST', `${baseUrl}/register`, {
      email: 'eve.holt@reqres.in',
      password: 'pistol'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(4);
      expect(response.body.token).to.eq('QpwL5tke4Pnpja7X4');
    });
  });

  it('TC-011: POST login success', () => {
    requestWithAuth('POST', `${baseUrl}/login`, {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.eq('QpwL5tke4Pnpja7X4');
    });
  });

  it('TC-012: POST login unsuccessful', () => {
    requestWithAuth('POST', `${baseUrl}/login`, { email: 'peter@klaven' }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq('Missing password');
    });
  });
});
