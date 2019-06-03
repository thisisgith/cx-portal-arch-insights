/// <reference types="Cypress" />

import MockService from '../support/mockService';

const elearningMock = new MockService('ELearningScenarios');
const elearningOnboardScenario = elearningMock.getScenario('GET', '(E-Learning) IBN-Assurance-Onboard');
const elearningItems = elearningOnboardScenario.response.body.items;

const successPathMock = new MockService('SuccessPathScenarios');
const successPathOnboardScenario = successPathMock.getScenario('GET', '(SP) IBN-Assurance-Onboard');
const successPathItems = successPathOnboardScenario.response.body.items;

describe('PBC-125 Learning Content', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for both E-Learning and Success Paths to finish loading
		cy.waitForAppLoading('elearningLoading', 15000);
		cy.waitForAppLoading('successPathsLoading', 15000);
	});

	it('Learning panel should be displayed', () => {
		cy.getByAutoId('Learn Panel').should('contain', 'Learn');
	});

	it('Learning card sections only show when there is data in them', () => {
		let elearningFound = false;
		let certificationsFound = false;
		let trainingFound = false;
		elearningItems.forEach((scenario) => {
			switch(scenario.type) {
				case 'elearning':
                    elearningFound = true;
                    break;
                case 'certifications':
                    certificationsFound = true;
                    break;
                case 'training':
                    trainingFound = true;
                    break;
                default:
                    console.debug('UNRECOGNIZED LEARNING SCENARIO TYPE: ' + scenario.type);
			}
		});
		if(elearningFound) {
			cy.getByAutoId('LearnPanel-ELearningBlock').should('exist');
		} else {
			cy.getByAutoId('LearnPanel-ELearningBlock').should('not.exist');
		}
		if(certificationsFound) {
			cy.getByAutoId('LearnPanel-CertificationsBlock').should('exist');
		} else {
			cy.getByAutoId('LearnPanel-CertificationsBlock').should('not.exist');
		}
		if(trainingFound) {
			cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('exist');
		} else {
			cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('not.exist');
		}

		if(successPathItems.length > 0) {
			cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('exist');
		} else {
			cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('not.exist');
		}
	});

	it('Should display all API results for each section - Onboard', () => {
		elearningItems.forEach((scenario) => {
            switch(scenario.type) {
                case 'elearning':
                    cy.getByAutoId('LearnPanel-ELearningBlock')
                        .should('contain', scenario.title);
                    break;
                case 'certifications':
                    cy.getByAutoId('LearnPanel-CertificationsBlock')
                        .should('contain', scenario.title);
                    break;
                case 'training':
                    cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock')
                        .should('contain', scenario.title);
                    break;
                default:
                    console.debug('UNRECOGNIZED LEARNING SCENARIO TYPE: ' + scenario.type);
            }
			
		});

		successPathItems.forEach((scenario) => {
			cy.getByAutoId('LearnPanel-SuccessPathsBlock')
				.should('contain', scenario.title);
		});
	});
});
