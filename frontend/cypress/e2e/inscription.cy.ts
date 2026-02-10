describe('Inscription Flow', () => {
    beforeEach(() => {
        // Assuming we have test data or seed the database
        cy.visit('/');
    });

    it('should allow admin to create a new student inscription', () => {
        // Login as admin
        cy.login('admin@example.com', 'password');

        // Navigate to inscriptions
        cy.visit('/admin/inscriptions');

        // Fill out the inscription form
        cy.get('[data-cy="student-name"]').type('Test Student');
        cy.get('[data-cy="student-surname"]').type('Test Surname');
        cy.get('[data-cy="student-phone"]').type('0612345678');
        cy.get('[data-cy="student-category"]').select('Soutien Scolaire Primaire');
        cy.get('[data-cy="student-amount"]').type('1500');

        // Submit the form
        cy.get('[data-cy="submit-inscription"]').click();

        // Check success modal appears
        cy.get('[data-cy="success-modal"]').should('be.visible');
        cy.contains('Inscription Réussie !').should('be.visible');

        // Check student appears in students list
        cy.visit('/admin/students');
        cy.contains('Test Student Test Surname').should('be.visible');
    });

    it('should allow secretary to create a new student inscription', () => {
        // Login as secretary
        cy.login('secretary@example.com', 'password');

        // Navigate to inscriptions
        cy.visit('/secretary/inscriptions');

        // Fill out the inscription form for FORMATION
        cy.get('[data-cy="formation-radio"]').check();
        cy.get('[data-cy="student-name"]').type('Formation Student');
        cy.get('[data-cy="student-surname"]').type('Formation Surname');
        cy.get('[data-cy="student-phone"]').type('0612345679');
        cy.get('[data-cy="student-email"]').type('formation@example.com');
        cy.get('[data-cy="student-category"]').select('Développement Personnel');
        cy.get('[data-cy="student-amount"]').type('2500');

        // Submit the form
        cy.get('[data-cy="submit-inscription"]').click();

        // Check success modal appears
        cy.get('[data-cy="success-modal"]').should('be.visible');
        cy.contains('Inscription Réussie !').should('be.visible');
    });

    it('should validate required fields', () => {
        cy.login('admin@example.com', 'password');
        cy.visit('/admin/inscriptions');

        // Try to submit without filling required fields
        cy.get('[data-cy="submit-inscription"]').click();

        // Check validation errors appear
        cy.contains('Le champ name est requis').should('be.visible');
        cy.contains('Le champ surname est requis').should('be.visible');
        cy.contains('Le champ phone est requis').should('be.visible');
    });

    it('should handle form switching between SOUTIEN and FORMATION', () => {
        cy.login('admin@example.com', 'password');
        cy.visit('/admin/inscriptions');

        // Default should be SOUTIEN
        cy.get('[data-cy="soutien-radio"]').should('be.checked');

        // Switch to FORMATION
        cy.get('[data-cy="formation-radio"]').check();

        // Check FORMATION specific fields appear
        cy.get('[data-cy="student-email"]').should('be.visible');
        cy.contains('Détails de la Formation').should('be.visible');

        // Switch back to SOUTIEN
        cy.get('[data-cy="soutien-radio"]').check();

        // Check SOUTIEN specific fields appear
        cy.contains('Détails du Soutien Scolaire').should('be.visible');
    });
});