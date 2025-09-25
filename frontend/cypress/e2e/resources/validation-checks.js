it("should not allow creating a resource without required fields", () => {
    cy.visit(`${baseUrl}/add`);

    // try submitting without filling required inputs
    cy.get('button[type="submit"]').click();

    // check error messages
    cy.contains("Title is required").should("exist");
    cy.contains("Description is required").should("exist");

    // form should still be visible, not redirect
    cy.url().should("include", "/add");
});

it("should show error when entering invalid upload URL", () => {
    cy.visit(`${baseUrl}/add`);

    cy.get('input[name="title"]').type("Invalid URL Resource");
    cy.get('textarea[name="description"]').type("Testing validation");
    cy.get('input[name="upload_url"]').type("not-a-url");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.contains("Please enter a valid URL").should("exist");
});
