/// <reference types="Cypress" />

import * as user from "../../../fixtures/Users.json";

let adminAccessToken, user1AccessToken;
describe("Testing post request to /login api", () => {
  it("Testing login api without password [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/login",
      body: {
        username: user.AdminName,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });
  it("Testing login api without username [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/login",
      body: {
        password: user.AdminPassword,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });
  it("Testing login api with incorrect password [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/login",
      body: {
        username: user.AdminName,
        password: "SomeInvalidPassword",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_credentials");
    });
  });
  it("Testing login api with correct password", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/login",
      body: {
        username: user.AdminName,
        password: user.AdminPassword,
      },
    }).then((res) => {
      expect(res.body).to.have.property("access_token");
      expect(res.body).to.have.property("expires_in");
      adminAccessToken = res.body.access_token;
    });
  });
});

describe("Testing post request to /create api", () => {
  it("Testing create api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      body: {
        ...user.user1,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });
  it("Testing create api with missing username [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
        username: "",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });
  it("Testing create api with missing password [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
        password: "",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });
  it("Testing create api with missing role [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
        role: "",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });
  it("Testing create api with invalid role [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
        role: "abc",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  });

  // it("Testing create api with missing email", () => {
  //   cy.request({
  //     method: "POST",
  //     url: Cypress.env("authURL") + "/create",
  //     headers: {
  //       authorization: `Bearer ${adminAccessToken}`,
  //     },
  //     body: {
  //       ...user.user1,
  //       email: "",
  //     },
  //     failOnStatusCode: false,
  //   }).then((res) => {
  //     expect(res.body).to.have.property("error");
  //     expect(res.body).to.have.property("error_description");
  //     expect(res.body.error).to.eq("invalid_request");
  //   });
  // });

  // it("Testing create api with missing name", () => {
  //   cy.request({
  //     method: "POST",
  //     url: Cypress.env("authURL") + "/create",
  //     headers: {
  //       authorization: `Bearer ${adminAccessToken}`,
  //     },
  //     body: {
  //       ...user.user1,
  //       name: "",
  //     },
  //     failOnStatusCode: false,
  //   }).then((res) => {
  //     expect(res.body).to.have.property("error");
  //     expect(res.body).to.have.property("error_description");
  //     expect(res.body.error).to.eq("invalid_credentials");
  //   });
  // });
  it("Creating a new user by an admin role user", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
      },
    }).then((res) => {
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("username");
      expect(res.body).to.have.property("role");
    });
  });
  it("Creating a new user by a non-admin role user [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/login",
      body: {
        username: user.user1.username,
        password: user.user1.password,
      },
    })
      .then((res) => {
        expect(res.body).to.have.property("access_token");
        expect(res.body).to.have.property("expires_in");
        user1AccessToken = res.body.access_token;
      })
      .then(() => {
        return cy.request({
          method: "POST",
          url: Cypress.env("authURL") + "/create",
          headers: {
            authorization: `Bearer ${user1AccessToken}`,
          },
          body: {
            ...user.user2,
          },
          failOnStatusCode: false,
        });
      })
      .then((res) => {
        expect(res.body).to.have.property("error");
        expect(res.body).to.have.property("error_description");
        expect(res.body.error).to.eq("unauthorized");
      });
  });
  it("Creating a new user with existing username [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + "/create",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        ...user.user1,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("user_exists");
    });
  });
});

describe("Testing get request to /users api", () => {
  it("Testing users api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + "/users",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });
  it("Testing users api by admin role user", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + "/users",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.not.equal(0);
      res.body.forEach((userData) => {
        expect(userData).to.have.property("_id");
        expect(userData).to.have.property("username");
        expect(userData).to.have.property("role");
      });
    });
  });
  it("Testing users api by user role user", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + "/users",
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.not.equal(0);
      res.body.forEach((userData) => {
        expect(userData).to.have.property("_id");
        expect(userData).to.have.property("username");
        expect(userData).to.have.property("role");
      });
    });
  });
});
