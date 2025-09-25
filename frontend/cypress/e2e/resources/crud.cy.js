describe("Resource Management App", () => {
    const baseUrl = "http://localhost:5173";
    const apiUrl = "http://localhost:8000/api";

    let createdResourceId;

    it("should list resources", () => {
        cy.visit(`${baseUrl}/`);
        cy.contains("Resources");
    });

    it("should create a new resource", () => {
        cy.visit(`${baseUrl}/add`);

        cy.intercept("POST", `${apiUrl}/resources/`).as("createResource");

        cy.get('input[name="title"]').type("Cypress Test Resource");
        cy.get('textarea[name="description"]').type("Created via Cypress");
        cy.get('input[name="upload_url"]').type("https://example.com/file");
        cy.get('select[name="language"]').select("en");
        cy.get('button[type="submit"]').click();
        cy.get('button[name="done"]').click();

        cy.wait("@createResource").then((interception) => {
            cy.log(JSON.stringify(interception.response.body));

            createdResourceId = interception.response.body.id;

            expect(interception.response.statusCode).to.eq(201);
            expect(createdResourceId).to.exist;
        });

        cy.contains("Cypress Test Resource");
    });


    it("should view the created resource", () => {
        cy.visit(`${baseUrl}/`);
        cy.contains("Cypress Test Resource");
        cy.contains("Created via Cypress");
    });

    it("should update the resource", () => {
        cy.visit(`${baseUrl}/`);
        cy.get('button[name="edit"]').first().click();
        cy.get('input[name="title"]').clear().type("Updated Cypress Resource");
        cy.get('button[type="submit"]').click();
        cy.contains("Updated Cypress Resource");
    });

    it("should delete the resource", () => {
        cy.visit(`${baseUrl}/`);
        cy.get('button[name="delete"]').first().click();
        cy.get('button[name="confirmdelete"]').click();
        cy.contains("Resource deleted").should("exist");
    });
});
