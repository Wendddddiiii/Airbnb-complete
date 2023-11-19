import "cypress-file-upload";

context("Test one - happy path", () => {
  it("Registers successfully", () => {
    cy.visit("localhost:3000/register");
    const name = "betty";
    const email = "betty@gmail.com";
    const password = "123";
    cy.get("input[name=name]").focus().type(name);
    cy.get("input[name=email]").focus().type(email);
    cy.get("input[name=password]").focus().type(password);
    cy.get("button")
      .contains("Submit")
      .should("be.visible")
      .should("not.be.disabled");
  });
  beforeEach(() => {
    cy.visit("localhost:3000/login");
    const email = "betty@gmail.com";
    const password = "123";
    cy.get("input[name=email]").focus().type(email);
    cy.get("input[name=password]").focus().type(password);

    cy.get("button")
      .contains("Submit")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("Creates a new listing successfully ", () => {
    cy.visit("http://localhost:3000/createListing");
    const title = "Ocean View";
    const address = "18 canning St";
    const price = "240";
    const propertyType = "House";
    const bathrooms = "4";
    const bedrooms = "3";
    const amenities = "horse fence and pool";

    cy.get("input[name=title]").focus().type(title);
    cy.get("input[name=address]").focus().type(address);
    cy.get("input[name=price]").focus().type(price);
    cy.get("input[name=amenities]").focus().type(amenities);
    cy.get("input[name=bathrooms]").focus().type(bathrooms);
    cy.get("input[name=bedrooms]").focus().type(bedrooms);
    cy.get("input[name=propertyType]").focus().type(propertyType);
    cy.get("button")
      .contains("Submit")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("Updates the thumbnail and title of the listing successfully", () => {
    cy.visit("http://localhost:3000/editListing/774565260");
    cy.get("input[name=title]").clear().type("Updated Listing Title");
    // // cy.get("input[name= thumbnail]").focus().type(thumbnail);
    cy.get("button")
      .contains("Submit")
      .should("be.visible")
      .should("not.be.disabled");
    cy.get("button")
      .contains("Cancel")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("Publish a listing successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Hosted Listings").click();
  });

  it("Logs out of the application successfully", () => {
    cy.visit("localhost:3000/");
    cy.get("button")
      .contains("Log out")
      .should("be.visible")
      .should("not.be.disabled");
  });
});
