it("should not allow creating a resource without required fields", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('button[type="submit"]').click();

    cy.get('input[name="title"]')
        .then(($input) => {
            expect($input[0].validationMessage).to.eq("Please fill out this field.");
        });

    cy.url().should("include", "/add");
});

it("should show error when entering invalid upload URL", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('input[name="title"]').type("Invalid URL Resource");
    cy.get('textarea[name="description"]').type("Testing validation");
    cy.get('input[name="upload_url"]').type("not-a-url");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.get('input[name="upload_url"]').then(($input) => {
        expect($input[0].validationMessage).to.eq("Please enter a URL.");
    });
});

it("should show error when submitting without file or url", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('input[name="title"]').type("Invalid Resource");
    cy.get('textarea[name="description"]').type("Testing validation");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.contains("Please provide a file or an URL.")
});

it("should show error when submitting with file and url", () => {
    cy.visit("http://localhost:5173/add");

    cy.get('input[name="title"]').type("Invalid Resource");
    cy.get('textarea[name="description"]').type("Testing validation");

    cy.get('input[name="upload_file"]').attachFile("test.pdf");

    cy.get('input[name="upload_url"]').type("https://finki.ukim.mk");
    cy.get('select[name="language"]').select("en");

    cy.get('button[type="submit"]').click();

    cy.contains("Please provide either a file or an URL, not both").should("exist");
});
