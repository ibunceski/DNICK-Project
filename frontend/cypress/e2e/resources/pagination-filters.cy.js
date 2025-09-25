describe("Resource List Pagination & Filters", () => {
    const baseUrl = "http://localhost:5173";
    const apiUrl = "http://localhost:8000/api";

    beforeEach(() => {
        cy.intercept("GET", `${apiUrl}/resources/**`).as("getResources");
        cy.visit(`${baseUrl}/`);
    });

    it("should paginate through resource pages", () => {
        cy.wait("@getResources");

        cy.get(".grid > div").should("have.length.at.least", 1);

        cy.get("button").contains("Next ▶").then($btn => {
            if (!$btn.is(":disabled")) {
                cy.wrap($btn).click();
                cy.wait("@getResources");
                cy.get(".grid > div").should("have.length.at.least", 1);
            }
        });

        cy.get("button").contains("Last ⏭").then($btn => {
            if (!$btn.is(":disabled")) {
                cy.wrap($btn).click();
                cy.wait("@getResources");
                cy.get(".grid > div").should("have.length.at.least", 0);
            }
        });
    });

    it("should change page size", () => {
        cy.wait("@getResources");

        cy.get(".grid > div").should("have.length.at.most", 12);

        cy.get("select").select("24");
        cy.wait("@getResources");
        cy.get(".grid > div").should("have.length.at.most", 24);
    });

    it("should create a resource and then filter by title", () => {
        const testTitle = "Cypress Test Resource";

        // Create a new resource via API
        cy.request("POST", "http://localhost:8000/api/resources/", {
            title: testTitle,
            description: "Created by Cypress for testing",
            language: "en",
            upload_url: "https://finki.ukim.mk"
            // add any required fields here
        }).then((response) => {
            expect(response.status).to.eq(201); // resource created
        });

        // Intercept the GET request to confirm filtering
        cy.intercept("GET", "**/resources/**").as("getResources");

        // Open filters
        cy.get("button").contains("Show Filters").click();

        // Apply filter
        cy.get('input[name="title"]').type(testTitle);
        cy.get("button").contains("Apply Filters").click();

        // Wait for filtered results
        cy.wait("@getResources");
        cy.wait(200);

        // Check that results contain the test resource
        cy.get(".grid > .karta")
            .should("have.length.at.least", 1)
            .each(($el) => {
                cy.wrap($el).should("contain.text", testTitle);
            });
    });


    it("should filter resources by multiple criteria", () => {
        cy.get("button").contains("Show Filters").click();

        cy.get('.px-3.py-2.cursor-pointer')
            .contains("English")
            .click();
        cy.get('input[name="has_file"]').check();
        cy.get("button").contains("Apply Filters").click();

        cy.wait("@getResources");

        cy.get(".grid > div").each(($el) => {
            cy.wrap($el).should("exist");
        });
    });

    it("should clear filters", () => {
        cy.get("button").contains("Show Filters").click();
        cy.get('input[name="title"]').type("Cypress Test Resource");
        cy.get("button").contains("Apply Filters").click();
        cy.wait("@getResources");

        cy.get("button").contains("Clear All").click();
        cy.wait("@getResources");

        cy.get(".grid > div").should("have.length.at.least", 1);
    });
});
