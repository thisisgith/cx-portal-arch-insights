import MockService from '../support/mockService';

const elearningMock = new MockService('ELearningScenarios');
const elearningOnboardScenario = elearningMock.getScenario('GET', '(E-Learning) IBN-Wireless Assurance-Onboard');
const elearningItems = elearningOnboardScenario.response.body.items;

const successPathMock = new MockService('SuccessPathScenarios');
const successPathOnboardScenario = successPathMock.getScenario('GET', '(SP) IBN-Wireless Assurance-Onboard');
const successPathItems = successPathOnboardScenario.response.body.items;

// Strip out all possible archetypes
const successPathArchetypes = Cypress._.chain(successPathItems)
	.map('archetype')
	.uniq()
	.value();

// Split up the eLearning response by type
const allELearningItems = [];
const allCertificationsItems = [];
const allRemoteItems = [];
elearningItems.forEach(scenario => {
	switch (scenario.type) {
		case 'E-Course':
			allELearningItems.push(scenario);
			break;
		case 'Cisco Training on Demand Courses':
		case 'Videos':
			allCertificationsItems.push(scenario);
			break;
		case 'training':
			allRemoteItems.push(scenario);
			break;
		default:
			Cypress.log({
				name: 'LOG',
				message: `UNRECOGNIZED LEARNING SCENARIO TYPE: ${scenario.type}`,
			});
	}
});

// Split the arrays as we will only ever display the first 3 elements
const visibleELearningItems = allELearningItems.slice(0, 3);
const invisibleELearningItems = allELearningItems.slice(3);
const visibleCertificationsItems = allCertificationsItems.slice(0, 3);
const invisibleCertificationsItems = allCertificationsItems.slice(3);
const visibleRemoteItems = allRemoteItems.slice(0, 3);
const invisibleRemoteItems = allRemoteItems.slice(3);
const visibleSuccessPathItems = successPathItems.slice(0, 3);
const invisibleSuccessPathItems = successPathItems.slice(3);

