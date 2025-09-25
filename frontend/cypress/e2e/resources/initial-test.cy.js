describe("Resource Management App", () => {
    it("should load the resources page", () => {
        cy.visit("http://localhost:5173"); // adjust if route is different
        cy.contains("Resources"); // check if the heading appears
    });
});