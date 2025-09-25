it("should show an error message if fetching resources fails", () => {
    // Stub the GET /resources API to fail
    cy.intercept("GET", "/api/resources/**", {
        statusCode: 500,
        body: { detail: "Internal Server Error" },
    }).as("getResourcesFail");

    cy.visit("http://localhost:5173/");

    cy.wait("@getResourcesFail");

    // Assert that the error banner appears
    cy.get("div").contains("Failed to fetch resources").should("exist");
});

it("should show an error message if creating a resource fails", () => {
    cy.intercept("POST", "/api/resources/", {
        statusCode: 400,
        body: { title: ["This field is required."] },
    }).as("createResourceFail");

    cy.visit("http://localhost:5173/add");

    cy.get('input[name="title"]').type("Fail Resource");
    cy.get('textarea[name="description"]').type("Testing failure");
    cy.get('input[name="upload_url"]').type("https://example.com/file");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.wait("@createResourceFail");

    cy.contains("An error occurred").should("exist");
});

it("should handle delete failure gracefully", () => {
    cy.intercept("DELETE", "/api/resources/*", {
        statusCode: 500,
        body: { detail: "Cannot delete resource" },
    }).as("deleteFail");

    cy.visit("http://localhost:5173/");

    cy.get('button[name="delete"]').first().click();
    cy.get('button[name="confirmdelete"]').click();

    cy.wait("@deleteFail");

    cy.get("div").contains("Failed to delete resource. Please try again.").should("exist");
});

it("should show an error if editing a non-existent resource", () => {
    cy.intercept("PATCH", "http://localhost:8000/api/resources/**", {
        statusCode: 404,
        body: { detail: "Not found" },
    }).as("updateFail");

    cy.visit("http://localhost:5173/");
    cy.get('button[name="edit"]').first().click();

    cy.get('input[name="title"]').clear().type("Update Fail");
    cy.get('input[name="upload_url"]').clear().type("https://example.com/file");

    cy.get('button[type="submit"]').click();

    cy.wait("@updateFail");
    cy.contains("Submission Failed").should("exist");
});




