[![pipeline status](https://gitlab-sjc.cisco.com/sso-apps/persona-based-console/badges/develop/pipeline.svg)](https://gitlab-sjc.cisco.com/sso-apps/persona-based-console/commits/develop)
[![coverage report](https://gitlab-sjc.cisco.com/sso-apps/persona-based-console/badges/develop/coverage.svg)](https://gitlab-sjc.cisco.com/sso-apps/persona-based-console/commits/develop)

# Persona Based Console

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. To build only the sdp-api library, run `npm run build:sdp`;

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running Automation tests

Run `npm run test:automation` to execute the automation tests via [Cypress](https://www.cypress.io/).

## Running Static Analysis

Run `npm run lint` to lint the project.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# NOTES
### Files to Update Upon CUI Change

Current version of CUI is at 1.3.5.
If this is upgraded and colors happen to change, to match the colors, the file at:
`src/app/classes/severities.ts` will need to be updated with the latest CSS code

### Generating sdp-api source files
To generate all of the sdp-api files at once, use `npm run generate:sdp`. To generate only a single component, use `npm run generate:sdp:inventory` etc.
