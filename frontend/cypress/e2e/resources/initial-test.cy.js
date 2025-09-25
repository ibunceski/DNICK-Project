describe("Resource Management App", () => {
    it("should load the resources page", () => {
        cy.visit("http://localhost:5173");
        cy.contains("Resources");
    });
});