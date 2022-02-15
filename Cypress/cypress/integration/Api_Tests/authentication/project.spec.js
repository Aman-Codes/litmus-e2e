/// <reference types="Cypress" />

import * as user from "../../../fixtures/Users.json";
import { endpoints } from "../../../fixtures/authenticationEndpoints";

const Project1Name = "Project1u",
  Project2Name = "Project2u";
let user1Id,
  user2Id,
  user3Id,
  adminAccessToken,
  user1AccessToken,
  user2AccessToken,
  user3AccessToken,
  Project1Id,
  Project2Id;

before("create 3 test users", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("authURL") + endpoints.login(),
    body: {
      username: user.AdminName,
      password: user.AdminPassword,
    },
  })
    .then((res) => {
      adminAccessToken = res.body.access_token;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + "/create",
        headers: {
          authorization: `Bearer ${adminAccessToken}`,
        },
        body: { ...user.user1 },
      });
    })
    .then((res) => {
      user1Id = res.body._id;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + "/create",
        headers: {
          authorization: `Bearer ${adminAccessToken}`,
        },
        body: { ...user.user2 },
      });
    })
    .then((res) => {
      user2Id = res.body._id;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + "/create",
        headers: {
          authorization: `Bearer ${adminAccessToken}`,
        },
        body: { ...user.user3 },
      });
    })
    .then((res) => {
      user3Id = res.body._id;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + endpoints.login(),
        body: {
          username: user.user1.username,
          password: user.user1.password,
        },
      });
    })
    .then((res) => {
      user1AccessToken = res.body.access_token;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + endpoints.login(),
        body: {
          username: user.user2.username,
          password: user.user2.password,
        },
      });
    })
    .then((res) => {
      user2AccessToken = res.body.access_token;
      return cy.request({
        method: "POST",
        url: Cypress.env("authURL") + endpoints.login(),
        body: {
          username: user.user3.username,
          password: user.user3.password,
        },
      });
    })
    .then((res) => {
      user3AccessToken = res.body.access_token;
    });
});

/*
  Project1: admin (Owner), user3 (Editor)
  Project2: user1(Owner), user2(Editor), user3(Viewer)
*/
describe("Testing post request to createProject api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.createProject(),
      body: {
        project_name: user.AdminName,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  /* it("Testing api without project name [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.createProject(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_name: "",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  }); */

  it("Testing api from admin account", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.createProject(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_name: Project1Name,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Members).to.be.an("array");
      expect(res.body.data.Members.length).to.eq(1);
      Project1Id = res.body.data.ID;
    });
  });

  it("Testing api from non-admin account", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.createProject(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        project_name: Project2Name,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Members).to.be.an("array");
      expect(res.body.data.Members.length).to.eq(1);
      Project2Id = res.body.data.ID;
    });
  });
});

describe("Testing get request to listProjects api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.listProjects(),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api from admin account", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.listProjects(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      res.body.data.forEach((project) => {
        ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
          (property) => {
            expect(project).to.have.property(property);
          }
        );
        expect(project.Members).to.be.an("array");
      });
    });
  });

  it("Testing api from non-admin account", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.listProjects(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      res.body.data.forEach((project) => {
        ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
          (property) => {
            expect(project).to.have.property(property);
          }
        );
        expect(project.Members).to.be.an("array");
        expect(project.Members.length).to.eq(1);
      });
    });
  });
});

describe("Testing get request to getProjectById api [ Should not be possible ]", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getProjectById(Project1Id),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api from admin account with valid project id", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getProjectById(Project1Id),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Members).to.be.an("array");
      expect(res.body.data.Members.length).to.eq(1);
    });
  });

  it("Testing api from admin account with Project2Id", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getProjectById(Project2Id),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("data");
    });
  });

  it("Testing api from non-admin account with valid project id", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getProjectById(Project2Id),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["ID", "Name", "Members", "State", "CreatedAt", "UpdatedAt"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Members).to.be.an("array");
      expect(res.body.data.Members.length).to.eq(1);
    });
  });

  /* it("Testing api from non-admin account with no project access [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getProjectById(Project1Id),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  }); */
});

