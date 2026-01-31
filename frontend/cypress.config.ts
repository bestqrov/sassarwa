{
  "e2e": {
    "baseUrl": "http://localhost:3001",
    "viewportWidth": 1280,
    "viewportHeight": 720,
    "video": false,
    "screenshotOnRunFailure": true,
    "defaultCommandTimeout": 10000,
    "requestTimeout": 15000,
    "responseTimeout": 15000,
    "supportFile": "cypress/support/e2e.ts",
    "specPattern": "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    "fixturesFolder": "cypress/fixtures"
  },
  "component": {
    "devServer": {
      "framework": "next",
      "bundler": "webpack"
    }
  }
}