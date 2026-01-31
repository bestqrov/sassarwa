// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            createStudent(studentData: any): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.session([email, password], () => {
        cy.visit('/login');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.url().should('not.include', '/login');
    });
});

Cypress.Commands.add('createStudent', (studentData: any) => {
    cy.get('[data-cy="add-student-button"]').click();
    cy.get('[data-cy="student-name"]').type(studentData.name);
    cy.get('[data-cy="student-surname"]').type(studentData.surname);
    cy.get('[data-cy="student-phone"]').type(studentData.phone);
    cy.get('[data-cy="student-category"]').select(studentData.category);
    cy.get('[data-cy="student-amount"]').type(studentData.amount);
    cy.get('[data-cy="submit-student"]').click();
    cy.get('[data-cy="success-modal"]').should('be.visible');
});