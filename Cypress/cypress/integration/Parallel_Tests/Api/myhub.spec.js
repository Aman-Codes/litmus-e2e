/// <reference types="Cypress" />

import * as user from "../../../fixtures/Users.json";
import { addMyHub, updateMyHub, deleteMyHub } from "../../../fixtures/graphql/mutation";
import { getHubStatus } from "../../../fixtures/graphql/queries";
import * as myhubInput from "../../../fixtures/myhubInput.json";

describe("Testing myHub api", () => {
  let project1Id, project2Id, hubId;
  before(
		"Create user1 with editor role in project1 and user2 with viewer role in project2",
		() => {
      cy.task('getSecuritySetupVariable').then((setupVariable) => {
        if(!setupVariable) {
          cy.securityCheckSetup().then((createdSetupVariable) => {
            project1Id = createdSetupVariable.project1Id;
            project2Id = createdSetupVariable.project2Id;          
            cy.task('setSetupVariable', createdSetupVariable);
          })
        } else {
          project1Id = setupVariable.project1Id;
          project2Id = setupVariable.project2Id;
        }
      });
		}
	);

  it("Adding a new MyHub to a project with no access [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "addMyHub",
        "variables": {
          myhubInput: myhubInput.default,
          "projectID": project1Id,
        },
        "query": addMyHub
      },
      failOnStatusCode: false
    }).then((res) => {
      cy.validateErrorMessage(res, "permission_denied");
    });
  });

  it("Fetching status of the MyHub of a project with no access [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "getHubStatus",
        "variables": {
          "projectID": project1Id,
        },
        "query": getHubStatus
      },
      failOnStatusCode: false
    }).then((res) => {
      cy.validateErrorMessage(res, "permission_denied");
    });
  });

  it("Adding a new MyHub to a project with viewer access [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "addMyHub",
        "variables": {
          myhubInput: myhubInput.default,
          "projectID": project2Id,
        },
        "query": addMyHub
      },
      failOnStatusCode: false
    }).then((res) => {
      cy.validateErrorMessage(res, "permission_denied");
    });
  });

  it("Fetching status of the MyHub of a project with viewer access", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "getHubStatus",
        "variables": {
          "projectID": project2Id,
        },
        "query": getHubStatus
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.nested.property("data.getHubStatus[0].id");
    });
  });

  it("Adding a new MyHub to a project with editor access", () => {
    cy.logout();
    cy.requestLogin(user.user1.username, user.user1.password);
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "addMyHub",
        "variables": {
          myhubInput: myhubInput.default,
          "projectID": project1Id,
        },
        "query": addMyHub
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.nested.property("data.addMyHub.id");
      hubId = res.body.data.addMyHub.id;
    });
  });

  it("Fetching status of the MyHub of a project with editor access", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "getHubStatus",
        "variables": {
          "projectID": project1Id,
        },
        "query": getHubStatus
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.nested.property("data.getHubStatus[0].id");
    });
  });

  it("Updating the hub configuration of a project with editor access", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "updateMyHub",
        "variables": {
          myhubInput: {
            ...myhubInput.default,
            id: hubId,
            HubName: "my-chaos-hub-1"
          },
          "projectID": project1Id,
        },
        "query": updateMyHub
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.nested.property("data.updateMyHub.HubName");
      expect(res.body.data.updateMyHub.HubName).to.eq("my-chaos-hub-1");
    });
  });

  it("Updating the hub configuration of a project with no access [ Should not be possible ]", () => {
    cy.logout();
    cy.requestLogin(user.user2.username, user.user2.password);
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "updateMyHub",
        "variables": {
          myhubInput: {
            ...myhubInput.default,
            id: hubId,
            HubName: "my-chaos-hub"
          },
          "projectID": project1Id,
        },
        "query": updateMyHub
      },
      failOnStatusCode: false
    }).then((res) => {
      cy.validateErrorMessage(res, "permission_denied");
    });
  });

  // it("Deleting the hub of a project with no access [ Should not be possible ]", () => {
  //   cy.logout();
  //   cy.requestLogin(user.user2.username, user.user2.password);
  //   cy.request({
  //     method: "POST",
  //     url: Cypress.env("apiURL") + '/query',
  //     body: { 
  //       "operationName": "deleteMyHub",
  //       "variables": {
  //         "hub_id": hubId
  //       },
  //       "query": deleteMyHub
  //     },
  //     failOnStatusCode: false
  //   }).then((res) => {
  //     cy.validateErrorMessage(res, "permission_denied");
  //   });
  // });

  it("Deleting the hub of a project with editor access", () => {
    cy.logout();
    cy.requestLogin(user.user1.username, user.user1.password);
    cy.request({
      method: "POST",
      url: Cypress.env("apiURL") + '/query',
      body: { 
        "operationName": "deleteMyHub",
        "variables": {
          "hub_id": hubId
        },
        "query": deleteMyHub
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.nested.property("data.deleteMyHub");
      expect(res.body.data.deleteMyHub).to.eq(true);
    });
  });
});
