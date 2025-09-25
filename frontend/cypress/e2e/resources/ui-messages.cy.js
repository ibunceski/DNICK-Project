it("should show a success message after creating a resource", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('input[name="title"]').type("UI Test Resource");
    cy.get('textarea[name="description"]').type("Testing success message");
    cy.get('input[name="upload_url"]').type("https://example.com/file");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.contains("Submission Successful").should("exist");

    cy.get('button[name="done"]').click();

});

it("should show an error message if deletion fails", () => {
    cy.intercept("DELETE", "/api/resources/*", {
        statusCode: 500,
        body: { detail: "Server error" },
    }).as("deleteFail");

    cy.visit("http://localhost:5173/");

    cy.get('button[name="delete"]').first().click();
    cy.get('button[name="confirmdelete"]').click();

    cy.wait("@deleteFail");

    cy.get(".mb-4").contains("Failed to delete resource").should("exist");
});

it("should show an error message if resources fail to load", () => {
    cy.intercept("GET", "/api/resources/**", {
        statusCode: 500,
        body: { detail: "Server error" },
    }).as("getFail");

    cy.visit("http://localhost:5173/");

    cy.wait("@getFail");

    cy.get(".mb-4").contains("Failed to fetch resources").should("exist");
});

it("should show validation message if submitting empty title", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('button[type="submit"]').click();

    cy.get('input[name="title"]').then(($input) => {
        expect($input[0].validationMessage).to.eq("Please fill out this field.");
    });
});


it("should show a success message after editing a resource", () => {
    cy.visit("http://localhost:5173/");

    cy.get('button[name="edit"]').first().click();

    cy.get('input[name="title"]').clear().type("Edited Cypress Resource");
    cy.get('textarea[name="description"]').clear().type("Edited description");

    cy.get('button[type="submit"]').click();

    cy.contains("Submission Successful").should("exist");

    cy.get('button[name="okay"]').click();

    cy.contains("Edited Cypress Resource").should("exist");
});

it("should show a success message after deleting a resource", () => {
    cy.visit("http://localhost:5173/");

    cy.get('button[name="delete"]').first().click();
    cy.get('button[name="confirmdelete"]').click();

    cy.get(".fixed").contains("✅ Resource deleted").should("exist");

    cy.wait(3500);
    cy.get(".fixed").should("not.exist");
});