describe('Learn Panel', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for both E-Learning and Success Paths to finish loading
		cy.waitForAppLoading('elearningLoading', 15000);
		cy.waitForAppLoading('successPathsLoading', 15000);
	});

	describe('PBC-125 Learning Content', () => {
		it('Learning panel should be displayed', () => {
			cy.getByAutoId('Learn Panel').should('contain', 'Learn');
		});

		it('Learning card sections only show when there is data in them', () => {
			let elearningFound = false;
			let certificationsFound = false;
			let trainingFound = false;
			elearningItems.forEach(scenario => {
				switch (scenario.type) {
					case 'E-Course':
						elearningFound = true;
						break;
					case 'Cisco Training on Demand Courses':
					case 'Videos':
						certificationsFound = true;
						break;
					case 'training':
						trainingFound = true;
						break;
					default:
						Cypress.log({
							name: 'LOG',
							message: `UNRECOGNIZED LEARNING SCENARIO TYPE: ${scenario.type}`,
						});
				}
			});
			if (elearningFound) {
				cy.getByAutoId('LearnPanel-ELearningBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-ELearningBlock').should('not.exist');
			}
			if (certificationsFound) {
				cy.getByAutoId('LearnPanel-CertificationsBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-CertificationsBlock').should('not.exist');
			}
			if (trainingFound) {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('not.exist');
			}

			if (successPathItems.length > 0) {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('exist')
					.and('contain', 'Product Guides')
					.and('contain', 'Resources to fine-tune your tech');
			} else {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('not.exist');
			}
		});

		it('Should display up to 3 API results for each learning section', () => {
			// Verify only up to the first three are shown in each section
			visibleELearningItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-ELearningBlock')
					.should('contain', scenario.title);
			});
			invisibleELearningItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-ELearningBlock')
					.should('not.contain', scenario.title);
			});
			visibleCertificationsItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-CertificationsBlock')
					.should('contain', scenario.title);
			});
			invisibleCertificationsItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-CertificationsBlock')
					.should('not.contain', scenario.title);
			});
			visibleRemoteItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock')
					.should('contain', scenario.title);
			});
			invisibleRemoteItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock')
					.should('not.contain', scenario.title);
			});
			visibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock')
					.should('contain', scenario.title);
			});
			invisibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock')
					.should('not.contain', scenario.title);
			});
		});
	});

	describe('PBC-15: (UI) View - Lifecycle - Product Guides - View All Card View', () => {
		it('PBC-142/PBC-143: View All Product Guides link should open modal with all results', () => {
			cy.getByAutoId('ShowModalPanel-_ProductGuide_').click();
			cy.get('#successModal').should('exist')
				.and('contain', 'Product Guides')
				.and('contain', '\'How-to\' resources for planning, installation and more')
				.and('contain', `${successPathItems.length} topics available`);
			successPathItems.forEach(scenario => {
				cy.getByAutoId('SuccessCard').should('contain', scenario.archetype)
					.and('contain', scenario.title)
					// Note that type: 'Web Page' gets displayed as 'Web'
					.and('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
					// The UI will only display a duration if it is not null
					.and('contain', (scenario.duration !== null ? scenario.duration : ''));
			});
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.get('#successModal').should('not.exist');
		});

		it('PBC-142/PBC-143: View All Product Guides modal includes content type icons', () => {
			cy.getByAutoId('ShowModalPanel-_ProductGuide_').click();
			cy.get('#successModal').should('exist');
			successPathItems.forEach((scenario, index) => {
				switch (scenario.type) {
					case 'Video':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-play-contained icon-small half-padding-right"]')
							.should('exist');
						break;
					case 'Web Page':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-apps icon-small half-padding-right"]')
							.should('exist');
						break;
					case 'PDF':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-file-pdf-o icon-small half-padding-right"]')
							.should('exist');
						break;
					default:
						Cypress.log({
							name: 'LOG',
							message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${scenario.type}`,
						});
				}
				// Should only display a clock icon if there is a duration
				cy.getByAutoId('SuccessCard').eq(index).within(() => {
					if (scenario.duration !== null) {
						cy.get('span[class="icon-clock icon-small half-padding-right"]').should('exist');
					} else {
						cy.get('span[class="icon-clock icon-small half-padding-right"]').should('not.exist');
					}
				});
			});
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.get('#successModal').should('not.exist');
		});
	});

	describe('PBC-16: (UI) View - Solution Based: Success Path Content', () => {
		it('PBC-188: All Success Path content should cross-launch to specified URL', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			visibleSuccessPathItems.forEach(scenario => {
				cy.get(`a[href="${scenario.url}"]`).should('contain', scenario.title)
					.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
			});
		});

		it('PBC-188: All Success Path View All links should cross-launch to specified URL', () => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_ProductGuide_').click();
			cy.get('#successModal').should('exist');

			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			successPathItems.forEach(scenario => {
				cy.get('#successModal').within(() => {
					cy.get(`a[href="${scenario.url}"]`)
						// Note that type: 'Web Page' gets displayed as 'Web'
						.should('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
						// target: _blank indicates we'll open in a new tab
						.and('have.attr', 'target', '_blank');
				});
			});

			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.get('#successModal').should('not.exist');
		});
	});

	describe('PBC-110: (UI) View - Solution Racetrack - PBC Exposing Learning Content', () => {
		it('PBC-210: All E-Learning content should cross-launch to specified URL', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			visibleELearningItems.forEach(scenario => {
				cy.get(`a[href="${scenario.url}"]`).should('contain', scenario.title)
					.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
			});
		});

		it('PBC-210: E-Learning View All should cross-launch to digital-learning', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			cy.getByAutoId('_ELearning_-ViewAll').should('have.attr', 'href', 'https://digital-learning.cisco.com/cx#/')
				.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
		});
	});

	describe('PBC-200: (UI) View - Lifecycle - Product Guides - Filter by Category', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_ProductGuide_').click();
			cy.get('#successModal').should('exist');
		});

		after(() => {
			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.get('#successModal').should('not.exist');
		});

		it('View All Product Guides modal shows all archetypes by default', () => {
			// Verify all cards are displayed by default
			cy.getByAutoId('SuccessCard').then(cards => {
				expect(cards.length).to.eq(successPathItems.length);
			});
		});

		successPathArchetypes.forEach(archetype => {
			it(`View All Product Guides modal can filter by archetype: ${archetype}`, () => {
				// Filter by archetype, verify the count
				cy.get('#successModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('SuccessCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		it('View All Product Guides modal can filter by archetype: Not selected', () => {
			// Filter by archetype, verify the count. Note: 'Not selected' should show all items
			cy.get('#successModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});

		it('View All Product Guides modal filter should be sticky', () => {
			cy.get('#successModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.get('#successModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_ProductGuide_').click();
			cy.get('#successModal').should('exist');

			// Verify the filter is still in place
			cy.get('#successModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All Product Guides modal filter should be searchable', () => {
			cy.get('#successModal').within(() => {
				// Start typing an archetype in the filter field
				cy.getByAutoId('cui-select').click()
					.get('input')
					.type('Gett');
				cy.get('cui-vscroll-viewport').within(() => {
					// Verify the filters have been filtered to match the input
					cy.get('a').then($filters => {
						$filters.toArray().forEach($filter => {
							cy.wrap($filter).should('have.attr', 'title')
								.and('contain', 'Gett');
						});
					});
				});
			});
		});

		it('View All Product Guides modal filter should be clearable', () => {
			cy.get('#successModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Getting Started"]').click();

				cy.getByAutoId('SuccessCard').then(cards => {
					const filteredItems = successPathItems.filter(item => (item.archetype === 'Getting Started'));
					expect(cards.length).to.eq(filteredItems.length);
				});

				// Click the clear filter button, should show all items again
				cy.getByAutoId('category-filter').within(() => {
					cy.get('span[class="icon-close"]').click();
				});

				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});
	});
});
