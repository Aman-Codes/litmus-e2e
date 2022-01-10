/// <reference types="Cypress" />

import * as user from "../../../fixtures/Users.json";

const checkErrorMessage = (res, message) => {
  expect(res.status).to.not.eq(200);
  expect(res.body).to.have.nested.property("errors[0].message");
  expect(res.body.errors[0].message).to.eq(message);
};

describe("Testing myHub api", () => {
  before(
		"Clearing the cookies, login as admin and fetch project id",
		() => {
			cy.requestLogin(user.AdminName, user.AdminPassword);
      cy.getCookie("litmus-cc-token").then((token) => {
        cy.request({
          method: "GET",
          url: Cypress.env("authURL") + "/list_projects",
          headers: {
            authorization: `Bearer ${token.value}`,
          },
        })
          .its("body")
          .then((res) => {
            cy.task('setProjectID', res.data[0].ID);
          });
      });
		}
	);

  it("Adding a new MyHub with missing HubName", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "RepoURL": "https://github.com/litmuschaos/chaos-charts",
              "RepoBranch": "master",
              "IsPrivate": false,
              "AuthType": "basic",
              "UserName": "user",
              "Password": "user",
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
            }
          }`
        },
        failOnStatusCode: false
      }).then((res) => {
        checkErrorMessage(res, "must be defined");
      });
    });		
  });

  it("Adding a new MyHub with missing RepoURL", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "HubName": "my-chaos-hub",
              "RepoBranch": "master",
              "IsPrivate": false,
              "AuthType": "basic",
              "UserName": "user",
              "Password": "user",
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
            }
          }`
        },
        failOnStatusCode: false
      }).then((res) => {
        checkErrorMessage(res, "must be defined");
      });
    });		
  });

  it("Adding a new MyHub with missing RepoBranch", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "HubName": "my-chaos-hub",
              "RepoURL": "https://github.com/litmuschaos/chaos-charts",
              "IsPrivate": false,
              "AuthType": "basic",
              "UserName": "user",
              "Password": "user",
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
            }
          }`
        },
        failOnStatusCode: false
      }).then((res) => {
        checkErrorMessage(res, "must be defined");
      });
    });		
  });

  it("Adding a new MyHub with missing private flag", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "HubName": "my-chaos-hub",
              "RepoURL": "https://github.com/litmuschaos/chaos-charts",
              "RepoBranch": "master",
              "AuthType": "basic",
              "UserName": "user",
              "Password": "user",
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
            }
          }`
        },
        failOnStatusCode: false
      }).then((res) => {
        checkErrorMessage(res, "must be defined");
      });
    });		
  });

  it("Adding a new MyHub with missing auth", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "HubName": "my-chaos-hub",
              "RepoURL": "https://github.com/litmuschaos/chaos-charts",
              "RepoBranch": "master",
              "IsPrivate": false,
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
            }
          }`
        },
        failOnStatusCode: false
      }).then((res) => {
        checkErrorMessage(res, "must be defined");
      });
    });		
  });


  it("Adding a new MyHub with correct details", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "addMyHub",
          "variables": {
            "myhubInput": {
              "HubName": "my-chaos-hub",
              "RepoURL": "https://github.com/litmuschaos/chaos-charts",
              "RepoBranch": "master",
              "IsPrivate": false,
              "AuthType": "basic",
              "UserName": "user",
              "Password": "user",
            },
            "projectID": project_id,
          },
          "query": `mutation addMyHub($myhubInput: CreateMyHub!, $projectID: String!){
            addMyHub(myhubInput: $myhubInput, projectID: $projectID){
              id
              RepoURL
              RepoBranch
              ProjectID
              HubName
              IsPrivate
              AuthType
              Token
              UserName
              Password
              SSHPrivateKey
              IsRemoved
              CreatedAt
              UpdatedAt
              LastSyncedAt
            }
          }`
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.nested.property("data.addMyHub");
      });
    });		
  });

  it("Fetching hub status", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "getHubStatus",
          "variables": {
            "projectID": project_id,
          },
          "query": `query getHubStatus($projectID: String!){
            getHubStatus(projectID: $projectID){
              id
              RepoURL
              RepoBranch
              IsAvailable
              TotalExp
              HubName
              IsPrivate
              AuthType
              Token
              UserName
              Password
              IsRemoved
              SSHPrivateKey
              SSHPublicKey
              LastSyncedAt
            }
          }`
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.nested.property("data.getHubStatus");
        cy.task('setHubID', res.body.data.getHubStatus[0].id);
      });
    });		
  });

  it("Updating the hub configuration", () => {
    cy.task('getProjectID').then((project_id) => {
      cy.task('getHubID').then((hub_id) => {
        cy.request({
          method: "POST",
          url: Cypress.env("apiURL") + '/query',
          body: { 
            "operationName": "updateMyHub",
            "variables": {
              "myhubInput": {
                "id": hub_id,
                "HubName": "my-chaos-hub-1",
                "RepoURL": "https://github.com/litmuschaos/chaos-charts",
                "RepoBranch": "master",
                "IsPrivate": false,
                "AuthType": "basic",
                "UserName": "user",
                "Password": "user",
              },
              "projectID": project_id,
            },
            "query": `mutation updateMyHub($myhubInput: UpdateMyHub!, $projectID: String!){
              updateMyHub(myhubInput: $myhubInput, projectID: $projectID){
                id
                RepoURL
                RepoBranch
                ProjectID
                HubName
                IsPrivate
                AuthType
                Token
                UserName
                Password
                SSHPrivateKey
                IsRemoved
                CreatedAt
                UpdatedAt
                LastSyncedAt
              }
            }`
          },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.nested.property("data.updateMyHub");
        });
      });
    });	
  });

  // it("Syncing hub", () => {
  //   cy.task('getProjectID').then((project_id) => {
  //     cy.request({
  //       method: "POST",
  //       url: Cypress.env("apiURL") + '/query',
  //       body: { 
  //         "operationName": "syncHub",
  //         "variables": {
  //           "projectID": project_id,
  //         },
  //         "query": `mutation syncHub($projectID: ID!){
  //           syncHub(id: $projectID){
  //             id
  //             RepoURL
  //             RepoBranch
  //             IsAvailable
  //             TotalExp
  //             HubName
  //             IsPrivate
  //             AuthType
  //             Token
  //             UserName
  //             Password
  //             IsRemoved
  //             SSHPrivateKey
  //             SSHPublicKey
  //             LastSyncedAt
  //           }
  //         }`
  //       },
  //     }).then((res) => {
  //       expect(res.status).to.eq(200);
  //       expect(res.body).to.have.nested.property("data.syncHub");
  //       cy.task('setHubID', res.body.data.syncHub[0].id);
  //     });
  //   });		
  // });

  it("Deleting the myhub", () => {
    cy.task('getHubID').then((hub_id) => {
      cy.request({
        method: "POST",
        url: Cypress.env("apiURL") + '/query',
        body: { 
          "operationName": "deleteMyHub",
          "variables": {
            "hub_id": hub_id
          },
          "query": `mutation deleteMyHub($hub_id: String!){
            deleteMyHub(hub_id: $hub_id)
          }`
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.nested.property("data.deleteMyHub");
      });
    });
  });
});