describe("Testing post request to sendInvitation api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      body: {
        project_id: Project1Id,
        user_id: user1Id,
        role: "Viewer",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without project_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        user_id: user1Id,
        role: "Viewer",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without user_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        role: "Viewer",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });

  /* it("Testing api without role [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("invalid_request");
    });
  }); */

  it("Sending invitation of project2 to user2 [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project2Id,
        user_id: user2Id,
        role: "Viewer",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Sending invitation of project1 to user2", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user2Id,
        role: "Viewer",
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
    });
  });

  it("Sending invitation of project1 to user3", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user3Id,
        role: "Editor",
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
    });
  });

  it("Sending invitation of project2 to user2", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        project_id: Project2Id,
        user_id: user2Id,
        role: "Editor",
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
    });
  });

  it("Sending invitation of project2 to user3", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.sendInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        project_id: Project2Id,
        user_id: user3Id,
        role: "Viewer",
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
    });
  });
});

describe("Testing post request to declineInvitation api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.declineInvitation(),
      body: {
        project_id: Project1Id,
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without project_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.declineInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without user_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.declineInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        project_id: Project1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });

  it("Decline invitation which was never sent [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.declineInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });

  it("Decline invitation of project1 by user2", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.declineInvitation(),
      headers: {
        authorization: `Bearer ${user2AccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user2Id,
      },
    }).then((res) => {
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.eq("Successful");
    });
  });
});

describe("Testing post request to acceptInvitation api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      body: {
        project_id: Project1Id,
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without project_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api without user_id [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      body: {
        project_id: Project1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });

  it("Accept invitation which was never sent [ Should not be possible ]", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user1Id,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });

  it("Accept invitation of project1 by user3", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${user3AccessToken}`,
      },
      body: {
        project_id: Project1Id,
        user_id: user3Id,
      },
    }).then((res) => {
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.eq("Successful");
    });
  });

  it("Accept invitation of project2 by user2", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${user2AccessToken}`,
      },
      body: {
        project_id: Project2Id,
        user_id: user2Id,
      },
    }).then((res) => {
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.eq("Successful");
    });
  });

  it("Accept invitation of project2 by user3", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("authURL") + endpoints.acceptInvitation(),
      headers: {
        authorization: `Bearer ${user3AccessToken}`,
      },
      body: {
        project_id: Project2Id,
        user_id: user3Id,
      },
    }).then((res) => {
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.eq("Successful");
    });
  });
});

describe("Testing get request to getUserWithProject api", () => {
  it("Testing api without access_token [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url:
        Cypress.env("authURL") +
        endpoints.getUserWithProject(user.user3.username),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("unauthorized");
    });
  });

  it("Testing api with invalid username [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("authURL") + endpoints.getUserWithProject("abc"),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
      expect(res.body.error).to.eq("user does not exists");
    });
  });

  /*it("Testing api by non-admin user [ Should not be possible ]", () => {
    cy.request({
      method: "GET",
      url:
        Cypress.env("authURL") +
        endpoints.getUserWithProject(user.user3.username),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("error_description");
    });
  });*/

  /*it("Testing api to get self project information", () => {
    cy.request({
      method: "GET",
      url:
        Cypress.env("authURL") +
        endpoints.getUserWithProject(user.user1.username),
      headers: {
        authorization: `Bearer ${user1AccessToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["CreatedAt", "Email", "ID", "Name", "Projects", "Username"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Projects).to.be.an("array");
      res.body.data.Projects.forEach((project) => {
        ["ID", "CreatedAt", "Members", "Name", "State", "UpdatedAt"].forEach(
          (property) => {
            expect(project).to.have.property(property);
          }
        );
        expect(project.Members).to.be.an("array");
        ["Invitation", "JoinedAt", "Role", "UserID"].forEach((property) => {
          expect(project.Members).to.have.property(property);
        });
      });
    });
  });*/

  it("Testing api by admin user", () => {
    cy.request({
      method: "GET",
      url:
        Cypress.env("authURL") +
        endpoints.getUserWithProject(user.user2.username),
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    }).then((res) => {
      expect(res.body).to.have.property("data");
      ["CreatedAt", "Email", "ID", "Name", "Projects", "Username"].forEach(
        (property) => {
          expect(res.body.data).to.have.property(property);
        }
      );
      expect(res.body.data.Projects).to.be.an("array");
      res.body.data.Projects.forEach((project) => {
        ["ID", "CreatedAt", "Members", "Name", "State", "UpdatedAt"].forEach(
          (projectProperty) => {
            expect(project).to.have.property(projectProperty);
          }
        );
        expect(project.Members).to.be.an("array");
        ["Invitation", "JoinedAt", "Role", "UserID"].forEach(
          (memberProperty) => {
            expect(project.Members).to.have.property(memberProperty);
          }
        );
      });
    });
  });
});
